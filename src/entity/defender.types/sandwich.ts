import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Sandwich extends DefenderEntity {
	/** Label what the type of entity sandwich is - a Defender*/
	public entityType = "defender/sandwich";

	/**Sandwich base stats */
	public static override baseStats : DefenderEntityStats = {
		health: 40,
		speed: 0,
		damage: 0,
		knockBack: 3,
		entityPurchaseCost: 25,
		entityResaleCost: 12,
		attackCoolDown: 0,
		spawnCoolDown: 5000, 
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0, 
		regenerationDuration : 0,
		aoeRange : 0,
		upgradeEntityCost : 30
	};
	
	public async brain() {

		this.state = "idle";

		await this.wait(Infinity);

	}
};