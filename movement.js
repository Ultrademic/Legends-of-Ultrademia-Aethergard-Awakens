// /core/movement.js
// ULTRADEMIC THIRD-PERSON MOVEMENT — WASD + camera-relative

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js";
import { camera } from "./renderer.js";
import { player } from "../modules/characters/player.js";

// Current input state
const move = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

const SPEED = 8;  // can scale later with gear / buffs

// ─────────────────────────────────────────────
// KEYBOARD INPUT
// ─────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
    switch (e.code) {
        case "KeyW": move.forward = true; break;
        case "KeyS": move.backward = true; break;
        case "KeyA": move.left = true; break;
        case "KeyD": move.right = true; break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.code) {
        case "KeyW": move.forward = false; break;
        case "KeyS": move.backward = false; break;
        case "KeyA": move.left = false; break;
        case "KeyD": move.right = false; break;
    }
});

// ─────────────────────────────────────────────
// CALLED EVERY FRAME BY engine.js
// ─────────────────────────────────────────────
export function updateMovement(dt) {
    if (!player.group) return;

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    // camera direction (ignore Y to keep it grounded)
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Build movement vector
    if (move.forward)  direction.add(forward);
    if (move.backward) direction.sub(forward);
    if (move.left)     direction.sub(right);
    if (move.right)    direction.add(right);

    // Apply movement
    if (direction.lengthSq() > 0) {
        direction.normalize().multiplyScalar(SPEED * dt);

        player.group.position.add(direction);
        player.isMoving = true;
    } else {
        player.isMoving = false;
    }
}
