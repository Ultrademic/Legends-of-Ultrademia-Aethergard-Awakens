import * as THREE from "three";
import { scene, camera } from "../../core/renderer.js";
import { player } from "../characters/player.js";
import { CombatCore } from "./combat_core.js";
import { VendorSystem } from "../systems/vendor_system.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initTargeting() {
    window.addEventListener("mousedown", (e) => {
        if (e.target.closest('.pointer-events-auto')) return;
        
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            let parent = hit;
            while (parent && !parent.isMonster && !parent.isNPC && !parent.isLoreStone) {
                parent = parent.parent;
            }
            if (!parent) return;

            if (parent.isVendor) {
                VendorSystem.openShop(parent);
                player.dispatchMessage('general', `You speak with ${parent.npcName}.`);
                return;
            }

            if (parent.isMonster) {
                if (parent.dead) return;
                player.target = parent;
                CombatCore.enterCombat(parent);
                return;
            }

            if (parent.isNPC) {
                if (parent.questGiver && parent.questId) {
                     window.dispatchEvent(new CustomEvent('UI_OPEN_QUEST', { 
                        detail: { 
                            npcName: parent.npcName,
                            questId: parent.questId 
                        } 
                     }));
                } else {
                     const text = `${parent.npcName} waves at you.`;
                     player.dispatchMessage('general', text);
                }
                return;
            }

            if (parent.isLoreStone) {
                const text = `[Lore] ${parent.loreText}`;
                player.dispatchMessage('info', text);
            }
        }
    });
}