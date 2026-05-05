import { EnemyEntity } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity } from "../entity.js";
import { Position2D } from "../../types.js";

export class Wasp extends EnemyEntity {

	public entityType: string = "enemy/wasp";

	public isFlying: boolean = true;

	// Override the default movement style
	// to add a flying behaviour
	public override movementTick(targetPosition: Position2D): void {
		// TODO
	}


	public async brain() {
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		if (!closestEntity) return;

		let walkInterrupt = await this.walkTo(closestEntity.position[0], closestEntity.position[1]);

		if (walkInterrupt) {
			// Raccoon was stopped from walking

		} else {
			let attackInterrupt = await this.attackEntity(closestEntity);

			if (attackInterrupt) {
				// Raccoon was stopped from attacking

			} else if (closestEntity.stats.health <= 0) {
				// Entity was defeated!

				this.stats.health += 20; // Small regeneration boost

				// Make sure the health can't exceed the maximum health
				this.stats.health = Math.min(this.stats.health, this.stats.max_health);

			}

		}

	}
}