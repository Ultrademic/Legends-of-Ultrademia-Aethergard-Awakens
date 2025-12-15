import { camera } from "../../core/renderer.js";

export const healthbars = new Map();

export function createHealthbar(entity, maxHp) {
    const wrapper = document.createElement("div");
    wrapper.className = "hpWrapper";
    wrapper.style.position = "absolute";
    wrapper.style.width = "60px";
    wrapper.style.height = "8px";
    wrapper.style.background = "rgba(0,0,0,0.6)";
    wrapper.style.border = "1px solid #000";
    wrapper.style.borderRadius = "4px";
    wrapper.style.pointerEvents = "none";
    wrapper.style.zIndex = "20";

    const bar = document.createElement("div");
    bar.className = "hpInner";
    bar.style.height = "100%";
    bar.style.width = "100%";
    bar.style.background = "#ff4444";
    bar.style.borderRadius = "4px";
    bar.style.transition = "width 0.15s ease-out";

    wrapper.appendChild(bar);
    document.body.appendChild(wrapper);

    healthbars.set(entity, { wrapper, bar, maxHp });
}

export function updateHealthbars() {
    healthbars.forEach((obj, entity) => {
        const { wrapper, bar, maxHp } = obj;
        if (!entity || entity.dead) {
            wrapper.style.display = "none";
            return;
        }
        const pos = entity.position.clone();
        pos.y += 2.2; 
        const projected = pos.project(camera);
        const x = (projected.x + 1) * 0.5 * window.innerWidth;
        const y = (1 - projected.y) * 0.5 * window.innerHeight;
        wrapper.style.left = `${x - wrapper.clientWidth / 2}px`;
        wrapper.style.top  = `${y - wrapper.clientHeight}px`;
        wrapper.style.display = "block";
        const percent = Math.max(0, entity.hp / maxHp);
        bar.style.width = `${percent * 100}%`;
    });
}