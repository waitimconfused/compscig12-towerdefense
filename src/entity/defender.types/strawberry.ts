import { MouseManager } from "../../mouse.js";
import { Position2D } from "../../types.js";
import { DefenderEntity } from "../defender.js";
import { EntityEvent, EntityStats } from "../entity.js";

export class Strawberry extends DefenderEntity {

	public entityType = "defender/strawberry";

	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 100, speed: 0.4, damage: 10 },
		{ health: 0, max_health: 120, speed: 0.4, damage: 20 }
	];

	public override async walkTo(x: number, y: number): Promise<undefined | EntityEvent> {
		
		if (this.position[0] == x && this.position[1] == y) return;

		this.state = "launch";
		this.animationOffset = performance.now();

		await this.wait(600);

		this.state = "walk";

		return await super.walkTo(x, y);
	}

	public async brain() {

		let random:Position2D = [
			Math.random() * window.innerWidth,
			Math.random() * window.innerHeight
		];

		await this.walkTo( random[0], random[1] );
		await this.wait( Math.random() * 100 + 400 );

	}
};