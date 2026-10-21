import { StaticClass } from "./types.js";
export default class Inventory extends StaticClass {
    static autosave = true;
    static items = new Map();
    static give(tag, quantity) {
        let count = this.getCount(tag);
        this.items.set(tag, count + quantity);
        if (this.autosave)
            this.save();
    }
    static take(tag, quantity) {
        let value = this.getCount(tag);
        if (value < quantity)
            return false;
        this.items.set(tag, value - quantity);
        if (this.autosave)
            this.save();
        return true;
    }
    static getCount(tag) {
        return this.items.get(tag) ?? 0;
    }
    static save() {
        let entries = this.items.entries();
        for (let [item, count] of entries) {
            if (count == 0) {
                localStorage.removeItem(`Inventory.item.${item}`);
                continue;
            }
            localStorage.setItem(`Inventory.item.${item}`, String(count));
        }
    }
    static load() {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith("Inventory.item.") == false)
                continue;
            let item = key.replace(/^Inventory.item./, "");
            let count = Number(localStorage.getItem(key) ?? "0");
            if (count == 0)
                continue;
            this.items.set(item, count);
        }
    }
}
//# sourceMappingURL=inventory.js.map