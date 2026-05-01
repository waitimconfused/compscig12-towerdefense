import { EnemyEntity } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Position2D } from "../../types.js";
import { Entity, EntityStats } from "../entity.js";

/**
 * Creates a Raccoon as an EnemyEntity
 * 
 * Raccoons are high hp enemies that deal damage and randomly attack and stun defenders on the path
 */
export class Raccoon extends EnemyEntity {
	// Duration in seconds that defender is stunned for when hit
	//private stunDuration: number = 5;
	
	// Probability of attacking with each attempt
	// 20% chance of attacking
	//private attackChance: number = 0.2;

	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 100, speed: 10, damage: 10 }
	];

	public entityType:string = "enemy/raccoon";

	

	/**
	 * Constructs a Raccoon enemy
	 * @param view The game view to reference
	 * @param waveNumber Current wave number
	 */
	constructor(position:Position2D) {

		super(position);

		// this.setDrops({
		// 	coins : 1,
		// 	points : 2,
		// 	materialDropRate : {
		// 		'wood' : 0.3,
		// 		'jar' : 0.3
		// 	}
		// });
	}

	public async brain() {
		console.log("ASD");

		await this.walkTo(Math.random()*100, Math.random()*100);

		// let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		// if (!closestEntity) return;

		// let walkInterrupt = await this.walkTo(closestEntity.position[0], closestEntity.position[1]);

		// if (walkInterrupt) {
		// 	// Raccoon was stopped from walking
		
		// } else {
		// 	let attackInterrupt = await this.attackEntity(closestEntity);

		// 	if (attackInterrupt) {
		// 		// Raccoon was stopped from attacking
			
		// 	} else if (closestEntity.stats.health <= 0) {
		// 		// Entity was defeated!

		// 		this.stats.health += 20; // Small regeneration boost

		// 		// Make sure the health can't exceed the maximum health
		// 		this.stats.health = Math.min( this.stats.health, this.stats.max_health );

		// 	}

		// }

	}

}