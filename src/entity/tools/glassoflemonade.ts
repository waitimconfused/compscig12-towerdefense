import Inventory, { InventoryItemTag } from "../../inventory.js";
import { Tool } from "./tool.js";

export class GlassOfLemonade extends Tool{
	public override entityType = "tool/glassoflemonade";
	private requirements = new Map<InventoryItemTag,number>();
	
	

	protected onDeath(){
		
	}

	public async brain(){
		
	}

	


	

	



	
}

export class IceCube extends GlassOfLemonade {
	
}