import { DefenderEntity } from "../defender.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats } from "../entity.js";

export class Cherry extends DefenderEntity {

	public entityType:string = "defender/cherry";

	public static override upgrades: EntityStats[] = [

	];

	public override movementTick(targetPosition: Position2D, deltaTime: number): void {
		super.movementTick(targetPosition, deltaTime);
	}

	public async brain() {

		await this.wait(1000);

		let closestEntity = Entity.nearestEntity(this, EnemyEntity);

		if (!closestEntity) return;

		await this.walkTo(closestEntity.position[0], closestEntity.position[1]);

	}

}