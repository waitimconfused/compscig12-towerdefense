import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Sandwich extends DefenderEntity {
	//when upgraded, the sandwich defenders become BIG
	private bigSandwich : boolean = false;

	//label what the type of entity this is - sandwich Defender
	public entityType = "defender/sandwich";

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
	
	//call method that unlocks Sandwich's skill
	//unlockSkill(bigSandwich);

	public async brain() {

		await this.wait(500);

	}
};