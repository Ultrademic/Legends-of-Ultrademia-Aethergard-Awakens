// /modules/combat/targeting.js

import { scene, camera } from "../../core/renderer.js";
import { player } from "../characters/player.js";
import { CombatCore } from "./combat_core.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function initTargeting() {

    window.addEventListener("mousedown", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const hit = intersects[0].object;

            // Find monster group parent if clicking child mesh
            let parent = hit;
            while (parent && !parent.isMonster && !parent.isNPC && !parent.isLoreStone) {
                parent = parent.parent;
            }
            if (!parent) return;

            // Select monster
            if (parent.isMonster) {
                parent.selected = true;
                player.target = parent;
                CombatCore.enterCombat(parent);
            }

            // Lore stone click
            if (parent.isLoreStone) {
                console.log("Lore:", parent.loreText);
            }

            // NPC click
            if (parent.isNPC) {
                console.log("NPC:", parent.npcName);
            }
        }
    });
}
