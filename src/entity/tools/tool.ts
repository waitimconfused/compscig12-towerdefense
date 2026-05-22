import { InventoryItemTag, } from "../../inventory.js";
import { Entity } from "../entity.js";

export abstract class Tool extends Entity{
	/**
	 * Create a map of the specific tool requirements for the tool to be created
	 * Map is used because order of tool requirements does not matter
	 */
	toolRequirements : Map<InventoryItemTag,number>;

	/**
	 * Check to see if the player can create the tool
	 * Look at the tool's unique material requirements and see if they have enough
	 * @param requirements the unique materials specifically neededto create the tool
	 * Return a boolean - whether it's true the player can create it or not
	 */
	public abstract canCreateTool(requirements : Array<InventoryItemTag>) : boolean;
	



	



	

}