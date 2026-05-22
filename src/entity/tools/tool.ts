import { InventoryItemTag, } from "../../inventory.js";
import { Entity } from "../entity.js";

export abstract class Tool extends Entity{
	/**
	 * create a map of the specific tool requirements for the tool to be created
	 * map is used because order of tool requirements does not matter
	 */
	toolRequirements : Map<InventoryItemTag,number>;

	/**
	 * check to see if the player can create the tool
	 * look at the tool's unique material requirements and see if they have enough
	 * @param requirements the unique materials specifically neededto create the tool
	 */
	public abstract canCreateTool(requirements : Array<InventoryItemTag>) : boolean;
	

	



	

}