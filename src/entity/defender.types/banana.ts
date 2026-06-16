import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityEvent } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Position2D } from "../../types.js";
import GameplayView from "../../view/elements/gameplay-view.js";

export class BananaSpawner extends DefenderEntity {
	/** Label what the type of entity the banana spawner is - a part of Defender*/
	public override entityType : string = "defender/banana_spawner";
	
	/** Banana's base stats (will be given to the Banana once it spawns from the BananaSpawner)*/
	public static override baseStats : DefenderEntityStats = {
		health: 30,
		speed: 0.1,
		damage: 10,
		knockBack: 10,
		spawnCoolDown: 3_000,
		attackCoolDown: 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 5_000,
		regenerationDuration : 0,
		aoeRange : 293/2,
		upgradeEntityCost : 35,
		entityPurchaseCost: 30,
		entityResaleCost: 15
	}

	/** This method needs to exist, but will not have anything in it because the Kernel's death is done in the brain*/
	protected override onDeath(): void {}

	/**The brain spawns the Banana onto the field*/
	public override async brain() {
		await this.wait(this.stats.spawnCoolDown);

		console.log("Spawning Banana");

		Banana.spawn(1, this.position);
		
	}
}

export class Banana extends BananaSpawner {
	/**Label what the type of entity banana is - a defender*/
	public override entityType: string = "defender/banana_entity";

	public static override showInInventory:boolean = false;

	public async rollOverEnemy() : Promise<undefined |EntityEvent> {
		//Return if the defender is stunned
		if (this.stunned) return;

		//wait for the banana to peel first

		//Attack entities in the way of Banana
		let entitiesNearBanana = Entity.totalEntitiesInRange(this,this.stats.aoeRange, EnemyEntity);

		//If there are no enemies around, don't run the damage
		if (entitiesNearBanana.length == 0) return;
		//Deal damage - loop through the entire array of entitiesNearBanana and do damage
		
		for (let i = 0; i < entitiesNearBanana.length; i++){
			let entity = entitiesNearBanana[i] as EnemyEntity;
			entity.dealDamage(this.stats.damage,entitiesNearBanana[i] as Entity);
		}

		//can't use resolve? not sure why
	}

	/**
	 * The brain checks for events that happen around and to the BananaPeel
	 * As of now it moves across the screen vertically, dies and calls the BananaPeel
	 */
	public override async brain() {

		let downInterrupt = await this.walkTo(
			this.position[0],
			GameplayView.playSpaceSize[1],

			() => {
				// Attack enemies near it
				this.rollOverEnemy();
			}
		);

		if (downInterrupt) return;

		if (Banana.canUseSkill) {

			let upInterrupt = await this.walkTo(
				this.position[0],
				0,
	
				() => {
					// Attack enemies near it
					this.rollOverEnemy();
				}
			);

			if (upInterrupt) return;

		}

		
		// When the Banana dies, it leaves its banana peel (create a BananaPeel)
		new BananaPeel(this.position);

		this.state = "die";
		this.stats.health = 0;
	}
}

export class BananaPeel extends Banana{
	/**Label what the type of entity the banana peel is - a part of Defender*/
	public override entityType: string = "defender/banana_peel";

	//Slow enemies that come in range of the BananaPeel
	public slowEnemies() : void{
		//Get the range of entities around the BananaPeel
		let slowInRange = Entity.totalEntitiesInRange(this,this.stats.aoeRange, EnemyEntity);

		//Go through the array and slow the enemies in range
		for (let i = 0; i < slowInRange.length; i++){
			StatusEffects.slowEntity(slowInRange[i] as Entity, this.stats.slowDuration);
		}
	}

	/**
	 * The brain checks for events that happen around and to the BananaPeel
	 * As of now it is used to slow enemies that come in range of it
	 */
	public override async brain(): Promise<void> {
		this.state = "banana remains";

		this.slowEnemies();
	}
}