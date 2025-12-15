// /modules/ai/monster_stats.js
// ULTRADEMIC MONSTER STAT ENGINE — clean, scalable L2-style formulas

export const MonsterStats = {

    // ------------------------------------------------------------
    // WOLF FAMILY (normal wolves)
    // ------------------------------------------------------------
    wolf(level = 1) {
        return {
            family: "wolf",
            level,

            // Core stats — Lineage 2 inspired scaling
            maxHp: Math.floor(40 + level * 12),
            pAtk: Math.floor(6 + level * 1.8),
            pDef: Math.floor(8 + level * 1.5),

            // Combat
            attackRange: 1.4,
            attackCooldown: 1.4,
            moveSpeed: 3.4 + (level * 0.02),

            // Behavior
            aggressive: false,
            aggroRange: 6 + (level * 0.2),
            leashRange: 15 + (level * 0.1),

            // Rewards
            xp: 15 + level * 6,
            adena: { min: 5 + level * 1, max: 12 + level * 2 },

            drops: [
                { name: "Wolf Claw", chance: 0.20, count: 1 },
                { name: "Wolf Fang", chance: 0.10, count: 1 }
            ]
        };
    },


    // ------------------------------------------------------------
    // ELITE WOLF (blue/red/black wolves)
    // ------------------------------------------------------------
    wolf_elite(level = 5) {
        return {
            family: "wolf_elite",
            level,

            maxHp: Math.floor(70 + level * 18),
            pAtk: Math.floor(12 + level * 2.6),
            pDef: Math.floor(12 + level * 2.2),

            attackRange: 1.6,
            attackCooldown: 1.2,
            moveSpeed: 3.8 + (level * 0.03),

            aggressive: true,
            aggroRange: 10,
            leashRange: 18,

            xp: 30 + level * 10,
            adena: { min: 20 + level * 2, max: 40 + level * 3 },

            drops: [
                { name: "Wolf Pelt", chance: 0.25, count: 1 },
                { name: "Sharp Fang", chance: 0.12, count: 1 }
            ]
        };
    },


    // ------------------------------------------------------------
    // RUINS GHOST (future zone example)
    // ------------------------------------------------------------
    ghost(level = 8) {
        return {
            family: "ghost",
            level,

            maxHp: Math.floor(50 + level * 10),
            pAtk: Math.floor(10 + level * 2.0),
            pDef: Math.floor(5 + level * 1.0),

            attackRange: 1.8,
            attackCooldown: 1.1,
            moveSpeed: 4.2,

            aggressive: true,
            aggroRange: 12,
            leashRange: 20,

            xp: 40 + level * 10,
            adena: { min: 10, max: 30 },

            drops: [
                { name: "Spirit Fragment", chance: 0.15, count: 1 },
                { name: "Ancient Dust", chance: 0.10, count: 1 }
            ]
        };
    }
};
