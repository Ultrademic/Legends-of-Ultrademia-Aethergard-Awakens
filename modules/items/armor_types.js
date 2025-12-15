export const ARMOR_TYPES = {
    cloth: {
        tier: "light",
        description: "Simple cloth and linen garments offering minimal protection.",
        bonuses: {
            castSpeed: 0.05,
            manaRegen: 0.03
        }
    },
    leather: {
        tier: "medium",
        description: "Reinforced hide and leather armor offering balanced stats.",
        bonuses: {
            evasion: 0.03,
            attackSpeed: 0.02
        }
    },
    plate: {
        tier: "heavy",
        description: "Metal armor offering maximum physical defense.",
        bonuses: {
            defense: 0.05,
            hpRegen: 0.02
        }
    }
};