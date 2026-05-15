import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Sandwich extends DefenderEntity {
	/**
	 * The ability for Sandwich to get a significant amount of HP and knockback
	 * This is available to use when at level 3 and up
	 */
	private bigSandwich : boolean = false;

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
			spawnCoolDown: 5, 
			stunChance : 0,
			stunDuration : 0,
			slowDuration : 0, 
			regenerationDuration : 0,
			aoeRange : 0,
			upgradeEntityCost : 30
		};
	
	//Call method that unlocks Sandwich's skill
	//UnlockSkill(bigSandwich);

	public async brain() {

		await this.wait(500);

	}
};