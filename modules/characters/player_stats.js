const STAT_TABLE = {
    human: {
        fighter: { STR: 40, DEX: 30, CON: 43, INT: 21, WIT: 11, MEN: 25 },
        mystic:  { STR: 22, DEX: 21, CON: 27, INT: 41, WIT: 20, MEN: 39 }
    },
    elf: {
        fighter: { STR: 36, DEX: 35, CON: 36, INT: 23, WIT: 14, MEN: 26 },
        mystic:  { STR: 21, DEX: 24, CON: 25, INT: 37, WIT: 23, MEN: 40 }
    },
    dark_elf: {
        fighter: { STR: 41, DEX: 34, CON: 32, INT: 25, WIT: 12, MEN: 26 },
        mystic:  { STR: 23, DEX: 23, CON: 24, INT: 44, WIT: 19, MEN: 37 }
    }
};

const DEFAULT_STATS = { STR: 40, DEX: 30, CON: 43, INT: 21, WIT: 11, MEN: 25 };

export function applyLevelScaling(stats, level) {
    const scaled = { ...stats };
    for (let i = 2; i <= level; i++) {
        scaled.STR += 1;
        scaled.DEX += 1;
        scaled.CON += 1;
        if (i % 3 === 0) scaled.INT += 1;
        if (i % 4 === 0) scaled.WIT += 1;
        if (i % 5 === 0) scaled.MEN += 1;
    }
    return scaled;
}

export function computeDerivedStats(stats, level) {
    return {
        PATK: Math.floor(stats.STR * 1.6 + level * 2),
        PDEF: Math.floor(stats.CON * 1.4 + level * 1.2),
        MATK: Math.floor((Math.pow(stats.INT, 1.5) * 2) + (level * 2)),
        MDEF: Math.floor(stats.MEN * 1.2 + level),
        CRIT: stats.DEX * 0.4,
        maxHp: Math.floor(60 + stats.CON * 2.4 + level * 3),
        maxMp: Math.floor(40 + stats.MEN * 2.4 + level * 2),
        maxCp: Math.floor(40 + stats.CON * 1.0 + level * 2),
        hpRegen: Math.max(1, Math.floor(2 + (stats.CON * 0.1) + (level * 0.1))),
        mpRegen: Math.max(1, Math.floor(2 + (stats.MEN * 0.2) + (level * 0.1))), 
        cpRegen: Math.max(2, Math.floor(4 + (stats.CON * 0.15) + (level * 0.15))),
        attackSpeed: Math.floor(300 + stats.DEX * 2),
        castSpeed: Math.floor(250 + stats.WIT * 3)
    };
}

export function computeFinalStats(race, level, bonuses = {}, archetype = 'fighter') {
    const raceData = STAT_TABLE[race] || STAT_TABLE.human;
    const baseTemplate = raceData[archetype] || raceData.fighter || DEFAULT_STATS;
    const currentStats = { ...baseTemplate };
    const leveledStats = applyLevelScaling(currentStats, level);
    ["STR", "DEX", "CON", "INT", "WIT", "MEN"].forEach(stat => {
        if (bonuses[stat]) leveledStats[stat] += bonuses[stat];
    });
    const derived = computeDerivedStats(leveledStats, level);
    ["PATK", "PDEF", "MATK", "MDEF", "maxHp", "maxMp", "maxCp"].forEach(stat => {
        if (bonuses[stat]) derived[stat] = (derived[stat] || 0) + bonuses[stat];
    });
    return { ...leveledStats, ...derived };
}