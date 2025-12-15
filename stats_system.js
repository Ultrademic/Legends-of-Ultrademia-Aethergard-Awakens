// /modules/progression/stats_system.js
// ULTRADEMIC RPG STAT ENGINE — COMPLETE SECONDARY STAT SYSTEM

import { player } from "../characters/player.js";

export const StatsSystem = {

    // --------------------------------------------------------
    // BASE RACIAL STATS (balanced but unique)
    // --------------------------------------------------------
    races: {
        human: {
            STR: 12,
            DEX: 11,
            CON: 12,
            INT: 11,
            MEN: 11,
            WIT: 11
        },
        elf: {
            STR: 10,
            DEX: 14,
            CON: 10,
            INT: 12,
            MEN: 12,
            WIT: 11
        },
        dark_elf: {
            STR: 14,
            DEX: 12,
            CON: 10,
            INT: 13,
            MEN: 10,
            WIT: 10
        }
    },

    // --------------------------------------------------------
    // Initialize stats for a new character
    // --------------------------------------------------------
    initStats(race) {
        const base = this.races[race] || this.races.human;

        player.stats = structuredClone(base);
        player.level = 1;
        player.xp = 0;

        this.recalculateDerived();
    },

    // --------------------------------------------------------
    // Every level-up applies race-based scaling
    // --------------------------------------------------------
    applyLevelGrowth() {
        const r = player.race;

        switch (r) {
            case "human":
                player.stats.STR += 1;
                player.stats.DEX += 1;
                player.stats.CON += 1;
                break;

            case "elf":
                player.stats.DEX += 2;
                player.stats.INT += 1;
                break;

            case "dark_elf":
                player.stats.STR += 2;
                player.stats.DEX += 1;
                break;
        }

        this.recalculateDerived();
    },

    // --------------------------------------------------------
    // DERIVED STAT FORMULAS
    // --------------------------------------------------------
    recalculateDerived() {
        const s = player.stats;

        // PHYSICAL
        player.pAtk = Math.floor(s.STR * 2.2 + s.DEX * 0.3);
        player.pDef = Math.floor(s.CON * 1.7 + s.DEX * 0.2);

        // MAGIC
        player.mAtk = Math.floor(s.INT * 2.3 + s.WIT * 0.3);
        player.mDef = Math.floor(s.MEN * 2.1 + s.WIT * 0.2);

        // Accuracy / Evasion
        player.accuracy = Math.floor(10 + s.DEX * 0.8);
        player.evasion  = Math.floor(8 + s.DEX * 0.6);

        // Crit Rate (%)
        player.critRate = Math.min(50, Math.floor(4 + s.DEX * 0.3));

        // Attack Speed
        player.atkSpeed = Math.floor(300 + s.DEX * 3);

        // Cast Speed
        player.castSpeed = Math.floor(300 + s.WIT * 3);

        // HP / MP
        player.maxHp = Math.floor(100 + (s.CON * 5));
        player.maxMp = Math.floor(60 + (s.MEN * 4));

        if (player.hp === undefined) player.hp = player.maxHp;
        if (player.mp === undefined) player.mp = player.maxMp;

        // Regen (per second)
        player.hpRegen = Math.max(1, Math.floor(s.CON * 0.4));
        player.mpRegen = Math.max(1, Math.floor(s.MEN * 0.3));
    }
};
