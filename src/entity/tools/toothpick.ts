import Inventory, { InventoryItemTag } from "../../inventory.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats } from "../entity.js";
import { Tool } from "./tool.js";

export class Toothpick extends Tool{
	//Entity type is toothpick tool
	public override entityType = "tool/toothpick";
	//Constant for tool name - to be used when creating tool and not make spelling errors
	public override TOOL_NAME: string = "TOOTHPICK";

	//a linear array is used for tool requirements so that the requirements can be searched through and analysed 
	//when assessing of the player has sufficient items to create it

	//requirements for making glass of lemonade
	public override toolRequirements : Array<InventoryItemTag> = ['wood','coin'];
	//the total amount of each item for the lemonade
	public override toolRequirementsValue : Array<number> = [3,10];

	private toolUsedCounter : number = 3;
	
	/**base stats of Toothpick */
	public static override baseStats: EntityStats = {
		health: 20,
		speed: 0,
		damage: 10,
		knockBack: 0,
		spawnCoolDown : 0,
		attackCoolDown : 3000,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
	}

	protected onDeath(){}

	public async brain(){
		this.state = "idle";
		//store the closest enemy entity nearby from the Corn
		let closestEnemy = Entity.nearestEntity(this, EnemyEntity) as EnemyEntity | undefined;

		//if there are no entities nearby, don't continue running the code
		if (!closestEnemy) return;

		//store the distance between the enemy and the corn
		let distance = Entity.getDistance(this, closestEnemy);

		//if the entity is approaching, get ready to attack the enemy
		//a short distance that is not 0 is picked so that the animation can play of the toothpick lifting up before attacking
		//make sure that the amount of uses excceeds 0
		if (distance <=10 && this.toolUsedCounter !=0){
			this.state = "use";
			this.attackEntity(closestEnemy);
			this.toolUsedCounter --;
		}
		//if there are no more times the toothpick can be used, remove from playing field
		else if (this.toolUsedCounter == 0){
			this.state = "no-more-uses";
			this.stats.health = 0;
		}
	}
}