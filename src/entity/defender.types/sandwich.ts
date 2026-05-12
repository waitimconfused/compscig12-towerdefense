import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Sandwich extends DefenderEntity {

	public entityType = "defender/sandwich";

	public static override upgrades: DefenderEntityStats[] = [
		{
			health: 100,
			max_health: 100,
			speed: 0,
			damage: 10,
			knockBack: 10,
			entityPurchaseCost: 10,
			entityResaleCost: 10,
			attackCoolDown: undefined,
			spawnCoolDown: undefined
		}
	];


	public async brain() {

		await this.wait(500);

	}
};