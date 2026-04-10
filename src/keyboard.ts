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

var keyList: string[] = [];
var eventListeners: KeyboardListener[] = [];

export const keyboard = {

	addEventListener(type: KeyboardListenerType, key: string | RegExp, callback: KeyboardListenerCallback) {

		eventListeners.push({ type, key, callback });

	},

	isKeyDown(key: string) {

		for (let i = 0; i < keyList.length; i++) {

			if (keyList[i] == key) return true;

		}

		return false;

	},


	dispatchEvent(type: KeyboardListenerType, key: string, event: KeyboardEvent) {

		for (let i = 0; i < eventListeners.length; i++) {

			let listener: KeyboardListener = eventListeners[i] as KeyboardListener;

			if (listener.type != type) continue;

			if (listener.key instanceof RegExp && !key.match(listener.key)) continue;
			if (typeof listener.key == "string" && listener.key != key) continue;

			listener.callback(event);

		}

	}
};
