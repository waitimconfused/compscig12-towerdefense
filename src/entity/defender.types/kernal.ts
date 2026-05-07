import { Corn } from "../../defender.types/corn.js";

class Kernal extends Corn{
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