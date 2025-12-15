import { camera } from "../../core/renderer.js";

export const nameplates = new Map();

export function createNameplate(entity, label, level = 1) {
    const div = document.createElement("div");
    div.className = "nameplate";
    div.style.position = "absolute";
    div.style.color = "#ffffff";
    div.style.fontSize = "14px";
    div.style.fontFamily = "Verdana";
    div.style.textShadow = "0px 0px 4px #000, 0px 0px 8px #000";
    div.style.pointerEvents = "none";
    div.style.whiteSpace = "nowrap";
    div.style.zIndex = "20";

    const playerLevel = 1; 
    if (level >= playerLevel + 3) div.style.color = "#ff4444";
    else if (level <= playerLevel - 3) div.style.color = "#44ff44";

    div.innerHTML = label;
    document.body.appendChild(div);
    nameplates.set(entity, div);
}

export function updateNameplates() {
    nameplates.forEach((div, entity) => {
        if (!entity || entity.dead) {
            div.style.display = "none";
            return;
        }
        const pos = entity.position.clone();
        pos.y += 1.8; 
        const projected = pos.project(camera);
        const x = (projected.x + 1) * 0.5 * window.innerWidth;
        const y = (1 - projected.y) * 0.5 * window.innerHeight;
        div.style.left = `${x - div.clientWidth / 2}px`;
        div.style.top  = `${y - div.clientHeight}px`;
        div.style.display = "block";
    });
}