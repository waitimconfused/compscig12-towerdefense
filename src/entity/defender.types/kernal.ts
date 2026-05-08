import { Corn } from "./corn.js";
import { Entity, EntityEvent, EntityEventType, EntityStats } from "../entity.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";

//the kernal is created via the Corn, and is a child of the corn
export class Kernal extends Corn{
	//store who the target is
	private target : EnemyEntity;
	
	//label the kind of entity corn is - a defender
	public override entityType = "defender/kernal";

	//use the corn's position and store the tracked target into the kerna's target property
	constructor(position: Position2D, target: EnemyEntity){
		super(position);
		this.target = target;

	}

	protected override die(){

	}

	public override async brain(): Promise<void> {
		await this.walkTo(this.target.position[0], this.target.position[1]);
		this.attackEntity(this.target);
		this.stats.health = 0;

	}


	//old code
	// //the corn will be the entity related to Corn that does the actual damage to the enemies
	// public override attackEnemy(target : EnemyEntity): void {
	// 	//get the targeted entity's x and y position and save it to local variables
	// 	let targettedEntityXPosition = this.walkingTo[0];
	// 	let targettedEntityYPosition = this.walkingTo[1];
	// 	//wait 5 seconds before proceeding
	// 	wait(5000);
	// 	//walk to the position given the constructers from corn, and get the enemy to take damge
	// 	this.walkToPosition(targettedEntityXPosition,targettedEntityYPosition);
	// 	target.takeDamage(this.defenderBaseStats.defenderAttackDamage)
	// }
}