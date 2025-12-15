export const DEFAULT_STATS = {
    human: {
        STR: 14,
        DEX: 12,
        CON: 14,
        INT: 12,
        WIT: 11,
        MEN: 12
    },
    elf: {
        STR: 11,
        DEX: 16,
        CON: 12,
        INT: 14,
        WIT: 14,
        MEN: 12
    },
    dark_elf: {
        STR: 16,
        DEX: 14,
        CON: 12,
        INT: 12,
        WIT: 11,
        MEN: 10
    }
};

export function generateBaseStats(race = "human") {
    const template = DEFAULT_STATS[race] || DEFAULT_STATS.human;
    return {
        STR: template.STR,
        DEX: template.DEX,
        CON: template.CON,
        INT: template.INT,
        WIT: template.WIT,
        MEN: template.MEN
    };
}

export function computeFinalStats(player) {
    const base = player.baseStats;
    const level = player.level;
    const levelBonus = {
        STR: Math.floor(level * 0.5),
        DEX: Math.floor(level * 0.5),
        CON: Math.floor(level * 0.5),
        INT: Math.floor(level * 0.4),
        WIT: Math.floor(level * 0.4),
        MEN: Math.floor(level * 0.4)
    };
    const eq = player.equipment || {};
    const eqBonus = {
        STR: eq.STR || 0,
        DEX: eq.DEX || 0,
        CON: eq.CON || 0,
        INT: eq.INT || 0,
        WIT: eq.WIT || 0,
        MEN: eq.MEN || 0
    };
    return {
        STR: base.STR + levelBonus.STR + eqBonus.STR,
        DEX: base.DEX + levelBonus.DEX + eqBonus.DEX,
        CON: base.CON + levelBonus.CON + eqBonus.CON,
        INT: base.INT + levelBonus.INT + eqBonus.INT,
        WIT: base.WIT + levelBonus.WIT + eqBonus.WIT,
        MEN: base.MEN + levelBonus.MEN + eqBonus.MEN
    };
}