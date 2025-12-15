import { player } from "../characters/player.js";
import { scene } from "../../core/renderer.js";
import { CombatCore } from "./combat_core.js";

let initialized = false;

export function initSkillInput() {
    if (initialized) return;
    initialized = true;

    window.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        const key = e.key;
        if (key >= '1' && key <= '8') {
            const index = parseInt(key) - 1;
            player.triggerSkill(index);
        }
        if (key === "Tab") {
            e.preventDefault(); 
            cycleTarget();
        }
        if (key === "Escape") {
            if (player.target) {
                CombatCore.exitCombat();
                player.target = null;
            }
        }
    });
    
    window.addEventListener("UI_TRIGGER_SKILL", (e) => {
        if (e.detail && typeof e.detail.index === 'number') {
            player.triggerSkill(e.detail.index);
        }
    });

    window.addEventListener("UI_TOGGLE_SHOT", (e) => {
        if (e.detail && e.detail.type) {
            player.toggleAutoShot(e.detail.type);
        }
    });

    window.addEventListener("UI_USE_POTION", () => {
        player.usePotion();
    });
}

function cycleTarget() {
    const candidates = [];
    scene.traverse((obj) => {
        if (obj.isMonster && !obj.dead) {
            candidates.push(obj);
        }
    });
    if (candidates.length === 0) return;
    const pPos = player.group.position;
    candidates.sort((a, b) => {
        const distA = a.position.distanceToSquared(pPos);
        const distB = b.position.distanceToSquared(pPos);
        return distA - distB;
    });
    if (!player.target) {
        selectTarget(candidates[0]);
        return;
    }
    const currentIndex = candidates.indexOf(player.target);
    if (currentIndex === -1) {
        selectTarget(candidates[0]);
    } else {
        const nextIndex = (currentIndex + 1) % candidates.length;
        selectTarget(candidates[nextIndex]);
    }
}

function selectTarget(mob) {
    if (mob === player.target) return;
    player.target = mob;
    CombatCore.enterCombat(mob);
}