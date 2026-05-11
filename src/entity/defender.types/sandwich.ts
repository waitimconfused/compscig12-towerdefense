import { DefenderEntity } from "../defender.js";
import { EntityStats } from "../entity.js";

export class Sandwich extends DefenderEntity {
	//when upgraded, the sandwich defenders become BIG
	private bigSandwich : boolean  = false;

	//label what the type of entity this is - sandwich Defender
	public entityType = "defender/sandwich";

	//sandwich base level
	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 40,
			knockback:3, spawnCooldown: 3, entityPurchaseCost:15, 
			entityResaleCost:7, upgradeEntityCost:35 },
	];

	/**
	 * the brain checks for events that happen around and to the Kernal
	 * as of now it is used to check for enemies nearby
	 */
	public async brain() {

		await this.wait(500);

	}
};