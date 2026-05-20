export type InventoryItemTag = "coin" | "point" | "jar" | "wood" | "honey" | "lemonade_glass";
export type InventoryItemCount = number;

export default class Inventory {

	public static items = new Map<InventoryItemTag, InventoryItemCount>();

	constructor() {
		throw new TypeError("Inventory is not a constructor");
	}

	/**
	 * 
	 * @param tag		The string "tag" that represents the item
	 * @param quantity	How many items should be added to the inventory
	 */
	public static give(tag:InventoryItemTag, quantity:InventoryItemCount) {

		let count = this.getCount(tag);

		this.items.set(tag, count + quantity);

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
	public static take(tag:InventoryItemTag, quantity:InventoryItemCount):boolean {
		let value = this.getCount(tag);

		if (value < quantity) return false;

		this.items.set(tag, value - quantity);
		return true;
	}

	public static getCount(tag:InventoryItemTag):InventoryItemCount {
		return this.items.get(tag) ?? 0;
	}

}