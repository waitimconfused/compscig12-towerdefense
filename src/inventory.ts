import { StaticClass } from "./types.js";

/**
 * The item names of allowed items
 */
export type InventoryItemTag = "coin" | "point" | "jar" | "wood" | "honey" | "lemonade_glass";

/**
 * Keeps track of which items the player has earned
 * 
 * Can give/take items
 * 
 * Included saving/loading functionality (*optional*, see `Inventory.autosave`)
 */
export default class Inventory extends StaticClass {

	public static autosave:boolean = true;

	/**
	 * Raw item data
	 * 
	 * Stored as a map with item-tags as keys, and
	 * their quantity/count as a number
	 */
	public static items = new Map<InventoryItemTag, number>();

	/**
	 * 
	 * @param tag		The string "tag" that represents the item
	 * @param quantity	How many items should be added to the inventory
	 */
	public static give(tag:InventoryItemTag, quantity:number) {

		// Get the number of items that already exist
		let count = this.getCount(tag);

		// Update the items map
		this.items.set(tag, count + quantity);

		// Save the inventory to localStorage
		if (this.autosave) this.save();
	}

	/**
	 * Remove `x` number of items from the inventory, if possible
	 * 
	 * @param tag		The string "tag" that represents the item
	 * 
	 * @param quantity	How many items should be removed
	 * 
	 * @returns			If the item (and count) could be removed.
	 * 					If `true`, the items were revoked.
	 * 					If `false`, no changes were made to the inventory.
	 */
	public static take(tag:InventoryItemTag, quantity:number):boolean {
		
		// Get the number of items that already exist
		let value = this.getCount(tag);

		// If there aren't enough items to take, return failure (`false`)
		if (value < quantity) return false;

		// Update the items map
		this.items.set(tag, value - quantity);

		// Save the inventory to localStorage
		if (this.autosave) this.save();

		// Return a success (`true`)
		return true;
	}

	/**
	 * 
	 * @param tag
	 * @returns
	 */
	public static getCount(tag:InventoryItemTag):number {
		return this.items.get(tag) ?? 0;
	}


	/**
	 * Save the inventory to the `localStorage` API
	 * 
	 * Key format: `Inventory.item.XYZ`
	 */
	public static save() {

		// Get the item entries
		let entries = this.items.entries();

		// Loop through the entries, getting the item-id and count
		for (let [item, count] of entries) {

			// If there aren't any of the item, make sure
			// that it is REMOVED from the localStorage
			if (count == 0) {
				localStorage.removeItem(`Inventory.item.${item}`);
				continue;
			}

			// Set the localStorage key-value pair
			localStorage.setItem(`Inventory.item.${item}`, String(count));

		}

	}

	/**
	 * Load items from the `localStorage` API
	 * 
	 * Key format: `Inventory.item.XYZ`
	 */
	public static load() {

		// Loop through each localStorage key
		for (let i = 0; i < localStorage.length; i ++) {
			
			// Get the current (raw) key from the localStorage
			let key = localStorage.key(i) as string;
			
			// If the key isn't an item, don't even attempt it
			if (key.startsWith("Inventory.item.") == false) continue;

			// Get the item-tag from the key
			let item:InventoryItemTag = key.replace(/^Inventory.item./, "") as InventoryItemTag;
			
			// Get how many of the item there is
			let count:number = Number( localStorage.getItem(key) ?? "0" );

			// If there is 0 of an item, why bother?
			if (count == 0) continue;
			
			// Set the item to the saved count
			this.items.set(item, count);

		}

	}

}