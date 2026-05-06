import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity } from "../enemy.js";
import { Entity, EntityStats } from "../entity.js";

/**
 * Creates an Ant as an EnemyEntity
 * 
 * Ants are low health enemies that deal damage and spawn in clusters
 * Vulnerable to AOE, health increases every wave by 10%
 */
export class Ant extends EnemyEntity {

	public entityType = "enemy/ant";
	
	public static override : EntityStats[] = [
		{ health: 0, max_health: 100, speed: 0.5, baseSpeed : 0.5, damage: 10 },
	];

	protected drops : EnemyDrops = {
		coins: 2,
		points: 5,
		materials: [
			{ type : 'wood', chance : 0.2, amount : 2 },
			{ type : 'glassLemonade', chance : 0.1, amount : 1 }
		]
	}

	public async brain() {
		await this.wait(100);
		
		// Get the closest DEFENDER entity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);
	
		if (!closestEntity) {
			return;
		}
	
		let interrupt = await this.walkTo(
			closestEntity.position[0],
			closestEntity.position[1]
		);
	
		if (!interrupt) {
			this.attackEntity(closestEntity);
		}
	
	}
}