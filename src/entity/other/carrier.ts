import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Carrier extends DefenderEntity {

	public override entityType = "entity/carrier";

	public static override baseStats: DefenderEntityStats = {
		health: 100,
		speed: 0,
		damage: 0,
		knockBack: 0,
		spawnCoolDown: 0,
		attackCoolDown: 0,
		stunChance: 0,
		stunDuration: 0,
		slowDuration: 0,
		regenerationDuration: 0,
		aoeRange: 0,
		entityPurchaseCost: 100,
		upgradeEntityCost: 100,
		entityResaleCost: 123
	};

	override onDeath(): void {
	}

	public async brain(){
		
	}
}