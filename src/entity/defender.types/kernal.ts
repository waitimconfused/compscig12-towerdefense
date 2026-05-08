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

	//WIP when the kernal dies
	protected override die(){

	}

	/**
	 * /**
	 * the brain checks for events that happen around and to the Kernal
	 * as of now it is used to check for enemies nearby
	 */
	public override async brain(): Promise<void> {
		//get the kernalto keep on travelling to the target/enemy's position
		await this.walkTo(this.target.position[0], this.target.position[1]);
		//when it has, attack the target
		this.attackEntity(this.target);
		//when the enemy has been attacked, set the kernal's health to 0, disappearing from the playing field
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