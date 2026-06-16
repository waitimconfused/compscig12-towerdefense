import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity, EntityEvent } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";

/**
 * Creates a Raccoon as an EnemyEntity
 * 
 * Raccoons are high hp enemies that deal damage and randomly attack and stun defenders on the path
 */
export class Raccoon extends EnemyEntity {
	// Entity is raccoon enemy type
	public entityType : string = "enemy/raccoon";

	// Base stats of the raccoon
	public static override baseStats: EnemyEntityStats = {
		health: 100,
		speed: 0.2,
		damage: 10,
		knockBack: 10,
		spawnCoolDown: 10,
		attackCoolDown: 10,
		stunChance: 0,
		stunDuration: 0,
		slowDuration: 0,
		regenerationDuration: 0,
		aoeRange: 0
	};

	// Raccoon unique drops
	protected drops: EnemyDrops = {
		coins: 10,
		points: 10,
		materials: [
			{ type : 'wood', chance : 0.5, amount : 1 },
			{ type : 'jar', chance : 0.2, amount : 1 }
		]
	};

	/**
	 * Override attackEntity to implement unique attack animation
	 * @param entity The entity to attack
	 * @returns 
	 */
	public override async attackEntity(entity:Entity):Promise<undefined|EntityEvent> {
		// Returns if the enemy is stunned
		if (this.stunned) {
			return;
		}

		// Plays attack animation
		this.state = 'attack';

		// Waits for 4 frames
		let interrupt = await this.wait(400);

		// Attacks target entity
		let result = await super.attackEntity(entity);

		// If raccoon was interrupted during the attack, set state to idle
		if (interrupt) this.state = 'idle';

		// Waits for the remaining 2 frames
		await this.wait(200);

		// Reset animation to idle
		this.state = 'idle';

		return result;
	}

	/**
	 * Raccoon walks toward and attempts to attack the closest entity
	 * @returns If there is no defender in range
	 */
	public async brain() {
		// Delay before targeting next entity
		await this.wait(500);

		// Gets the closest DefenderEntity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		if (!closestEntity || closestEntity.stats.health <= 0) return;

		// Walks towards the closest DefenderEntity
		let interrupt = await this.walkToEntity(closestEntity);

		// Attacks
		if (!interrupt) {
			let defenderHealth = closestEntity.stats.health;
			let attackInterrupt = await this.attackEntity(closestEntity);
			
			if (attackInterrupt) {
				// Raccoon was stopped from attacking

			} else if (closestEntity.stats.health <= 0) {
				// Regenerates if the closestEntity is dead
				if (defenderHealth > 0 && closestEntity.stats.health <= 0) {
					await StatusEffects.regenerateEntity(this, 5000, 3);
				}
			}
		}

	}
}