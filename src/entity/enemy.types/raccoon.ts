import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Position2D } from "../../types.js";
import { Entity, EntityEvent, EntityStats } from "../entity.js";
import { MouseManager } from "../../mouse.js";
import { StatusEffects } from "../statusEffects.js";

/**
 * Creates a Raccoon as an EnemyEntity
 * 
 * Raccoons are high hp enemies that deal damage and randomly attack and stun defenders on the path
 */
export class Raccoon extends EnemyEntity {
	public entityType:string = "enemy/raccoon";

	public static stats: EnemyEntityStats[] = [
		{
			health: 100,
			speed: 0.2,
			damage: 10,
			knockBack: 10,
			spawnCoolDown: 10,
			attackCoolDown: 10,
			stunChance: 0,
			stunDuration: 0,
			slowDuration: 0,
			regenDuration: 0,
			aoeRange: 0,
			upgradeEntityCost: 0
		}
	];

	protected drops: EnemyDrops = {
		coins: 10,
		points: 10,
		materials: [
			{ type : 'wood', chance : 0.5, amount : 1 },
			{ type : 'jar', chance : 0.2, amount : 1 }
		]
	};

	public override healthScale: number = 1.2;

	public override async attackEntity(entity:Entity):Promise<undefined|EntityEvent> {
		if (this.stunned) {
			return;
		}

		this.state = 'attack';

		let interrupt = await this.wait(400);

		if (interrupt) {
			this.state = 'idle';
		}

		let result = await super.attackEntity(entity);

		await this.wait(200);

		this.state = 'idle';

		return result;
	}

	public async brain() {

		await this.wait(500);

		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		if (!closestEntity) return;

		let interrupt = await this.walkTo(
			closestEntity.position[0], closestEntity.position[1]
		);

		if (!interrupt) {
			let defenderHealth = closestEntity.stats.health;

			await this.attackEntity(closestEntity);

			if (defenderHealth > 0 && closestEntity.stats.health <= 0) {
				await StatusEffects.regenerateEntity(this, 5000, 3);
			}
		}

	}
}