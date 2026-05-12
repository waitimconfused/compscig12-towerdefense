import { EnemyDrops, EnemyEntity, EnemyEntityStats } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity } from "../entity.js";

export class Wasp extends EnemyEntity {

	public entityType: string = "enemy/wasp";

	public isFlying: boolean = true;

	public speedStacks : number = 0;

	public static override upgrades: EnemyEntityStats[] = [
		{
			health: 25,
			max_health: 25,
			speed: 0.2,
			damage: 10,
			knockBack: 10,
			spawnCoolDown: 10,
			attackCoolDown: 10
		}
	];

	protected drops: EnemyDrops = {
		coins: 5,
		points: 10,
		materials: [
			{ type : 'honey', chance : 0.25, amount : 2 }
		]
	};

	public override healthScale: number = 1.2;

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