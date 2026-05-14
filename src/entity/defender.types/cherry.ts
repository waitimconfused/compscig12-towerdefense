import { DefenderEntity } from "../defender.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityEvent, EntityStats } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { MouseManager } from "../../mouse.js";

type DirectionalTargets = {
	front : Entity | undefined,
	back : Entity | undefined
};

export class Cherry extends DefenderEntity {
	//the ability for Cherry to attack front and back
	//available to use when at level 3 or higher
	private static canAttackFrontBack : boolean = false;

	/**label the kind of entity cherry is - a defender */
	public entityType : string = "defender/cherry";

	//Cherry base stats (lvl 1)
	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 20, speed: 2, baseSpeed : 2, damage: 6, 
			knockback:2, spawnCooldown: 3, attackCooldown: 3, entityPurchaseCost:10, entityResaleCost:5, stunChance:0.25, stunDuration:5000, upgradeEntityCost:15 },
	];

	//hide nearestEntity method from Entity, because Cherry needs to find the nearest Entity front and back of it
	//if Cherry has been upgraded
	public nearestEntity(origin:Entity, selector?:typeof Entity):DirectionalTargets {
		
		// Keep track of the nearest found entity (starts as undefined)
		let front:Entity|undefined = undefined;

		let back:Entity|undefined = undefined;

		// Keep track of the distance to the closest entity (starts as `Infinity`)
		let frontNearestDistance = Infinity;

		let backNearestDistance = Infinity;
		// Loop through each Entity instance
		for (let i = 0; i < Entity.entities.length; i ++) {

			// Get the current entity
			let entity = Entity.entities[i] as Entity;

			// If a selector has been set, and the entity is
			// not an instance of it, move onto the next entity
			if (selector && entity instanceof selector == false) continue;

			// Get the distance between the origin entity and the current entity
			let distance = Math.hypot(
				entity.position[0] - origin.position[0],
				entity.position[1] - origin.position[1]
			);

			//if Cherry has not been upgraded, only update the distance of the front enemy
			if (Cherry.canAttackFrontBack == true){
				//check whether the entity's x and y values are more or less than the Cherry
				//if the x and y is greater, then the entity is behind the Cherry
				//if the x and y is less, then the entity is in front of the Cherry
				//after checking the entity's position, check if it's any closer than the last recorded enemy
				if (entity.position[0] < origin.position[0] && entity.position[1] < origin.position[1]){
					// If the distance is less than the past nearest distance,
					// Update the stored entity and the stored distance
					if (distance < frontNearestDistance) {
						front = entity;
						frontNearestDistance = distance;
					}
				}
				else {
					back = entity;
					backNearestDistance = distance;
				}
			}
			else{
				// If the distance is less than the past nearest distance,
				// Update the stored entity and the stored distance
				if (distance < backNearestDistance) {
					back = entity;
					backNearestDistance = distance;
				}
			}	
		}

		return {front, back};
	}

	/**
	 * check to see if the cherry was able to stun enemy
	 * @param target the enemy
	 */
	private async attemptStun(target : Entity) : Promise<void> {
		//roll to see if the Cherry stuns the enemy
		//roll a number between 1-100
		let rollForStun : number =  Math.random();


		//make sure stunChance is a number
		if (this.stats.stunChance == undefined) {
			return;
		}
		//if the cherry rolls a number less than or equal to 25, they have stunned the enemy
		if (rollForStun <= this.stats.stunChance){
			
			await StatusEffects.stunEntity(target as Entity,this.stats.stunDuration as number);
		}
		//otherwise, return that it was not able to
		return;
	}
	
	//call method that unlocks Cherry's skill
	//unlockSkill(canAttackFrontBack);

	public async brain() {

		let cherryNearestEntity = this.nearestEntity(this,EnemyEntity);

		await this.wait(1000);

		let closestFrontEntity = cherryNearestEntity.front;

		let closestBackEntity = cherryNearestEntity.back;

		//if can't find Entity - return
		if (!closestFrontEntity) return;

		await this.walkTo(closestFrontEntity.position[0], closestFrontEntity.position[1]);

		let frontEnemyDistance = Entity.getDistance(this, closestFrontEntity);

		if (frontEnemyDistance <= 45){
			this.attackEntity(closestFrontEntity);
			this.attemptStun(closestFrontEntity);

			this.state = "frontattack";
			
			if (!closestBackEntity) return;
			
			let backEnemyDistance = Entity.getDistance(this, closestBackEntity);

			if (Cherry.canAttackFrontBack == true && backEnemyDistance <=45){
				await this.wait (500);

				this.attackEntity(closestBackEntity);
				this.attemptStun(closestBackEntity);

				this.state = "backattack";
			}

			await this.wait(5000);
		}
	}
}