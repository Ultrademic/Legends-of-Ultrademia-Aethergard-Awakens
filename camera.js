// /core/camera.js
// ULTRADEMIC MMO CAMERA — smooth follow, zoom, right-click rotation

import { player } from "../modules/characters/player.js";
import { camera } from "./renderer.js";

// Camera state
let camYaw = 0;
let camPitch = 0.45;     // default slight downward angle
let targetDistance = 8;  // zoom target
let currentDistance = 8;

let isRotating = false;
let lastX = 0;
let lastY = 0;

// Limits
const MIN_PITCH = 0.1;
const MAX_PITCH = 1.2;

const MIN_ZOOM = 4;
const MAX_ZOOM = 14;

// -----------------------------------------------------
// INPUT: Right-click to rotate
// -----------------------------------------------------
window.addEventListener("mousedown", (e) => {
    if (e.button === 2) {
        isRotating = true;
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

window.addEventListener("mouseup", (e) => {
    if (e.button === 2) isRotating = false;
});

window.addEventListener("mousemove", (e) => {
    if (!isRotating) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    camYaw -= dx * 0.005;
    camPitch -= dy * 0.003;

    camPitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, camPitch));
});

// -----------------------------------------------------
// INPUT: Mouse wheel zoom
// -----------------------------------------------------
window.addEventListener("wheel", (e) => {
    targetDistance += e.deltaY * 0.01;
    targetDistance = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetDistance));
});

// -----------------------------------------------------
// FRAME UPDATE (called by engine.js)
// -----------------------------------------------------
export function updateCamera(dt) {
    if (!player.group) return;

    // Smooth zoom
    currentDistance += (targetDistance - currentDistance) * 6 * dt;

    const px = player.group.position.x;
    const py = player.group.position.y + 1.4;
    const pz = player.group.position.z;

    // Convert spherical to Cartesian
    const offsetX = Math.sin(camYaw) * Math.cos(camPitch) * currentDistance;
    const offsetY = Math.sin(camPitch) * currentDistance;
    const offsetZ = Math.cos(camYaw) * Math.cos(camPitch) * currentDistance;

    // Smooth follow
    camera.position.x += (px + offsetX - camera.position.x) * 10 * dt;
    camera.position.y += (py + offsetY - camera.position.y) * 10 * dt;
    camera.position.z += (pz + offsetZ - camera.position.z) * 10 * dt;

    // Always look at player
    camera.lookAt(px, py, pz);
}
