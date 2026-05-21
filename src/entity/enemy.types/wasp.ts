import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity, EntityEvent } from "../entity.js";

export class Wasp extends EnemyEntity {
	/**the readonly name of the entity Wasp - to prevent spelling mistakes*/
	public static readonly ENEMY_NAME = "Wasp";

	public entityType: string = "enemy/wasp";

	public isFlying: boolean = true;

	public speedStacks : number = 0;

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
		upgradeEntityCost: 0
	}

	protected drops: EnemyDrops = {
		coins: 5,
		points: 10,
		materials: [
			{ type : 'honey', chance : 0.25, amount : 2 }
		]
	};

	public healthScale: number = 1.2;

	public override async attackEntity(entity: Entity): Promise<undefined | EntityEvent> {
		if (this.stunned) {
			return;
		}

		this.state = 'attack'

		let interrupt = await this.wait(500);

		if (interrupt) {
			this.state = 'idle';
		}

		let result = await super.attackEntity(entity);

		await this.wait(200);

		this.state = 'idle'

		return;
	}

	public async brain() {
		await this.wait(5000);

		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		if (!closestEntity) return;

		let interrupt = await this.walkTo(
			closestEntity.position[0], closestEntity.position[1]
		)

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