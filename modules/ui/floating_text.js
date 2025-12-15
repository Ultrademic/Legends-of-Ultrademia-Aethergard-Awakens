import { camera } from "../../core/renderer.js";

const activeTexts = [];

export function spawnFloatingText(entity, text, type = 'damage') {
    if (!entity || !entity.position) return;

    const div = document.createElement("div");
    div.className = "floating-text";
    div.textContent = text;
    
    div.style.position = "absolute";
    div.style.fontWeight = "bold";
    div.style.pointerEvents = "none";
    div.style.textShadow = "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 2px black";
    div.style.zIndex = "30";
    div.style.fontFamily = "Verdana, sans-serif";
    div.style.userSelect = "none";
    div.style.whiteSpace = "nowrap";

    switch (type) {
        case 'damage':
            div.style.color = "#ffb74d"; 
            div.style.fontSize = "16px";
            break;
        case 'crit':
            div.style.color = "#ff3333"; 
            div.style.fontSize = "22px";
            div.style.textTransform = "uppercase";
            div.textContent = text + "!";
            break;
        case 'heal':
            div.style.color = "#44ff44"; 
            div.style.fontSize = "16px";
            div.textContent = "+" + text;
            break;
        case 'miss':
            div.style.color = "#88ccff"; 
            div.style.fontSize = "14px";
            div.style.fontStyle = "italic";
            break;
        case 'xp':
            div.style.color = "#00ffff"; 
            div.style.fontSize = "14px";
            div.textContent = text + " XP";
            break;
    }

    document.body.appendChild(div);

    activeTexts.push({
        element: div,
        worldPos: entity.position.clone().add({x: 0, y: 1.8, z: 0}), 
        life: 1.5, 
        maxLife: 1.5,
        velocity: { y: 1.0 + Math.random() * 0.5, x: (Math.random() - 0.5) * 0.5 } 
    });
}

export function updateFloatingText(dt) {
    for (let i = activeTexts.length - 1; i >= 0; i--) {
        const txt = activeTexts[i];
        txt.life -= dt;

        if (txt.life <= 0) {
            if (txt.element.parentNode) txt.element.parentNode.removeChild(txt.element);
            activeTexts.splice(i, 1);
            continue;
        }

        txt.worldPos.y += txt.velocity.y * dt;
        txt.worldPos.x += txt.velocity.x * dt;

        const pos = txt.worldPos.clone();
        pos.project(camera);

        const x = (pos.x + 1) * 0.5 * window.innerWidth;
        const y = (1 - pos.y) * 0.5 * window.innerHeight;

        txt.element.style.left = `${x}px`;
        txt.element.style.top = `${y}px`;
        txt.element.style.opacity = Math.min(1, txt.life * 2).toString(); 
    }
}