import { MouseManager } from "../../mouse.js";
import { DefenderEntity } from "../defender.js";
import { EntityEvent, EntityStats } from "../entity.js";

export class Strawberry extends DefenderEntity {

	public entityType = "defender/strawberry";

	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 100, speed: 0, damage: 10 },
		{ health: 0, max_health: 120, speed: 0, damage: 20 }
	];

	public override async walkTo(x: number, y: number): Promise<undefined | EntityEvent> {
		
		if (this.position[0] == x && this.position[1] == y) return;

		this.state = "launch";
		this.animationOffset = performance.now();

		await this.wait(500);

		this.state = "walk";

		return await super.walkTo(x, y);
	}

	public async brain() {

		await this.walkTo( MouseManager.x, MouseManager.y );

	}
};