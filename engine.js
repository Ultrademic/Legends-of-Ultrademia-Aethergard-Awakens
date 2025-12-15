// /core/engine.js
// ULTRADEMIC ENGINE — Clean, Sequenced, Animation-Safe, MMO-Style

import { updateMovement } from "./movement.js";
import { updateCamera } from "./camera.js";
import { renderFrame } from "./renderer.js";

import { updateCombat } from "../modules/combat/damage.js";
import { updateMonsterAI } from "../modules/ai/monster_ai.js";

import { updateNameplates } from "../modules/ui/nameplates.js";
import { updateHealthbars } from "../modules/ui/healthbars.js";

import { CombatCore } from "../modules/combat/combat_core.js";
import { player } from "../modules/characters/player.js";

export const GAME = {
    active: true,
    paused: false,
    lastTime: 0
};

// ========================================================
// START ENGINE LOOP
// ========================================================
export function startEngine() {
    GAME.lastTime = performance.now();
    requestAnimationFrame(loop);
}

// ========================================================
// FRAME LOOP
// ========================================================
function loop(time) {

    if (!GAME.active || GAME.paused) return;

    const dt = Math.min((time - GAME.lastTime) / 1000, 0.033); // clamp to 30 FPS max step
    GAME.lastTime = time;

    // ----------------------------------------------------
    // ORDER MATTERS — DO NOT MOVE THESE
    // ----------------------------------------------------

    // 1️⃣ Movement physics
    updateMovement(dt);

    // 2️⃣ Combat distance checks (reset aggro)
    CombatCore.updateCombatDistance();

    // 3️⃣ Monster AI logic
    updateMonsterAI(dt);

    // 4️⃣ Player combat updates (apply damage, cooldowns)
    updateCombat(dt);

    // 5️⃣ Player animation / mixer
    player.update(dt);

    // 6️⃣ Camera follow
    updateCamera(dt);

    // 7️⃣ UI overlays (2D DOM)
    updateNameplates();
    updateHealthbars();

    // 8️⃣ Render
    renderFrame();

    requestAnimationFrame(loop);
}
