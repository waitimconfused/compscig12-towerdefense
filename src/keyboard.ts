/**
 *! Keyboard Manager
 * Detecting keyboard inputs
 */

type KeyboardListenerType = "up" | "down";
type KeyboardListenerCallback = (event: KeyboardEvent) => void;
type KeyboardListener = {
	type: KeyboardListenerType,
	key: string | RegExp,

	callback: KeyboardListenerCallback
};

// Array to store a list of what keyboard buttons are being pressed
var keyList: string[] = [];

// Array to store a list of event listeners (see `KeyboardListener`)
var eventListeners: KeyboardListener[] = [];

const keyboard = {

	/**
	 * 
	 * @param type		Specifies what kind of action the key is doing (down, up)
	 * 
	 * @param key		What key is being pressed (or RegExp for matching
	 * 					any, or a list, or something emse)
	 * 
	 * @param callback	Function to call when the requested keyboard event occurs 
	 */
	addEventListener(type: KeyboardListenerType, key: string | RegExp, callback: KeyboardListenerCallback) {

		eventListeners.push({ type, key, callback });

	},

	isKeyDown(key: string | RegExp) {

		for (let i = 0; i < keyList.length; i++) {

			let currentKey:string = keyList[i] as string;

			if (key instanceof RegExp && currentKey.match(key)) return true;
			if (typeof key == "string" && currentKey == key) return true;

		}

		return false;

	},


	dispatchEvent(type: KeyboardListenerType, key: string, event: KeyboardEvent) {

		let index = keyList.indexOf(key);

		if (type == "down") {
			if (index == -1) keyList.push(key);

		} else if (type == "up") {
			keyList.splice(index, 1);
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

	keyboard.dispatchEvent("down", key, e);

});

document.addEventListener("keyup", (e) => {
	if (e.repeat) return;

	let key = (e.key.length == 1) ? e.key.toLowerCase() : e.key;

	keyboard.dispatchEvent("up", key, e);

});










keyboard.addEventListener("down", /w|a|s|d/, (e) => {
	console.log(e.key);
});

keyboard.isKeyDown("ArrowLeft")