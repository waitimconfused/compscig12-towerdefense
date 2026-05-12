import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { Entity, EntityEvent } from "../entity.js";

/**
 * Creates a Frog as an EnemyEntity
 * 
 * Frogs are medium health enemies that occasionally leap, and only deal damage to the defender base
 * Health increases by 15% every wave
 * 
 */
export class Frog extends EnemyEntity {
	// Frog entity type
	public override entityType:string = "enemy/frog";

	// Initial stats of Frog
	public static stats:EnemyEntityStats[] = [
		{
			health: 75,
			speed: 0.75,
			damage: 0,
			knockBack: 10,
			spawnCoolDown: 10,
			attackCoolDown: 10
		}
	]

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

	public override healthScale: number = 1.15;
	
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
			this.position[0] + 2,
			this.position[1]
		);
		
		// Wait for 6 frames
		await this.wait(600);
		
		// Reset state, isLeaping, stunned, invulnerable
		this.state = 'idle'
		this.isLeaping = false;
		this.stunned = false;
		this.invulnerable = false;
	}

	public async brain() {
		await this.wait(3000);

		// Try leap occasionally
		if (this.canLeap) {
			this.tryLeap();
		}
		
		// // normal movement
		// await this.walkTo(
		// 	target.position[0],
		// 	target.position[1]
		// );
	}
}