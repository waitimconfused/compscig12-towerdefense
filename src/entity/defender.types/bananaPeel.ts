import { Entity, EntityEvent, EntityEventType, EntityStats } from "../entity.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Banana } from "./banana.js";

export class BananaPeel extends Banana{
	public override entityType: string = "defender/banana_peel";

	protected override die(): void {}
}