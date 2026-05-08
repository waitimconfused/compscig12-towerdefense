import { DefenderEntity } from "../defender.js";
import { EntityStats } from "../entity.js";

export class Sandwich extends DefenderEntity {

	public entityType = "defender/sandwich";

	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 100, speed: 0, damage: 10 },
		{ health: 0, max_health: 120, speed: 0, damage: 20 }
	];


	public async brain() {

		await this.wait(500);

	}
};