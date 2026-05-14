import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Sandwich extends DefenderEntity {
	//when upgraded, the sandwich defenders become BIG
	private bigSandwich : boolean = false;

	//label what the type of entity this is - sandwich Defender
	public entityType = "defender/sandwich";

	public static override upgrades: DefenderEntityStats[] = [
		{
			health: 40,
			speed: 0,
			damage: 10,
			knockBack: 10,
			entityPurchaseCost: 15,
			entityResaleCost: 7,
			attackCoolDown: 0,
			spawnCoolDown: 5, 
			stunChance : undefined,
			stunDuration : undefined,
			slowDuration : undefined, 
			regenerationDuration : undefined,
			aoeRange : undefined,
			upgradeEntityCost : 25
		}
	];
	
	//call method that unlocks Sandwich's skill
	//unlockSkill(bigSandwich);

	public async brain() {

		await this.wait(500);

	}
};