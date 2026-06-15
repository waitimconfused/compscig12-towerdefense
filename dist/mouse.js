import { StaticClass } from "./types.js";
function getMouseButtonsFromEvent(event) {
    let mouseButtonNames = ["left", "right", "wheel", "back", "forward", "eraser"];
    let object = {
        left: false,
        right: false,
        wheel: false,
        back: false,
        forward: false,
        eraser: false
    };
    for (const buttonName of mouseButtonNames) {
        let isPressed = Boolean(event.buttons & (1 << mouseButtonNames.indexOf(buttonName)));
        object[buttonName] = isPressed;
    }
    return object;
}
export class MouseManager extends StaticClass {
    static x = 0;
    static y = 0;
    static preventScroll = false;
    static preventContextMenu = false;
    static preventZoom = false;
    static buttons = {
        left: false,
        right: false,
        wheel: false,
        back: false,
        forward: false,
        eraser: false
    };
}
function update(e, updateButtons = true) {
    MouseManager.x = e.clientX;
    MouseManager.y = e.clientY;
    if (updateButtons)
        MouseManager.buttons = getMouseButtonsFromEvent(e);
}
window.addEventListener("pointermove", (e) => {
    update(e, false);
});
window.addEventListener("pointerdown", (e) => {
    update(e);
});
window.addEventListener("pointerup", (e) => {
    update(e);
});
window.addEventListener("scroll", (e) => {
    if (MouseManager.preventScroll == true)
        e.preventDefault();
    update(e, false);
});
window.addEventListener("contextmenu", (e) => {
    if (MouseManager.preventContextMenu == true)
        e.preventDefault();
});
function preventZooming(e) {
    let isTryingToZoom = false;
    if (e instanceof WheelEvent && e.ctrlKey)
        isTryingToZoom = true;
    if (e instanceof KeyboardEvent) {
        if (["+", "="].includes(e.key))
            isTryingToZoom = true;
        if (["-", "_"].includes(e.key))
            isTryingToZoom = true;
        if (["0"].includes(e.key))
            isTryingToZoom = true;
    }
    if (isTryingToZoom && MouseManager.preventZoom)
        e.preventDefault();
}
document.addEventListener("wheel", preventZooming, { passive: false });
document.addEventListener("keydown", preventZooming);
//# sourceMappingURL=mouse.js.map