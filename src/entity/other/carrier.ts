import { Entity, EntityStats } from "../entity.js";

export class Carrier extends Entity {

	public override entityType = "entity/carrier";

	public static override baseStats: EntityStats = {
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
		aoeRange: undefined
	};

	onDeath(): void {
		//game over
	}

	public async brain(){
		
	}
}