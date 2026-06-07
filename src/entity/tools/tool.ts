import Inventory, { InventoryItemTag, } from "../../inventory.js";
import { Entity } from "../entity.js";

export abstract class Tool extends Entity{
	public abstract readonly TOOL_NAME : string;
	/**
	 * Create a map of the specific tool requirements for the tool to be created
	 * Map is used because order of tool requirements does not matter
	 */
	public abstract toolRequirements : Array<InventoryItemTag>;
	public abstract toolRequirementsValue : Array<number>;
	
	/**
	 * Check to see if the player can create the tool
	 * Look at the tool's unique material requirements and see if they have enough
	 * @param requirements the unique materials specifically neededto create the tool
	 * Return a boolean - whether it's true the player can create it or not
	 */
	public useTool(){
		let toolName = this.TOOL_NAME;
		for (let i = 0;i<this.toolRequirements.length; i++){
			let getRequiredItem : number | undefined = Inventory.items.get(this.toolRequirements[i] as InventoryItemTag);
			if (getRequiredItem == undefined){
				return String('lacking' + this.toolRequirements[i]);
			}
			else{
				if (getRequiredItem >= (this.toolRequirementsValue[i] as number)){
					return toolName;
				}
				else{
					return String('not enough' + this.toolRequirements[i]);
				}
			}
		}
	}
}