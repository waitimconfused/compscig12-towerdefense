type MouseButtons = "left" | "right" | "wheel" | "back" | "forward" | "eraser";

type MouseButtonObject = { [button in MouseButtons]: boolean };

/**
 * Gets the value of `PointerEvent.buttons`, and returns an object of `Object<string, boolean>`
 * @param {PointerEvent} event 
 * @returns {{left:boolean, right:boolean, wheel:boolean, back:boolean, forward:boolean, eraser:boolean}}
 */
function getMouseButtonsFromEvent(event:PointerEvent):MouseButtonObject {
	let mouseButtonNames:MouseButtons[] = [ "left", "right", "wheel", "back", "forward", "eraser" ];
	let object:MouseButtonObject = {
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

export class MouseManager {

	public static x:number = 0;
	public static y:number = 0;

	public static preventScroll:boolean = false;
	public static preventContextMenu:boolean = false;
	public static preventZoom:boolean = false;

	public static buttons:MouseButtonObject = {
		left: false,
		right: false,
		wheel: false,
		back: false,
		forward: false,
		eraser: false
	};
	
	constructor() {
		throw new TypeError("MouseManager is not a constructor");
	}

}


function update(e:PointerEvent):void {
	MouseManager.x = e.clientX;
	MouseManager.y = e.clientY;

	MouseManager.buttons = getMouseButtonsFromEvent(e);
}

window.addEventListener("pointermove", (e) => {
	update(e);
});
window.addEventListener("pointerdown", (e) => {
	update(e);
});
window.addEventListener("pointerup", (e) => {
	update(e);
});
window.addEventListener("scroll", (e) => {
	if (MouseManager.preventScroll == true) e.preventDefault();
	update(e as PointerEvent);
})
window.addEventListener("contextmenu", (e) => {
	if (MouseManager.preventContextMenu == true) e.preventDefault();
});


function preventZooming(e:WheelEvent|KeyboardEvent) {

	let isTryingToZoom = false;

	if (e instanceof WheelEvent && e.ctrlKey) isTryingToZoom = true;

	
	if (e instanceof KeyboardEvent) {
		if (["+", "="].includes(e.key))	isTryingToZoom = true;
		if (["-", "_"].includes(e.key))	isTryingToZoom = true;
		if (["0"].includes(e.key))		isTryingToZoom = true;
	}

	if (isTryingToZoom && MouseManager.preventScroll) e.preventDefault();
}


document.addEventListener("wheel", preventZooming, {passive:false});
document.addEventListener("keydown", preventZooming);