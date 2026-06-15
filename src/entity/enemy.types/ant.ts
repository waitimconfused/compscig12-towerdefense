import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DamageType, Entity, EntityEvent } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Position2D } from "../../types.js";
import { Wave } from "../../wave.js";

/**
 * Creates an Ant as an EnemyEntity
 * 
 * Ants are low health enemies that deal damage and spawn in clusters
 * Vulnerable to AOE, health increases every wave by 10%
 */
export class Ant extends EnemyEntity {
	/**the readonly name of the entity Ant - to prevent spelling mistakes*/
	public static readonly ENEMY_NAME = "Ant";
	
	// Ant entity type
	public entityType = "enemy/ant";
	
	// Stats of Ant
	public static override baseStats : EnemyEntityStats = {
		health: 100,
		speed: 0.1,
		damage: 1,
		knockBack: 10,
		spawnCoolDown: 10,
		attackCoolDown: 10,
		stunChance: 0,
		stunDuration: 0,
		slowDuration: 0,
		regenerationDuration: 0,
		aoeRange: 0
	}
	
	// Items Ant can drop
	public drops : EnemyDrops = {
		coins: 2,
		points: 5,
		materials: [
			{ type : 'wood', chance : 0.2, amount : 2 },
			{ type : 'lemonade_glass', chance : 0.1, amount : 1 }
		]
	}

	public static path = "M0 50.0634C311.161 43.5073 285.567 549.586 561.679 457.548C837.79 365.511 1133.82 328.192 1160.05 573.793C1186.27 819.393 693.305 992.373 577.06 751.311C460.816 510.249 486.752 130.908 881.377 115.526C1276 100.145 1478.86 273.376 1553.5 492.5C1613.21 667.8 1797.04 726.431 1900 700.88";

	/**
	 * Override, Ant takes more damage from AOE type attacks
	 * @param dealtDamage Amount of damage dealt
	 * @param attacker The entity that attacked
	 * @param damageType Damage type default of melee
	 * @returns Undefined or EntityEvent with interrupt type and origin of attack trigger
	 */
	public override dealDamage(dealtDamage:number, attacker:Entity, damageType : DamageType = 'melee'):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {

			// Initializes final damage as damage dealt to Ant
			let finalDamage = dealtDamage;

			// Attack deals 25% more damage if attack type is 'aoe'
			if (damageType == 'aoe') {
				finalDamage *= 1.25;
			}

			// Decrease Ant health by final damage dealt
			this.stats.health -= finalDamage;

			// Interrupts Ant timers
			this.interruptTimers(null, {
				triggered_by: attacker,
				interrupt_type: "attacked"
			});

			// Resolve promise
			resolve(undefined);
		});

	}

	/**
	 * Override attackEntity to implement attack animations
	 * @param entity The entity to attack
	 * @returns Undefined or EntityEvent with interrupt type and origin of attack trigger
	 */
	public override async attackEntity(entity: Entity): Promise<undefined | EntityEvent> {
		// Returns if the entity is stunned
		if (this.stunned) {
			return;
		}

		// Begins attack animation
		this.state = 'attack';

		// Waits for 4 attack frames
		let interrupt = await this.wait(400);

		// Stops attack animation when interrupted
		if (interrupt) {
			this.state = 'idle';
			return;
		}

		// Attacks target entity
		let result = await super.attackEntity(entity);

		// Plays last frame
		await this.wait(100);

		// Reset animation to idle
		this.state = 'idle';

		return result;
	}

	/**
	 * Ant attempts to walk towards and attack the closest entity
	 * @returns If there is no closest entity
	 */
	public async brain() {

		await this.followPath(Ant.path, true);

		await this.wait(500);

		// Get the closest DEFENDER entity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);
	
		if (!closestEntity || closestEntity.stats.health <= 0) {
			super.interruptTimers("walk");
			return;
		}
	
		// Walk toward defender
		let interrupt = await this.walkToEntity(closestEntity);

		// Attacks
		if (!interrupt) {
			// Stores closest defender health
			let defenderHealth = closestEntity.stats.health;
			let attackInterrupt = await this.attackEntity(closestEntity);
			
			if (attackInterrupt) {
				// Ant was stopped from attacking

			} else if (closestEntity.stats.health <= 0) {
				// Regenerates if the closestEntity is dead
				if (defenderHealth > 0 && closestEntity.stats.health <= 0) {
					await StatusEffects.regenerateEntity(this, 5000, 2);
				}
			}
		}
	}
	
	/**
	 * Spawns a cluster of ants at a small chance
	 * @param waveNumber The current wave number
	 */
	public static antSpawn(position:Position2D, spread?:number) : Entity[] {
		// Spawns waveNumber amount of Ant(s) up to a maximum of 15
		let cluster : number = Math.min(Wave.getWave(), 10) + 5;

		// Spawns 3-8 ants
		let randomAnts : number = Math.floor(Math.random() * 6 + 3);

		// Tracks number of ants to spawn
		let count : number = 0;

		// Spawns a cluster of ants at a 10% chance
		// Otherwise spawns 3-8 ants
		if (Math.random() <= 0.1) {
			count = cluster;
		} else {
			count = randomAnts;
		}

		return super.spawn(count, position, spread);
	}
}