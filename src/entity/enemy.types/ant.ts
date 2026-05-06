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
	
	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 100, speed: 0, damage: 10 },
		{ health: 0, max_health: 120, speed: 0, damage: 20 }
	];

	protected drops:EnemyDrops = {
		coins: 2,
		points: 5,
		materials: {
			wood: 0.1
		}
	};

	public async brain() {
		while (this.stats.health > 0) {
			// Get the closest DEFENDER entity
			let closestEntity = Entity.nearestEntity(this, DefenderEntity);
	
			if (!closestEntity) {
				await this.wait(100);
				continue;
			}
	
			let interrupt = await this.walkTo(
				closestEntity.position[0],
				closestEntity.position[1]
			);
	
			if (!interrupt) {
				this.attackEntity(closestEntity);
			}
	
			await this.wait(100);
		}
	}
}