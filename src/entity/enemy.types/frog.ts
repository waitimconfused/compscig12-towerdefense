import { DefenderEntity } from "../defender.js";
import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { Entity } from "../entity.js";
import { Carrier } from "../other/carrier.js";

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
		speed: 0.1,
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
	
	public async brain() {
	
		let entities: Entity[] = Entity.totalEntitiesInRange(this, Infinity, DefenderEntity);
	
		let target: Carrier | undefined;
	
		for (let i = 0; i < entities.length; i++) {
			if (entities[i] instanceof Carrier) {
				target = entities[i] as Carrier;
				break;
			}
		}
	
		if (!target) return;
	
		await this.walkToEntity(target);
	}
}