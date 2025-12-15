import { player } from "../characters/player.js";
import { computeFinalStats } from "../characters/player_stats.js";

export const XPSystem = {
    xpTable: [
        0, 200, 600, 1500, 3000, 5000, 8000, 12000, 17000, 23000, 30000,
        38000, 47000, 57000, 68000, 80000, 93000, 107000, 122000, 138000,
        160000, 185000, 210000, 240000, 270000, 300000, 340000, 380000,
        420000, 460000, 500000, 550000, 600000, 650000, 700000, 760000,
        820000, 880000, 950000, 1_020_000, 1_200_000, 1_400_000, 1_600_000,
        1_800_000, 2_100_000, 2_400_000
    ],

    addXP(amount) {
        if (!player.xp) player.xp = 0;
        player.xp += amount;
        player.dispatchMessage('experience', `You have earned ${amount} Experience.`);
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
        player.dispatchMessage('level_up', `LEVEL UP! You are now level ${player.level}!`);
        player.final = computeFinalStats(player.race, player.level);
        player.maxHp = player.final.maxHp;
        player.maxMp = player.final.maxMp;
        player.hp = player.maxHp;
        player.mp = player.maxMp;
    }
};