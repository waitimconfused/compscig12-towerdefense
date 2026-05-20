/**
 *! Keyboard Manager
 * Detecting keyboard inputs
 */

import { StaticClass } from "./types.js";

type KeyboardListenerType = "up" | "down";
type KeyboardListenerCallback = (event: KeyboardEvent) => void;
type KeyboardListener = {
	type: KeyboardListenerType,
	key: string | RegExp,

	callback: KeyboardListenerCallback
};

// Array to store a list of event listeners (see `KeyboardListener`)
var eventListeners: KeyboardListener[] = [];

export class KeyboardManager extends StaticClass {

	/**
	 * Array to store a list of what keyboard buttons are being pressed
	 */
	private static activeKeys: string[] = [];

	/**
	 * 
	 * @param type		Specifies what kind of action the key is doing (down, up)
	 * 
	 * @param key		What key is being pressed (or RegExp for matching
	 * 					any, or a list, or something else)
	 * 
	 * @param callback	Function to call when the requested keyboard event occurs 
	 */
	public static addEventListener(type: KeyboardListenerType, key: string | RegExp, callback: KeyboardListenerCallback) {

		eventListeners.push({ type, key, callback });

	}

	public static isKeyDown(key: string | RegExp) {

		for (let i = 0; i < this.activeKeys.length; i++) {

			let currentKey:string = this.activeKeys[i] as string;

			if (key instanceof RegExp && currentKey.match(key)) return true;
			if (typeof key == "string" && currentKey == key) return true;

		}

		return false;
	}

	public static dispatchEvent(type: KeyboardListenerType, key: string, event: KeyboardEvent) {

		if (typeof key == "string") {
			switch (key) {
				case " ":
						key = "Space";
					break;
			
				default:
					break;
			}
		}
		let index = this.activeKeys.indexOf(key);

		if (type == "down" && index != -1) return;


		switch (type) {
			case "down":
				this.activeKeys.push(key);
				break;

			case "up":
				this.activeKeys.splice(index, 1);
				break;
		}

		for (let i = 0; i < eventListeners.length; i++) {

			let listener: KeyboardListener = eventListeners[i] as KeyboardListener;

			if (listener.type != type) continue;

			if (listener.key instanceof RegExp && !key.match(listener.key)) continue;
			if (typeof listener.key == "string" && listener.key != key) continue;

			listener.callback(event);

		}

	}
};

document.addEventListener("keydown", (e) => {
	if (e.repeat) return;

	let key = (e.key.length == 1) ? e.key.toLowerCase() : e.key;

	KeyboardManager.dispatchEvent("down", key, e);

});

document.addEventListener("keyup", (e) => {
	if (e.repeat) return;

	let key = (e.key.length == 1) ? e.key.toLowerCase() : e.key;

	KeyboardManager.dispatchEvent("up", key, e);

});
