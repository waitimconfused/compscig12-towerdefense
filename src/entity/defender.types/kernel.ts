import { Corn } from "./corn.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { DefenderEntityStats } from "../defender.js";

//the kernel is created via the Corn, and is a child of the corn
export class Kernel extends Corn{
	//store who the target is
	private target : EnemyEntity;
	
	//label the kind of entity corn is - a defender
	public override entityType = "defender/Kernel";

	static override upgrades: DefenderEntityStats[] = [];

	//use the corn's position and store the tracked target into the kernel's target property
	constructor(position: Position2D, target: EnemyEntity){
		super(position);
		this.target = target;

	}

	//this method needs to exist, but will not have anything in it because the Kernel's death is done in the brain
	protected override die(){}

	/**
	 * /**
	 * the brain checks for events that happen around and to the Kernel
	 * as of now it is used to check for enemies nearby
	 */
	public override async brain(): Promise<void> {
		//get the Kernel to keep on traveling to the target/enemy's position
		await this.walkTo(this.target.position[0], this.target.position[1]);
		//when it has, attack the target
		this.attackEntity(this.target);
		//when the enemy has been attacked, set the Kernel's health to 0, disappearing from the playing field
		this.stats.health = 0;

	}


	//old code
	// //the corn will be the entity related to Corn that does the actual damage to the enemies
	// public override attackEnemy(target : EnemyEntity): void {
	// 	//get the targeted entity's x and y position and save it to local variables
	// 	let targetedEntityXPosition = this.walkingTo[0];
	// 	let targetedEntityYPosition = this.walkingTo[1];
	// 	//wait 5 seconds before proceeding
	// 	wait(5000);
	// 	//walk to the position given the constructors from corn, and get the enemy to take damage
	// 	this.walkToPosition(targetedEntityXPosition,targetedEntityYPosition);
	// 	target.takeDamage(this.defenderBaseStats.defenderAttackDamage)
	// }
}