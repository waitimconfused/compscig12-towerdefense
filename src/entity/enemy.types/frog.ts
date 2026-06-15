import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { Entity } from "../entity.js";

/**
 * Creates a Frog as an EnemyEntity
 * 
 * Frogs are medium health enemies that occasionally leap, and only deal damage to the defender base
 * Health increases by 15% every wave
 * 
 */
export class Frog extends EnemyEntity {
	// Frog entity type
	public entityType:string = "enemy/frog";

	// Initial stats of Frog
	public static override baseStats:EnemyEntityStats = {
		health: 75,
		speed: 0.75,
		damage: 0,
		knockBack: 10,
		spawnCoolDown: 10,
		attackCoolDown: 10,
		stunChance: 0,
		stunDuration: 0,
		slowDuration: 0,
		regenerationDuration: 0,
		aoeRange: 0
	}
	
	// Frog can or is leaping
	public isLeaping:boolean;
	public canLeap:boolean = true;

	// Items Frog can drop
	public drops : EnemyDrops = {
		coins: 5,
		points: 10,
		materials : [
			{ type : 'jar', chance : 0.3, amount : 1 }
		]
	}
	
	/**
	 * Attempt to leap
	 * @param target 
	 */
	private async tryLeap() {
		// Frog is leaping
		this.isLeaping = true;
	
		// Cannot deal damage but can't take damage when leaping
		this.stunned = true;
		this.invulnerable = true;

		// Play walk (leap) animation
		this.state = 'walk';

		await this.walkTo(
			// placeholder for now, walk to nearest part on the path
			this.position[0] + 100,
			this.position[1]
		);
		
		// Wait for 6 frames
		await this.wait(600);
		
		// Reset state, isLeaping, stunned, invulnerable
		this.state = 'idle';
		this.isLeaping = false;
		this.stunned = false;
		this.invulnerable = false;
	}

	public async brain() {
		await this.wait(500);

		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		if (!closestEntity) {
			return;
		}

		// normal movement
		let interrupt = await this.walkTo(
			closestEntity.position[0],
			closestEntity.position[1]
		)

		if (!interrupt) {
			// Try leap occasionally
			if (this.canLeap) {
				this.tryLeap();
			}
		}
		
	}
}