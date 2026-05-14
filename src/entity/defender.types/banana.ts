import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";

export class BananaSpawner extends DefenderEntity {
	protected canRollTwice : boolean = false;

	public override entityType : string = "defender/banana_spawner";
	
	public static override baseStats : DefenderEntityStats = {
		health: 30,
		speed: 0.1,
		damage: 10,
		knockBack: 10,
		spawnCoolDown: 10,
		attackCoolDown: 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 5000,
		regenDuration : 0,
		aoeRange : 20,
		upgradeEntityCost : 35,
		entityPurchaseCost: 30,
		entityResaleCost: 15
	};

	protected override die(): void {}

	public override async brain() {

		await this.wait(1000);
		console.log("Spawning Banana");
		Banana.spawn(1, this.position);
		
	}
}

export class Banana extends BananaSpawner {
	
	public override entityType: string = "defender/banana_entity";

	public override async brain() {

		//TODO: Replace "Y" value to be MAX-Y-VALUE
		let interrupt = await this.walkTo( this.position[0], window.innerHeight );

		if (interrupt) return;

		this.stats.health = 0;

		new BananaPeel(this.position);

	}

}

export class BananaPeel extends Banana{
	public override entityType: string = "defender/banana_peel";

	protected override die(): void {};

	public slowEnemies() : void{
		let slowInRange = Entity.totalEntitiesInRange(this,20, EnemyEntity);

		for (let i = 0; i<slowInRange.length;i++){
			StatusEffects.slowEntity(slowInRange[i] as Entity, this.stats.slowDuration as number);
		}
	}

	public override async brain(): Promise<void> {
		this.slowEnemies();
	}
}