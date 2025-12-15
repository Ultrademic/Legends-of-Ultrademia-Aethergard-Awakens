
import * as THREE from "three";
import { scene as importedScene } from "../../core/renderer.js";
import { loadPlayerModel } from "../animation/anim_loader.js";
import { AnimationStateMachine } from "../animation/AnimationStateMachine.js";
import { computeFinalStats } from "./player_stats.js";
import { SkillSystem } from "../combat/skills.js";
import { initSkillInput } from "../combat/skill_input.js";
import { NG_SETS } from "../items/ng_sets.js";
import { BASE_CLASSES } from "../progression/base_classes.js";

const scene = importedScene || window.scene;

export const player = {
    group: null,
    mixer: null,
    actions: {},
    currentAction: null,
    animSM: null,
    name: "Unknown Hero",
    race: "human",
    baseClass: "Fighter", 
    archetype: "fighter", 
    level: 1,
    xp: 0,
    base: null, 
    final: null, 
    inCombat: false,
    target: null,
    isMoving: false,
    isBusy: false,
    inventory: [],
    equipment: {
        rightHand: null, leftHand: null, head: null, chest: null,
        legs: null, gloves: null, boots: null,
        necklace: null, earring1: null, earring2: null, ring1: null, ring2: null
    },
    adena: 0,
    skills: [],
    shotConfig: { soulshot: true, spiritshot: false },
    hp: 1, mp: 1, cp: 1,
    maxHp: 1, maxMp: 1, maxCp: 1,
    regenTimer: 0,
    REGEN_INTERVAL: 1.0,

    async spawn(race = "human", archetype = "fighter") {
        this.race = race;
        this.archetype = archetype;
        const classInfo = BASE_CLASSES[race]?.[archetype];
        this.baseClass = classInfo ? classInfo.name : "Adventurer";
        console.log(`%c[Player] Spawning ${this.baseClass} (${race} ${archetype})...`, "color:gold;font-weight:bold");
        this.group = await loadPlayerModel(race);
        this.group.position.set(0, 0, 2);
        this.group.keep = true;
        if (scene && scene.add) scene.add(this.group);
        this.inventory = [];
        this.adena = 500;
        if (archetype === 'mystic') {
            this.addItem("spiritshot_ng", 500, "Spiritshot (No-Grade)");
            this.shotConfig.spiritshot = true;
            this.shotConfig.soulshot = false;
        } else {
            this.addItem("soulshot_ng", 500, "Soulshot (No-Grade)");
            this.shotConfig.soulshot = true;
            this.shotConfig.spiritshot = false;
        }
        this.addItem("potion_healing", 5, "Lesser Healing Potion");
        const starterSet = NG_SETS[race]?.[archetype] || NG_SETS.human.fighter;
        if (starterSet.weapon) {
            const id = this.generateItemId(starterSet.weapon.name);
            this.addItem(id, 1, starterSet.weapon.name, starterSet.weapon);
            this.equipItem(id);
        }
        if (starterSet.armor) {
             const id = this.generateItemId(starterSet.armor.name);
             this.addItem(id, 1, starterSet.armor.name, starterSet.armor);
             this.equipItem(id);
        }
        this.recalculateStats();
        this.hp = this.final.maxHp;
        this.mp = this.final.maxMp;
        this.cp = this.final.maxCp || 50;
        this.skills = [];
        if (archetype === 'mystic') {
            this.skills.push("wind_strike");
            this.skills.push("heal");
        } else {
            this.skills.push("power_strike");
            if (race === "dark_elf") this.skills.push("mortal_blow");
            else this.skills.push("shield_stun");
        }
        initSkillInput();
        this.mixer = new THREE.AnimationMixer(this.group);
        this.actions = {};
        if (this.group.animations) {
            Object.entries(this.group.animations).forEach(([name, clip]) => {
                this.actions[name.toLowerCase()] = this.mixer.clipAction(clip);
            });
        }
        if (this.actions.idle) {
            this.actions.idle.play();
            this.currentAction = this.actions.idle;
        }
        this.animSM = new AnimationStateMachine(this);
        this.dispatchMessage('SYSTEM', `Welcome, ${this.name}. You are a ${this.baseClass}.`);
        return this.group;
    },

    dispatchMessage(type, text) {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('UI_SYSTEM_MESSAGE', { 
                detail: { text, type: type || 'info' } 
            }));
        }
    },

    recalculateStats() {
        const bonuses = {
            STR: 0, DEX: 0, CON: 0, INT: 0, WIT: 0, MEN: 0,
            PATK: 0, PDEF: 0, MATK: 0, MDEF: 0, maxHp: 0, maxMp: 0, maxCp: 0
        };
        Object.values(this.equipment).forEach(item => {
            if (!item) return;
            const stats = item.data || item; 
            if (stats.damage) bonuses.PATK += stats.damage;
            if (stats.defense) bonuses.PDEF += stats.defense;
            if (stats.stats) {
                Object.entries(stats.stats).forEach(([key, val]) => {
                    if (bonuses[key] !== undefined) bonuses[key] += val;
                });
            }
        });
        this.final = computeFinalStats(this.race, this.level, bonuses, this.archetype);
        this.maxHp = this.final.maxHp;
        this.maxMp = this.final.maxMp;
        this.maxCp = this.final.maxCp;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
        if (this.mp > this.maxMp) this.mp = this.maxMp;
        if (this.cp > this.maxCp) this.cp = this.maxCp;
    },

    getSlotForItem(itemData) {
        if (!itemData) return null;
        const type = itemData.type || "";
        if (["sword", "staff", "dagger", "bow", "blunt", "fist"].includes(type)) return "rightHand";
        if (["shield", "sigil"].includes(type)) return "leftHand";
        if (["cloth", "leather", "plate", "fullbody"].includes(type)) return "chest";
        if (["helmet", "head"].includes(type)) return "head";
        if (["gloves"].includes(type)) return "gloves";
        if (["boots"].includes(type)) return "boots";
        if (["necklace"].includes(type)) return "necklace";
        if (["earring"].includes(type)) return !this.equipment.earring1 ? "earring1" : (!this.equipment.earring2 ? "earring2" : "earring1");
        if (["ring"].includes(type)) return !this.equipment.ring1 ? "ring1" : (!this.equipment.ring2 ? "ring2" : "ring1");
        return null;
    },

    equipItem(itemId) {
        const invIndex = this.inventory.findIndex(i => i.id === itemId);
        if (invIndex === -1) return false;
        const invItem = this.inventory[invIndex];
        const slot = this.getSlotForItem(invItem.data || {});
        if (!slot) return false;
        if (this.equipment[slot]) this.unequipItem(slot);
        this.equipment[slot] = { ...invItem, count: 1 };
        invItem.count--;
        if (invItem.count <= 0) this.inventory.splice(invIndex, 1);
        this.recalculateStats();
        return true;
    },

    unequipItem(slot) {
        const equipped = this.equipment[slot];
        if (!equipped) return false;
        this.addItem(equipped.id, 1, equipped.name, equipped.data);
        this.equipment[slot] = null;
        this.recalculateStats();
        return true;
    },

    generateItemId(name) { return name.toLowerCase().replace(/[^a-z0-9]/g, "_"); },

    addItem(id, count = 1, name = "Item", data = {}) {
        const item = this.inventory.find(i => i.id === id);
        if (item) item.count += count;
        else this.inventory.push({ id, name, count, data });
    },
    
    buyItem(itemId, count, totalCost, itemName, itemData) {
        if (this.adena < totalCost) {
            this.dispatchMessage('error', `Not enough Adena!`);
            return false;
        }
        this.adena -= totalCost;
        this.addItem(itemId, count, itemName, itemData);
        this.dispatchMessage('success', `Purchased ${itemName}.`);
        return true;
    },
    
    sellItem(itemId, count) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item || item.count < count) return false;
        const price = item.data?.price || 1; 
        this.adena += price * count;
        item.count -= count;
        if (item.count <= 0) this.inventory = this.inventory.filter(i => i.id !== itemId);
        return true;
    },

    consumeSoulshot() {
        if (!this.shotConfig.soulshot) return false;
        const shot = this.inventory.find(i => i.id.includes("soulshot") && i.count > 0);
        if (shot) { shot.count--; if(shot.count<=0) this.inventory = this.inventory.filter(i=>i!==shot); return true; }
        return false;
    },

    consumeSpiritshot() {
        if (!this.shotConfig.spiritshot) return false;
        const shot = this.inventory.find(i => i.id.includes("spiritshot") && i.count > 0);
        if (shot) { shot.count--; if(shot.count<=0) this.inventory = this.inventory.filter(i=>i!==shot); return true; }
        return false;
    },

    usePotion() {
        if (this.hp <= 0) return false;
        const pot = this.inventory.find(i => i.id.includes("potion") && i.count > 0);
        if (pot) {
            pot.count--;
            if(pot.count<=0) this.inventory = this.inventory.filter(i=>i!==pot);
            this.hp = Math.min(this.maxHp, this.hp + 50);
            this.dispatchMessage('success', 'Used Potion.');
            return true;
        }
        return false;
    },
    
    toggleAutoShot(type) {
        if (this.shotConfig[type] !== undefined) {
            this.shotConfig[type] = !this.shotConfig[type];
            this.dispatchMessage('info', `Auto-${type} ${this.shotConfig[type] ? 'ON' : 'OFF'}`);
        }
    },

    useItem(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return { success: false };
        if (this.getSlotForItem(item.data)) { this.equipItem(itemId); return { success: true }; }
        if (itemId.includes('potion')) { this.usePotion(); return { success: true }; }
        if (itemId.includes('soulshot')) { this.toggleAutoShot('soulshot'); return { success: true }; }
        if (itemId.includes('spiritshot')) { this.toggleAutoShot('spiritshot'); return { success: true }; }
        return { success: false };
    },

    triggerSkill(index) {
        if (this.isBusy) return;
        const skillId = this.skills[index];
        if (skillId) SkillSystem.useSkill(skillId);
    },

    getSkillCooldowns() {
        const cds = {};
        this.skills.forEach(id => {
            const t = SkillSystem.getCooldown(id);
            if (t > 0) cds[id] = t;
        });
        return cds;
    },

    getSkillConfig() {
        return this.skills.map(id => SkillSystem.getSkillUI(id)).filter(s => s !== null);
    },

    playAnimation(name) {
        name = name.toLowerCase();
        if (!this.actions[name] || this.currentAction === this.actions[name]) return;
        if (this.currentAction) this.currentAction.fadeOut(0.15);
        const next = this.actions[name];
        next.reset().fadeIn(0.15).play();
        this.currentAction = next;
    },

    takeDamage(amount) {
        if (this.cp > 0) {
            if (this.cp >= amount) { this.cp -= amount; amount = 0; }
            else { amount -= this.cp; this.cp = 0; }
        }
        if (amount > 0) this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    },

    respawn() {
        this.hp = this.maxHp;
        this.mp = this.maxMp;
        this.cp = this.maxCp;
        this.inCombat = false;
        this.target = null;
        if (this.group) this.group.position.set(0, 0, 2);
        this.playAnimation("idle");
        this.dispatchMessage('SYSTEM', 'Resurrected at Village.');
    },

    regenerate() {
        if (this.hp <= 0) return;
        const reg = this.final;
        if (!reg) return;
        if (this.hp < this.maxHp) this.hp = Math.min(this.maxHp, this.hp + (reg.hpRegen || 1));
        if (this.mp < this.maxMp) this.mp = Math.min(this.maxMp, this.mp + (reg.mpRegen || 1));
        if (this.cp < this.maxCp) this.cp = Math.min(this.maxCp, this.cp + (reg.cpRegen || 1));
    },

    update(dt) {
        if (this.mixer) this.mixer.update(dt);
        if (this.hp <= 0) return;
        this.regenTimer += dt;
        if (this.regenTimer >= this.REGEN_INTERVAL) { this.regenerate(); this.regenTimer = 0; }
        if (this.isBusy) return;
        if (this.isMoving) { this.playAnimation("walk"); return; }
        this.playAnimation("idle");
    }
};
