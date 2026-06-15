import { StaticClass } from "./types.js";
var eventListeners = [];
export class KeyboardManager extends StaticClass {
    static activeKeys = [];
    static addEventListener(type, key, callback) {
        eventListeners.push({ type, key, callback });
    }
    static isKeyDown(key) {
        for (let i = 0; i < this.activeKeys.length; i++) {
            let currentKey = this.activeKeys[i];
            if (key instanceof RegExp && currentKey.match(key))
                return true;
            if (typeof key == "string" && currentKey == key)
                return true;
        }
        return false;
    }
    static dispatchEvent(type, key, event) {
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
        if (type == "down" && index != -1)
            return;
        switch (type) {
            case "down":
                this.activeKeys.push(key);
                break;
            case "up":
                this.activeKeys.splice(index, 1);
                break;
        }
        for (let i = 0; i < eventListeners.length; i++) {
            let listener = eventListeners[i];
            if (listener.type != type)
                continue;
            if (listener.key instanceof RegExp && !key.match(listener.key))
                continue;
            if (typeof listener.key == "string" && listener.key != key)
                continue;
            listener.callback(event);
        }
    }
}
;
document.addEventListener("keydown", (e) => {
    if (e.repeat)
        return;
    let key = (e.key.length == 1) ? e.key.toLowerCase() : e.key;
    KeyboardManager.dispatchEvent("down", key, e);
});
document.addEventListener("keyup", (e) => {
    if (e.repeat)
        return;
    let key = (e.key.length == 1) ? e.key.toLowerCase() : e.key;
    KeyboardManager.dispatchEvent("up", key, e);
});
//# sourceMappingURL=keyboard.js.map