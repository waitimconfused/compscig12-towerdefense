import { Position2D } from "../../types";
import { EnemyEntity } from "../enemy";
import { Entity, EntityStats } from "../entity";

export class Cherry extends Entity {

	public entityType:string = "defender/cherry";

	public static override upgrades: EntityStats[] = [

	];

	public override movementTick(targetPosition: Position2D, deltaTime: number): void {
		
	}

	public async brain() {

		await this.wait(1000);

		let closestEntity = Entity.nearestEntity(this, EnemyEntity);

		if (!closestEntity) return;

		await this.walkTo(closestEntity.position[0], closestEntity.position[1]);

	}

}