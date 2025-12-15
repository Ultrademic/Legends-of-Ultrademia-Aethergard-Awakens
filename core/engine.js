import { updateMovement } from "./movement.js";
import { updateCamera } from "./camera.js";
import { renderFrame } from "./renderer.js";

import { updateCombat } from "../modules/combat/damage.js";
import { updateMonsterAI } from "../modules/ai/monster_ai.js";
import { updateEffects } from "../modules/combat/projectiles.js";

import { updateNameplates } from "../modules/ui/nameplates.js";
import { updateHealthbars } from "../modules/ui/healthbars.js";
import { updateFloatingText } from "../modules/ui/floating_text.js";

import { CombatCore } from "../modules/combat/combat_core.js";
import { player } from "../modules/characters/player.js";

export const GAME = {
    active: true,
    paused: false,
    lastTime: 0
};

export function startEngine() {
    GAME.lastTime = performance.now();
    requestAnimationFrame(loop);
}

function loop(time) {

    if (!GAME.active || GAME.paused) return;

    const dt = Math.min((time - GAME.lastTime) / 1000, 0.033); 
    GAME.lastTime = time;

    updateMovement(dt);
    CombatCore.updateCombatDistance();
    updateMonsterAI(dt);
    updateCombat(dt);
    player.update(dt);
    updateCamera(dt);
    updateEffects(dt);
    updateNameplates();
    updateHealthbars();
    updateFloatingText(dt);
    renderFrame();

    requestAnimationFrame(loop);
}