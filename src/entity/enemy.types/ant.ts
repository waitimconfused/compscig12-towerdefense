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
		let interrupt = await this.wait(400, undefined, false);

		// Stops attack animation when interrupted
		if (interrupt) {
			this.state = 'idle';
			return;
		}

		// Attacks target entity
		let result = await super.attackEntity(entity);

		// Plays last frame
		await this.wait(100, undefined, false);

		// Reset animation to idle
		this.state = 'idle';

		return result;
	}

	/**
	 * Ant attempts to walk towards and attack the closest entity
	 * @returns If there is no closest entity
	 */
	public async brain() {

		if (this.disableWalking) return;

		await this.followPath(EnemyEntity.path, false, (interrupt) => {
			if (this.currentPath) {
				console.log("RESETTING POSITION")
				this._targetPath = this.currentPath;
				this._targetPathLength = this.currentPathLength;
				this._targetPathMaxLength = this.currentPathMaxProgress;

				this.currentPath = null;
				this.currentPathLength = 0;
				this.currentPathMaxProgress = 0;
			}
			this.brainHelper(interrupt);
		});

	}

	public async brainHelper(interrupt:()=>void) : Promise<void> {
		// Get the closest DEFENDER entity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);
	
		if (!closestEntity) {
			this.disableWalking = false;
			return;
		}

		let distance = Entity.getDistance(this, closestEntity);

		if (distance >= 200) {
			this.disableWalking = false;
			return;
		}

		this.disableWalking = true;
		this.currentPath = this._targetPath;
		this.currentPathLength = this._targetPathLength;
		this.currentPathMaxProgress = this._targetPathMaxLength;

		interrupt();

		// Walk toward defender
		await this.walkToEntity(closestEntity);
		await this.attackEntity(closestEntity);

		this.disableWalking = false;

		if (closestEntity.stats.health <= 0) {
			// Regenerates if the closestEntity is dead
			await StatusEffects.regenerateEntity(this, 5000, 2);
		}

		this.disableWalking = false;
	
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