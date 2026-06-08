import Inventory, { InventoryItemTag } from "../../inventory.js";
import { EntityStats } from "../entity.js";
import { Tool } from "./tool.js";

export class Toothpick extends Tool{
	//Entity type is toothpick tool
	public override entityType = "tool/toothpick";
	//Constant for tool name - to be used when creating tool and not make spelling errors
	public override TOOL_NAME: string = "GLASS_OF_LEMONADE";

	//a linear array is used for tool requirements so that the requirements can be searched through and analysed 
	//when assessing of the player has sufficient items to create it

	//requirements for making glass of lemonade
	public override toolRequirements : Array<InventoryItemTag> = ['jar','coin'];
	//the total amount of each item for the lemonade
	public override toolRequirementsValue : Array<number> = [1,50];
	
	/**base stats of Glass of Lemonade */
	public static override baseStats: EntityStats = {
		health: 20,
		speed: 0,
		damage: 10,
		knockBack: 0,
		spawnCoolDown : 0,
		attackCoolDown : 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
	}

	public async brain(){
		this.state = "idle";

	}
}

	


	

	



	
}