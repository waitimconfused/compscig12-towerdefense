import Inventory, { InventoryItemTag, } from "../../inventory.js";
import { Entity } from "../entity.js";
import { Toothpick } from "./toothpick.js";

export abstract class Tool extends Entity{
	/**
	 * Create a map of the specific tool requirements for the tool to be created
	 * Map is used because order of tool requirements does not matter
	 */
	public abstract toolRequirements : Map<InventoryItemTag, number>;
	// public abstract toolRequirementsValue : Array<number>;
	
	/**
	 * check if the player can make the tool they clicked
	 * @returns if there aren't enough of the required materials, return false
	 * if there are enough required materials, return true
	 */
	private canMake() : boolean{
		let tools = [ ...this.toolRequirements.keys() ];

		for (let i = 0; i < tools.length; i++) {

			let tool : InventoryItemTag = tools[i] as InventoryItemTag;

			let requiredAmount : number = this.toolRequirements.get(tool) as number;

			let currentAmount = Inventory.getCount(tool);

			if (currentAmount < requiredAmount) {
				return false
			}
			else{
				currentAmount -= requiredAmount;
			}
		}

		return true;
	}
}