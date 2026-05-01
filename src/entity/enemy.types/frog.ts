import { Position2D } from "../../types.js";
import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityEventInterrupt } from "../entity.js";

export class Frog extends EnemyEntity {

	public override entityType:string = "enemy/frog";

	public isLeaping:boolean;
	public canLeap:boolean = true;

	// Override the default movement style
	// to add a jumping behaviour
	public override movementTick(targetPosition:Position2D) {
		// !TODO
	}

	public async brain() {

		// Get the closest DEFENDER entity
		let closestEntity = Entity.nearestEntity(this, DefenderEntity);

		// If there was no defender, stop.
		if (!closestEntity) return;

		await this.walkTo(closestEntity.position[0], closestEntity.position[1]);

	}
}