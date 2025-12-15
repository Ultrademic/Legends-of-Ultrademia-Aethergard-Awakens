import { player } from "../characters/player.js";
import { QUESTS } from "../progression/starter_zone_quests.js";

const SAVE_KEY = "ULTRADEMIC_CHARACTERS_V1";
let activeSlotIndex = -1;

export const Persistence = {
    getSlots() {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return [null, null, null];
        try {
            const slots = JSON.parse(raw);
            return Array.isArray(slots) && slots.length === 3 ? slots : [null, null, null];
        } catch (e) {
            return [null, null, null];
        }
    },

    setActiveSlot(index) {
        if (index >= 0 && index < 3) activeSlotIndex = index;
    },

    save() {
        if (activeSlotIndex === -1 || !player || !player.race) return false;
        const slots = this.getSlots();
        const data = {
            name: player.name,
            timestamp: Date.now(),
            race: player.race,
            baseClass: player.baseClass,
            archetype: player.archetype || 'fighter', 
            level: player.level,
            xp: player.xp,
            stats: { hp: player.hp, mp: player.mp, cp: player.cp },
            position: {
                x: player.group?.position.x || 0,
                y: player.group?.position.y || 0,
                z: player.group?.position.z || 0
            },
            inventory: player.inventory,
            equipment: player.equipment,
            adena: player.adena,
            shotConfig: player.shotConfig,
            skills: player.skills,
            quests: Object.keys(QUESTS).map(key => ({
                id: key,
                started: QUESTS[key].started,
                completed: QUESTS[key].completed,
                currentKills: QUESTS[key].currentKills
            }))
        };
        slots[activeSlotIndex] = data;
        localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
        return true;
    },

    loadCharacter(index) {
        const slots = this.getSlots();
        const data = slots[index];
        if (!data) return false;
        activeSlotIndex = index;
        this.apply(data);
        return true;
    },

    deleteCharacter(index) {
        const slots = this.getSlots();
        if (!slots[index]) return false;
        slots[index] = null;
        localStorage.setItem(SAVE_KEY, JSON.stringify(slots));
        return true;
    },

    apply(data) {
        if (!player || !data) return;
        player.name = data.name || "Unknown Hero";
        player.level = data.level;
        player.xp = data.xp;
        player.race = data.race;
        player.baseClass = data.baseClass;
        player.archetype = data.archetype || 'fighter'; 
        player.inventory = data.inventory || [];
        player.equipment = data.equipment || {};
        player.adena = data.adena || 0;
        player.shotConfig = data.shotConfig || { soulshot: false, spiritshot: false };
        player.skills = data.skills || [];
        if (data.quests) {
            data.quests.forEach(qData => {
                const q = QUESTS[qData.id];
                if (q) {
                    q.started = qData.started;
                    q.completed = qData.completed;
                    q.currentKills = qData.currentKills;
                }
            });
        }
        player.recalculateStats();
        player.hp = Math.min(data.stats.hp, player.maxHp);
        player.mp = Math.min(data.stats.mp, player.maxMp);
        player.cp = Math.min(data.stats.cp, player.maxCp);
        if (player.group && data.position) {
            player.group.position.set(data.position.x, data.position.y, data.position.z);
        }
    }
};