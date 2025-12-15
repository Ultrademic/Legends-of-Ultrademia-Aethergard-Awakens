export const MonsterStats = {
    wolf(level = 1) {
        return {
            family: "wolf",
            level,
            maxHp: Math.floor(40 + level * 12),
            pAtk: Math.floor(6 + level * 1.8),
            pDef: Math.floor(8 + level * 1.5),
            attackRange: 1.4,
            attackCooldown: 1.4,
            moveSpeed: 3.4 + (level * 0.02),
            aggressive: false,
            aggroRange: 6 + (level * 0.2),
            leashRange: 15 + (level * 0.1),
            xp: 15 + level * 6,
            adena: { min: 5 + level * 1, max: 12 + level * 2 },
            drops: [
                { name: "Wolf Claw", chance: 0.40, count: 1, price: 4, description: "Sharp claw used for crafting or selling." },
                { name: "Wolf Fang", chance: 0.20, count: 1, price: 8, description: "A pristine fang, valuable to merchants." }
            ]
        };
    },
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
                { name: "Wolf Pelt", chance: 0.35, count: 1, price: 15, description: "Fine fur used for leather armor." },
                { name: "Sharp Fang", chance: 0.15, count: 1, price: 12, description: "Razor sharp fang." }
            ]
        };
    },
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
                { name: "Spirit Fragment", chance: 0.25, count: 1, price: 20, description: "A glowing shard of ectoplasm." },
                { name: "Ancient Dust", chance: 0.20, count: 1, price: 10, description: "Dust from a forgotten age." }
            ]
        };
    }
};