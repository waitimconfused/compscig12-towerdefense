import { DefenderEntity, DefenderEntityStats } from "../defender.js";

export class Carrier extends DefenderEntity {

	public override entityType = "entity/carrier";

	public static override baseStats: DefenderEntityStats = {
		health: 100,
		speed: 0,
		damage: 0,
		knockBack: 0,
		spawnCoolDown: undefined,
		attackCoolDown: undefined,
		stunChance: undefined,
		stunDuration: undefined,
		slowDuration: undefined,
		regenerationDuration: undefined,
		aoeRange: undefined,
		entityPurchaseCost: 100,
		upgradeEntityCost: 100,
		entityResaleCost: 123
	};

	override onDeath(): void {
	}

	public async brain(){
		
	}
}