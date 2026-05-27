import Inventory, { InventoryItemTag } from "../../inventory.js";
import { EntityStats } from "../entity.js";
import { Tool } from "./tool.js";

export class Toothpick extends Tool{
	public override entityType = "tool/toothpick";
	private requirements = new Map<InventoryItemTag,number>();
	
	/**base stats of Glass of Lemonade */
	public static override baseStats: EntityStats = {
		health: 20,
		speed: 0.4,
		damage: 10,
		knockBack: 10,
		spawnCoolDown : 3,
		attackCoolDown : 3,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
	}

	public override toolRequirements: Map<InventoryItemTag, number>;

	public override canCreateTool(requirements: Array<InventoryItemTag>): boolean {
		return true;
	}
	protected onDeath(){
		
	}

	public async brain(){
		
	}

	


	

	



	
}