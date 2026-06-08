import Inventory, { InventoryItemTag } from "../../inventory.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Tool } from "./tool.js";

export class JarOfHoney extends Tool{
	public override entityType = "tool/toothpick";
	
	//Constant for tool name - to be used when creating tool and not make spelling errors
	public override TOOL_NAME: string = "JAR_OF_HONEY";

	//A linear array is used for tool requirements so that the requirements can be searched through and analysed 
	//When assessing of the player has sufficient items to create it

	//Requirements for making glass of lemonade
	public override toolRequirements : Array<InventoryItemTag> = ['jar','honey','coin'];
	//The total amount of each item for the lemonade
	public override toolRequirementsValue : Array<number> = [1,3,10];

	//Jar of Honey can only slow up to 10 enemies
	private enemiesCaptured : number = 0; 
	
	/**Base stats of Jar of Honey */
	public static override baseStats: EntityStats = {
		health: 20,
		speed: 0,
		damage: 0,
		knockBack: 0,
		spawnCoolDown : 0,
		attackCoolDown : 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 15000,
		regenerationDuration : 0,
		aoeRange : 0,
	}

	
	protected onDeath(){}

	public async brain(){
		//See if there are any enemies that are touching the honey
		let entitiesNearHoney = Entity.totalEntitiesInRange(this,this.stats.aoeRange as number, EnemyEntity);

		//If there is at least one, stun and slow them
		if (entitiesNearHoney.length >= 1){
			for (let i = 0;i<entitiesNearHoney.length;i++){
				//Honey can only slow 10 enemies before disappearing off the playing field
				if (this.enemiesCaptured < 10){
					StatusEffects.slowEntity(entitiesNearHoney[i] as Entity, this.stats.slowDuration as number);
					this.enemiesCaptured ++;
				}
				else {
					this.stats.health = 0;
				}
			}
		}
		//Otherwise, don't search through the variable "entitiesNearHoney"
		else{
			return;
		}
	}

	


	

	



	
}