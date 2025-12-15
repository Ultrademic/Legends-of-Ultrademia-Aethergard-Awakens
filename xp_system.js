// /modules/progression/xp_system.js
// ULTRADEMIC XP SYSTEM — Lineage II progression + final stat recompute

import { player } from "../characters/player.js";
import { computeFinalStats } from "../characters/player_stats.js";

export const XPSystem = {

    // L2-style XP table (smoothed after level 40)
    xpTable: [
        0,      // L1
        200,    // L2
        600,    // L3
        1500,   // L4
        3000,   // L5
        5000,   // L6
        8000,   // L7
        12000,  // L8
        17000,  // L9
        23000,  // L10
        30000,  // L11
        38000,  // L12
        47000,  // L13
        57000,  // L14
        68000,  // L15
        80000,  // L16
        93000,  // L17
        107000, // L18
        122000, // L19
        138000, // L20

        // Post-20 slower climb, but NOT as punishing as L2 Classic
        160000, // L21
        185000, // L22
        210000, // L23
        240000, // L24
        270000, // L25
        300000, // L26
        340000, // L27
        380000, // L28
        420000, // L29
        460000, // L30
        500000, // L31
        550000, // L32
        600000, // L33
        650000, // L34
        700000, // L35
        760000, // L36
        820000, // L37
        880000, // L38
        950000, // L39
        1_020_000, // L40

        // Post-40 smoothed exponential curve
        1_200_000, // 41
        1_400_000, // 42
        1_600_000, // 43
        1_800_000, // 44
        2_100_000, // 45
        2_400_000  // 46
    ],

    addXP(amount) {
        if (!player.xp) player.xp = 0;

        player.xp += amount;
        console.log(`%c[XP] Gained ${amount} XP! (Total: ${player.xp})`, "color:cyan");

        while (this.canLevelUp()) {
            this.levelUp();
        }
    },

    canLevelUp() {
        const nextLevel = player.level + 1;
        if (!this.xpTable[nextLevel]) return false;
        return player.xp >= this.xpTable[nextLevel];
    },

    levelUp() {
        player.level += 1;

        console.log(
            `%c[LEVEL UP] → Level ${player.level}!`,
            "color:gold;font-weight:bold;font-size:18px"
        );

        // Recompute stats for new level (L2-style growth)
        player.final = computeFinalStats(player.race, player.level);

        // Reset HP/MP to new max
        player.maxHp = player.final.maxHp;
        player.maxMp = player.final.maxMp;
        player.hp = player.maxHp;
        player.mp = player.maxMp;

        // Later: add visuals, particles, glow, sound
    }
};
