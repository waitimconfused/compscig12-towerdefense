import { Entity } from "../entity.js";
import { EnemyEntity } from "../enemy.js";
import { DefenderEntityStats } from "../defender.js";
import { MouseManager } from "../../mouse.js";
import { Position2D } from "../../types.js";
import { Kernal } from "./kernal.js";
import { Wasp } from "../enemy.types/wasp.js";

/**
 * create the class Corn that extends from Entity
 */
export class Corn extends Entity{
	protected kernalAOE : boolean = false;

	/**label the kind of entity corn is - a defender */
	public override entityType = "defender/corn";

	/**
	 * the corn's lvl 1 stats
	 * through the DefenderEntity class, it will be able to level up, with reference to its base stats
	 */
	public static override baseStats: DefenderEntityStats = {
		health: 25,
		speed: 3,
		damage: 15, 
		knockBack: 3,
		spawnCoolDown: 7,
		attackCoolDown: 5,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenDuration : 0,
		aoeRange : 10,
		upgradeEntityCost : 40,
		entityPurchaseCost: 35,
		entityResaleCost: 17
	};

	/**
	 * WIP when the corn dies
	 */
	protected override die(): void {
		
	}

	//call method to unlock corn's skill
	//unlockSkill(kernalAOE);

	/**
	 * the brain checks for events that happen around and to the Corn
	 * as of now it is used to check for enemies nearby
	 * @returns if there are no enemies nearby, get out of teh brain
	 */
	public async brain() {
		//store the closest enemy entity nearby from the Corn
		let closestEntity = Entity.nearestEntity(this, EnemyEntity) as EnemyEntity | undefined;

		//if there are no entities nearby, don't continue running the code
		if (!closestEntity) return;

		//store the distance between the enemy and the corn
		let distance = Entity.getDistance(this, closestEntity);

		//if the distance between the enemy and the corn is less than or equal to 45 pixels, 
		// and Corn has not been stunned, start attacking
		//the corn will shoot/summon a kernal between the position of the Corn and the enemy
		if (distance <= 45 && this.stunned == false){
			new Kernal(this.position, closestEntity);
			
			//change the Corn's state to shooting
			this.state = "shoot";

			//wait for a bit for the animation to play(half a second)
			await this.wait(500);

			//once done waiting revert Corn's animation back to idling
			this.state = "idle";
		}
	}
}
