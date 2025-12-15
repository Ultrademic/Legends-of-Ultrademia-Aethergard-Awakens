import { player } from "../characters/player.js";
import { CombatCore } from "./combat_core.js";
import { spawnHitEffect } from "./projectiles.js";

export const SKILL_DATABASE = {
    "power_strike": {
        id: "power_strike",
        name: "Power Strike",
        description: "Delivers a powerful physical blow.",
        mpCost: 8,
        cooldown: 5.0,
        range: 2.0,
        power: 1.8,
        critMod: 1.0,
        type: "physical",
        anim: "attack",
        icon: "sword",
        vfx: "physical"
    },
    "mortal_blow": {
        id: "mortal_blow",
        name: "Mortal Blow",
        description: "A deadly attack with high critical chance.",
        mpCost: 15,
        cooldown: 8.0,
        range: 1.5,
        power: 1.5,
        critMod: 3.0,  
        type: "physical",
        anim: "attack",
        icon: "zap",
        vfx: "crit"
    },
    "shield_stun": {
        id: "shield_stun",
        name: "Shield Stun",
        description: "Strikes with a shield to disrupt the enemy.",
        mpCost: 18,
        cooldown: 12.0,
        range: 1.5,
        power: 1.1,
        type: "physical",
        anim: "attack",
        icon: "shield",
        vfx: "physical"
    },
    "wind_strike": {
        id: "wind_strike",
        name: "Wind Strike",
        description: "A sharp blade of wind magic.",
        mpCost: 12,
        cooldown: 4.0,
        range: 12.0, 
        power: 15, 
        type: "magic",
        anim: "attack",
        icon: "zap",
        vfx: "magic"
    },
    "heal": {
        id: "heal",
        name: "Self Heal",
        description: "Restores HP using magic.",
        mpCost: 20,
        cooldown: 6.0,
        range: 10.0,
        power: 45, 
        type: "magic",
        anim: "attack",
        icon: "heart",
        vfx: "heal"
    }
};

export const SkillSystem = {
    cooldowns: {},
    useSkill(skillId) {
        if (player.isBusy) return false;
        const skill = SKILL_DATABASE[skillId];
        if (!skill) return false;
        let target = player.target;
        if (skill.id === 'heal') {
             target = player; 
        } else {
            if (!target || target.dead) {
                player.dispatchMessage('error', `Invalid target.`);
                return false;
            }
        }
        const now = performance.now() / 1000;
        const lastUsed = this.cooldowns[skillId] || 0;
        if (now - lastUsed < skill.cooldown) {
            player.dispatchMessage('error', `${skill.name} is not ready.`);
            return false;
        }
        if (player.mp < skill.mpCost) {
            player.dispatchMessage('error', `Not enough MP.`);
            return false;
        }
        if (target !== player) {
            const dist = player.group.position.distanceTo(target.position);
            if (dist > skill.range + 1.0) {
                player.dispatchMessage('error', "Target is too far.");
                return false;
            }
        }
        player.mp -= skill.mpCost;
        this.cooldowns[skillId] = now;
        player.isBusy = true;
        setTimeout(() => { player.isBusy = false; }, 800);
        if (player.playAnimation) {
            player.playAnimation("attack");
        }
        let multiplier = 1.0;
        if (skill.type === "magic") {
            if (player.consumeSpiritshot && player.consumeSpiritshot()) {
                multiplier = 2.0;
                player.dispatchMessage('info', "Spiritshot!");
            }
        }
        setTimeout(() => {
            if (skill.type === 'magic' && skill.id === 'heal') {
                const mAtk = player.final.MATK || 10;
                const amount = skill.power * multiplier * Math.sqrt(mAtk);
                target.hp = Math.min(target.maxHp, target.hp + amount);
                player.dispatchMessage('success', `Healed for ${Math.floor(amount)} HP.`);
                spawnHitEffect(target.position, 'heal');
            } else {
                if (target && !target.dead) {
                    const result = CombatCore.handleAttack(player, target, {
                        skillPower: skill.power, 
                        critMod: skill.critMod || 1.0,
                        isSkill: true,
                        isMagic: skill.type === 'magic'
                    });
                    if (result) {
                        player.dispatchMessage('success', `${skill.name} hit for ${result.damage} damage!`);
                        spawnHitEffect(target.position, skill.vfx);
                        target.inCombat = true;
                        target.target = player;
                    }
                }
            }
        }, 400);
        return true;
    },
    getCooldown(skillId) {
        const skill = SKILL_DATABASE[skillId];
        if (!skill) return 0;
        const now = performance.now() / 1000;
        const lastUsed = this.cooldowns[skillId] || 0;
        return Math.max(0, (lastUsed + skill.cooldown) - now);
    },
    getSkillUI(skillId) {
        const data = SKILL_DATABASE[skillId];
        if (!data) return null;
        return {
            id: data.id,
            name: data.name,
            icon: data.icon,
            maxCooldown: data.cooldown,
            mpCost: data.mpCost,
            range: data.range,
            description: data.description
        };
    }
};