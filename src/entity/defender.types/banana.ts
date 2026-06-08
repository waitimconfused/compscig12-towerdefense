import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";

export class BananaSpawner extends DefenderEntity {
	/**the readonly name of the entity Banana - to prevent spelling mistakes*/
	public static readonly DEFENDER_NAME = "BANANA";
	/**
	 * The ability for Banana to attack twice (roll over the field twice)
	 * 	This is available to use when at level 3 and up
	 */
	protected canRollTwice : boolean = false;

	/** Label what the type of entity the banana spawner is - a part of Defender*/
	public override entityType : string = "defender/banana_spawner";
	
	/** Banana's base stats (will be given to the Banana once it spawns from the BananaSpawner)*/
	public static override baseStats : DefenderEntityStats = {
		health: 30,
		speed: 0.1,
		damage: 10,
		knockBack: 10,
		spawnCoolDown: 10000,
		attackCoolDown: 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 5000,
		regenerationDuration : 0,
		aoeRange : 20,
		upgradeEntityCost : 35,
		entityPurchaseCost: 30,
		entityResaleCost: 15
	}

	/** This method needs to exist, but will not have anything in it because the Kernel's death is done in the brain*/
	protected override onDeath(): void {}

	/**The brain spawns the Banana onto the field*/
	public override async brain() {
		await this.wait(1000);

		console.log("Spawning Banana");

		Banana.spawn(1, this.position);
		
	}
}

export class Banana extends BananaSpawner {
	/**Label what the type of entity banana is - a defender*/
	public override entityType: string = "defender/banana_entity";

	/**
	 * The brain checks for events that happen around and to the BananaPeel
	 * As of now it moves across the screen vertically, dies and calls the BananaPeel
	 */
	public override async brain() {

		//TODO: Replace "Y" value to be MAX-Y-VALUE
		let interrupt = await this.walkTo( this.position[0], window.innerHeight );

		if (interrupt) return;

		this.stats.health = 0;

		//when the Banana dies, it leaves its banana peel (create a BananaPeel)
		new BananaPeel(this.position);

	}

}

export class BananaPeel extends Banana{
	/**Label what the type of entity the banana peel is - a part of Defender*/
	public override entityType: string = "defender/banana_peel";

	//This method needs to exist, but will not have anything in it because the Kernel's death is done in the brain
	protected override onDeath(): void {}

	//Slow enemies that come in range of the BananaPeel
	public slowEnemies() : void{
		//Get the range of entities around the BananaPeel
		let slowInRange = Entity.totalEntitiesInRange(this,20, EnemyEntity);

		//Go through the array and slow the enemies in range
		for (let i = 0; i < slowInRange.length; i++){
			StatusEffects.slowEntity(slowInRange[i] as Entity, this.stats.slowDuration as number);
		}
	}

	/**
	 * The brain checks for events that happen around and to the BananaPeel
	 * As of now it is used to slow enemies that come in range of it
	 */
	public override async brain(): Promise<void> {
		this.slowEnemies();
	}
}