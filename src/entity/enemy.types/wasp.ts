import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity, EntityEvent } from "../entity.js";

export class Wasp extends EnemyEntity {
	/**the readonly name of the entity Wasp - to prevent spelling mistakes*/
	public static readonly ENEMY_NAME = "Wasp";

	// Entity is type of wasp enemy
	public entityType: string = "enemy/wasp";

	// Wasp is a flying enemy
	public isFlying: boolean = true;

	// Permanent speed stacks
	private speedStacks : number = 0;

	// Wasp stats
	public static stats: EnemyEntityStats = {
		health: 25,
		speed: 0.2,
		damage: 10,
		knockBack: 10,
		spawnCoolDown: 10,
		attackCoolDown: 10,
		stunChance: 0,
		stunDuration: 0,
		slowDuration: 0,
		regenerationDuration: 0,
		aoeRange: 0,

	}

	// Enemy drops
	protected drops: EnemyDrops = {
		coins: 5,
		points: 10,
		materials: [
			{ type : 'honey', chance : 0.25, amount : 2 }
		]
	};

	/**
	 * Overrides attackEntity to implement unique attack animation
	 * @param entity The target entity
	 * @returns 
	 */
	public override async attackEntity(entity: Entity): Promise<undefined | EntityEvent> {
		// Returns if the wasp is stunned
		if (this.stunned) {
			return;
		}

		// Plays the attack animation
		this.state = 'attack'

		// Waits for 5 frames
		let interrupt = await this.wait(500);

		// Sets the wasp state to idle if it is interrupted during its attack
		if (interrupt) {
			this.state = 'idle';
		}

		// Deals damage to the entity
		let result = await super.attackEntity(entity);

		// Waits for the remaining 2 frames
		await this.wait(200);

		// Sets the wasp state to idle
		this.state = 'idle'

		return result;
	}

	/**
	 * Wasp flies towards the closest DefenderEntity and attacks it
	 * @returns 
	 */
	public async brain() {
		// Delay before targetting the next defender
		await this.wait(500);

		// Gets the closest DefenderEntity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		// Returns if there is not closest DefenderEntity
		if (!closestEntity) return;

		// Walks towards the closest DefenderEntity
		let interrupt = await this.walkTo(
			closestEntity.position[0], closestEntity.position[1]
		)

		// Attacks
		if (!interrupt) {
			let attackInterrupt = await this.attackEntity(closestEntity);

			if (attackInterrupt) {
				// Wasp was stopped from attacking

			} else if (closestEntity.stats.health <= 0) {
				this.stats.speed *= Math.pow(1.1, this.speedStacks)
				this.speedStacks++;
			}
		}
	}
}