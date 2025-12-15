// /modules/combat/combat_core.js
// ULTRADEMIC COMBAT CORE — manages combat flags, target states, and leashing

import { player } from "../characters/player.js";

export const CombatCore = {

    /**
     * Called when the player clicks or aggroes a monster
     */
    enterCombat(target) {
        if (!target || target.dead) return;

        player.inCombat = true;
        player.target = target;

        console.log(
            `%c[Combat] Engaged → ${target.name} (Lv.${target.level})`,
            "color:orange;font-weight:bold"
        );
    },

    /**
     * Called when:
     * - the monster dies
     * - the player runs too far
     * - the AI leash triggers
     */
    exitCombat() {
        if (!player.inCombat) return;

        console.log("%c[Combat] Disengaged", "color:gray");

        player.inCombat = false;
        player.target = null;
    },

    /**
     * Called every frame by engine.js
     * Ensures player and monster remain connected
     */
    updateCombatDistance() {
        if (!player.inCombat || !player.target) return;

        const mob = player.target;
        if (!mob || mob.dead) {
            this.exitCombat();
            return;
        }

        const dx = player.group.position.x - mob.position.x;
        const dz = player.group.position.z - mob.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // L2-style combat break distance
        if (dist > 12) {
            console.log(
                "%c[Combat] Target too far — combat broken",
                "color:gray;font-style:italic"
            );
            this.exitCombat();
        }
    }
};
