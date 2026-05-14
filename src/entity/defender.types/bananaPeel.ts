import { Entity, EntityEvent, EntityEventType, EntityStats } from "../entity.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Banana } from "./banana.js";
import { StatusEffects } from "../statusEffects.js";

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