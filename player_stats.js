// /modules/characters/player_stats.js
// ULTRADEMIC PLAYER STAT ENGINE — Base → Race → Level → Final (Lineage II inspired)

// ---------------------------------------------------------------------
// BASE STATS (before race/class modifiers)
// These mimic L2 Human Fighter baseline stats
// ---------------------------------------------------------------------
export const BaseStats = {
    STR: 40,
    DEX: 30,
    CON: 43,
    INT: 21,
    WIT: 11,
    MEN: 25
};

// ---------------------------------------------------------------------
// RACE MODIFIERS — Lineage 2 flavored
// Slight variations creating racial identity
// ---------------------------------------------------------------------
export const RaceModifiers = {
    human: {
        STR: +0,
        DEX: +0,
        CON: +0,
        INT: +0,
        WIT: +0,
        MEN: +0
    },
    elf: {
        STR: -2,
        DEX: +2,
        CON: -1,
        INT: +1,
        WIT: +1,
        MEN: 0
    },
    dark_elf: {
        STR: +3,
        DEX: +1,
        CON: -2,
        INT: +0,
        WIT: -1,
        MEN: 0
    }
};

// ---------------------------------------------------------------------
// LEVEL SCALING — L2-like (gentle pre-40, moderate growth)
// ---------------------------------------------------------------------
export function applyLevelScaling(stats, level) {
    const scaled = { ...stats };

    for (let i = 2; i <= level; i++) {
        // Mild fighter-like L2 level growth
        scaled.STR += 1;
        scaled.DEX += 1;
        scaled.CON += 1;

        // Slight mental/stat growth every few levels
        if (i % 3 === 0) scaled.INT += 1;
        if (i % 4 === 0) scaled.WIT += 1;
        if (i % 5 === 0) scaled.MEN += 1;
    }

    return scaled;
}

// ---------------------------------------------------------------------
// DERIVED STATS — Formulas based on L2 private server values
// ---------------------------------------------------------------------
export function computeDerivedStats(stats, level) {
    return {
        // Physical attack (weapon atk added later)
        PATK: Math.floor(stats.STR * 1.6 + level * 2),

        // Physical defense
        PDEF: Math.floor(stats.CON * 1.4 + level * 1.2),

        // Crit rate (L2 uses DEX heavily)
        CRIT: stats.DEX * 0.4,

        // Max HP/MP (fighter baseline approach)
        maxHp: Math.floor(60 + stats.CON * 2.4 + level * 3),
        maxMp: Math.floor(40 + stats.MEN * 2.1 + level * 2),

        // Attack speed (placeholder for future classes)
        attackSpeed: Math.floor(300 + stats.DEX * 2),

        // Cast speed (placeholder)
        castSpeed: Math.floor(250 + stats.WIT * 3)
    };
}

// ---------------------------------------------------------------------
// MAIN STAT PIPELINE
// Called from player.js after spawn & after leveling
// ---------------------------------------------------------------------
export function computeFinalStats(race, level) {
    // Base → Race mods
    const raceMod = RaceModifiers[race] || RaceModifiers.human;

    const base = {
        STR: BaseStats.STR + raceMod.STR,
        DEX: BaseStats.DEX + raceMod.DEX,
        CON: BaseStats.CON + raceMod.CON,
        INT: BaseStats.INT + raceMod.INT,
        WIT: BaseStats.WIT + raceMod.WIT,
        MEN: BaseStats.MEN + raceMod.MEN
    };

    // Level scaling
    const levelScaled = applyLevelScaling(base, level);

    // Derived stats
    const derived = computeDerivedStats(levelScaled, level);

    // Final structure player.js expects
    return {
        ...levelScaled,
        ...derived
    };
}
