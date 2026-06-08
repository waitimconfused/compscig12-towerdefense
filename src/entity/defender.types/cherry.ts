import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
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
	 * The readonly name of the entity Cherry - to prevent spelling mistakes
	 */
	public static readonly DEFENDER_NAME = "CHERRY";
	
	/**
	 * The ability for Cherry to attack enemies in front and behind them
	 * 
	 * This is available to use when at level 3 and up
	 */
	private static canAttackFrontBack : boolean = false;
	
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
			if (Cherry.canAttackFrontBack == true){
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
			
			await StatusEffects.stunEntity(target as Entity,this.stats.stunDuration as number);
		}
		// Otherwise, return that it was not able to
		return;
	}
	
	// Call method that unlocks Cherry's skill
	// UnlockSkill(canAttackFrontBack);
	public async brain() {

		let cherryNearestEntity = this.nearestEnemies();

		await this.wait(1000);

		let closestFrontEntity = cherryNearestEntity.front;

		let closestBackEntity = cherryNearestEntity.back;

		// If Entity not found, don't do anything
		if (!closestFrontEntity) return;

		await this.walkTo(closestFrontEntity.position[0], closestFrontEntity.position[1]);

		let frontEnemyDistance = Entity.getDistance(this, closestFrontEntity);

		if (frontEnemyDistance <= 45){
			this.attackEntity(closestFrontEntity);
			this.attemptStun(closestFrontEntity);

			this.state = "front-attack";
			
			if (!closestBackEntity) return;
			
			let backEnemyDistance = Entity.getDistance(this, closestBackEntity);

			if (Cherry.canAttackFrontBack == true && backEnemyDistance <=45){
				await this.wait (500);

				this.attackEntity(closestBackEntity);
				this.attemptStun(closestBackEntity);

				this.state = "back-attack";
			}

			await this.wait(5000);
		}
	}
}