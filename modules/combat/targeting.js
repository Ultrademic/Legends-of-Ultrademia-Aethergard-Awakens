// /modules/combat/targeting.js

import * as THREE from "three";
import { scene, camera } from "../../core/renderer.js";
import { player } from "../characters/player.js";
import { CombatCore } from "./combat_core.js";
import { VendorSystem } from "../systems/vendor_system.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// ------------------------------------------------------------------
// VISUAL SELECTION RING
// ------------------------------------------------------------------
let selectionRing = null;

function createSelectionRing() {
    const geometry = new THREE.RingGeometry(0.8, 1.0, 32);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.8,
        depthTest: false, // Always visible on top of ground
        depthWrite: false
    });
    
    selectionRing = new THREE.Mesh(geometry, material);
    selectionRing.rotation.x = -Math.PI / 2; // Flat on ground
    selectionRing.position.y = 0.05;         // Slightly above ground to prevent z-fighting
    selectionRing.visible = false;
    
    // Ensure render order puts it above terrain
    selectionRing.renderOrder = 10;
    
    scene.add(selectionRing);
}

// ------------------------------------------------------------------
// INPUT HANDLING
// ------------------------------------------------------------------
export function initTargeting() {
    // Create the ring immediately
    createSelectionRing();

    window.addEventListener("mousedown", (e) => {
        // Ignore clicks on UI elements
        if (e.target.closest('.pointer-events-auto')) return;
        
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const hit = intersects[0].object;

            // Traverse up to find the logic root (the group holding the mesh)
            let parent = hit;
            while (parent && !parent.isMonster && !parent.isNPC && !parent.isLoreStone) {
                parent = parent.parent;
            }
            if (!parent) return;

            // 1. Vendor Click
            if (parent.isVendor) {
                VendorSystem.openShop(parent);
                player.dispatchMessage('general', `You speak with ${parent.npcName}.`);
                return;
            }

            // 2. Monster Click
            if (parent.isMonster) {
                if (parent.dead) return;
                player.target = parent;
                CombatCore.enterCombat(parent);
                return;
            }

            // 3. NPC Click
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

            // 4. Lore Stone
            if (parent.isLoreStone) {
                const text = `[Lore] ${parent.loreText}`;
                player.dispatchMessage('info', text);
            }
        } else {
            // Clicked on ground/nothing -> Deselect
            // player.target = null;
            // CombatCore.exitCombat();
        }
    });
}

// ------------------------------------------------------------------
// UPDATE LOOP (Called by engine.js)
// ------------------------------------------------------------------
export function updateTargeting(dt) {
    if (!selectionRing) return;

    const target = player.target;

    // Show ring only if we have a live target
    if (target && !target.dead && target.position) {
        selectionRing.visible = true;
        
        // Smooth follow
        selectionRing.position.x = target.position.x;
        selectionRing.position.z = target.position.z;
        
        // Spin effect (L2 style)
        selectionRing.rotation.z -= 2.0 * dt;

        // Pulse opacity
        const pulse = 0.6 + Math.sin(Date.now() * 0.005) * 0.4;
        selectionRing.material.opacity = pulse;

        // Color logic (Hostile = Red, Friendly/NPC = Green/Blue)
        if (target.isMonster) {
            selectionRing.material.color.setHex(0xff0000);
        } else if (target.isNPC) {
            selectionRing.material.color.setHex(0x00ff00);
        }

    } else {
        selectionRing.visible = false;
    }
}