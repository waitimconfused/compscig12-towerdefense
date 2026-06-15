import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Ant } from "../enemy.types/ant.js";
import { Entity, EntityEvent } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";

/**
 * Create a type for storing the nearest entity in front and behind the Cherry
 */
type DirectionalTargets = {
	front : Entity | undefined,
	back : Entity | undefined
};

export class Cherry extends DefenderEntity {	
	/**
	 * Label the kind of entity cherry is - a defender
	 */
	public entityType : string = "defender/cherry";

	/**
	 * `baseStats` of Cherry Entity
	 */
	public static override baseStats:DefenderEntityStats = {
		health: 20,
		speed: 0.50,
		damage: 10,
		knockBack: 2,
		spawnCoolDown: 3000,
		attackCoolDown: 3000,
		stunChance : 0.25,
		stunDuration : 4000,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
		upgradeEntityCost : 15,
		entityPurchaseCost: 10,
		entityResaleCost: 5
	}

	public static path = "M0 50.0634C311.161 43.5073 285.567 549.586 561.679 457.548C837.79 365.511 1133.82 328.192 1160.05 573.793C1186.27 819.393 693.305 992.373 577.06 751.311C460.816 510.249 486.752 130.908 881.377 115.526C1276 100.145 1478.86 273.376 1553.5 492.5C1613.21 667.8 1797.04 726.431 1900 700.88"

	/**
	 * Hide nearestEntity method from Entity to detect Entities in front and behind it
	 * this is needed when Cherry is upgraded and can use their skill
	 */
	public nearestEnemies(): DirectionalTargets {
		
		// Keep track of the nearest found entity (starts as undefined)
		let front:Entity|undefined = undefined;

		let back:Entity|undefined = undefined;

		// Keep track of the distance to the closest entity (starts as `Infinity`)
		let frontNearestDistance = Infinity;

		let backNearestDistance = Infinity;

		// Get all the entities currently active
		let entities = [...Entity.entities.values()];

		// Loop through each Entity instance
		for (let i = 0; i < entities.length; i ++) {

			// Get the current entity
			let entity = entities[i] as Entity;

			// If a selector has been set, and the entity is
			// If not an instance of it, move onto the next entity
			if (entity instanceof EnemyEntity == false) continue;

			// Get the distance between the origin entity and the current entity
			let distance = Math.hypot(
				entity.position[0] - this.position[0],
				entity.position[1] - this.position[1]
			);

			// If Cherry has not been upgraded, only update the distance of the front enemy
			if (Cherry.canUseSkill == true){
				// Check whether the entity's x and y values are more or less than the Cherry
				// If the x and y is greater, then the entity is behind the Cherry
				// If the x and y is less, then the entity is in front of the Cherry
				// After checking the entity's position, check if it's any closer than the last recorded enemy
				if (entity.position[0] < this.position[0] && entity.position[1] < this.position[1]){
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
	 * Check to see if the cherry was able to stun enemy
	 * @param target The enemy
	 */
	private async attemptStun(target : Entity) : Promise<void> {
		// Roll to see if the Cherry stuns the enemy
		// Roll a number between 1-100
		let rollForStun : number =  Math.random();

		// Make sure stunChance is a number
		if (this.stats.stunChance == undefined) {
			return;
		}
		// If the cherry rolls a number less than or equal to 25, they have stunned the enemy
		if (rollForStun <= this.stats.stunChance){
			
			await StatusEffects.stunEntity(target as Entity,this.stats.stunDuration);
		}
		// Otherwise, return that it was not able to
		return;
	}

	public override async attackEntity(entity: Entity): Promise<undefined | EntityEvent> {
		//Return if Defender is stunned
		if (this.stunned) return;

		//Wats for 4 attack frames
		let interrupt = await this.wait(400);

		//Stops attack animation when interrupted
		if (interrupt){
			this.state = 'idle';
			return;
		}

		//Attack target entity
		await super.attackEntity(entity);
		
		//Stun entity
		await this.attemptStun(entity);

		//Play last frame
		await this.wait (100);

		this.state = "idle";

		return;
		
	}
	
	// Call method that unlocks Cherry's skill
	// UnlockSkill(canAttackFrontBack);
	public async brain() {
		await this.followPath(Cherry.path);

		await this.wait(400);

		//Get the nearest enemy to Cherry
		let cherryNearestEntity = this.nearestEnemies();



		await this.wait(500);

		//Store the values of the Cherry's nearest front and back entity
		let closestFrontEntity = cherryNearestEntity.front;

		let closestBackEntity = cherryNearestEntity.back;

		// If Entity not found or dead, don't do anything
		if (!closestFrontEntity || closestFrontEntity.stats.health <= 0) return super.interruptTimers("walk");

		//Walk towards enemy
		let interrupt = await this.walkToEntity(closestFrontEntity);

		//get the distance of the front enemy
		let frontEnemyDistance = Entity.getDistance(this, closestFrontEntity);

		//Attack enemy if there has been no interruptions and distance is less than or equal to 45
		if (frontEnemyDistance <= 45 && !interrupt){
			this.state = "front-attack";

			this.attackEntity(closestFrontEntity);
	
			//if the Cherry has not been upgraded or there is no entity behind, return
			if (Cherry.canUseSkill == false || !closestBackEntity) return;
			
			let backEnemyDistance = Entity.getDistance(this, closestBackEntity);

			//If the Cherry has been upgraded and there are no interruptions, it may attack from behind
			if (backEnemyDistance <=45 && !interrupt){
				this.state = "back-attack";

				this.attackEntity(closestBackEntity);
			}
		}
	}
}