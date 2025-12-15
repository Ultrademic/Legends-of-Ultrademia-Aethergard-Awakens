export const INPUT = {
    keys: {},
    mouse: { x: 0, y: 0, dx: 0, dy: 0, down: false },
    wheelDelta: 0
};

export function initInput() {

    // Keyboard
    window.addEventListener("keydown", e => INPUT.keys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", e => INPUT.keys[e.key.toLowerCase()] = false);

    // Mouse movement
    window.addEventListener("mousemove", e => {
        INPUT.mouse.dx = e.movementX;
        INPUT.mouse.dy = e.movementY;
        INPUT.mouse.x = e.clientX;
        INPUT.mouse.y = e.clientY;
    });

    window.addEventListener("mousedown", () => INPUT.mouse.down = true);
    window.addEventListener("mouseup", () => INPUT.mouse.down = false);

    // Scroll wheel (zoom)
    window.addEventListener("wheel", e => {
        INPUT.wheelDelta = e.deltaY;
    });
}
