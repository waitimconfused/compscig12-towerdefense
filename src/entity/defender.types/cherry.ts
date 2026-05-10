import { DefenderEntity } from "../defender.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats } from "../entity.js";

export class Cherry extends DefenderEntity {

	public entityType:string = "defender/cherry";

	public static override upgrades: EntityStats[] = [

	];

	public override movementTick(targetPosition: Position2D, deltaTime: number): void {
		super.movementTick(targetPosition, deltaTime);
	}

	//hide nearestEntity method from Entity, because Cherry needs to find the nearest Entity front and back of it
	//if Cherry has been upgraded
	public nearestEntity(origin:Entity, selector?:typeof Entity):{frontNearest:Entity|undefined, backNearest:Entity|undefined} {
		
		// Keep track of the nearest found entity (starts as undefined)
		let frontNearest:Entity|undefined = undefined;

		let backNearest:Entity|undefined = undefined;

		// Keep track of the distance to the closest entity (starts as `Infinity`)
		let frontNearestDistance = Infinity;

		let backNearestDistance = Infinity;
		// Loop through each Entity instance
		for (let i = 0; i < Entity.entities.length; i ++) {

			// Get the current entity
			let entity = Entity.entities[i] as Entity;

			// If a selector has been set, and the entity is
			// not an instance of it, move onto the next entity
			if (selector && entity instanceof selector == false) continue;

			// Get the distance between the origin entity and the current entity
			let distance = Math.hypot(
				entity.position[0] - origin.position[0],
				entity.position[1] - origin.position[1]
			);

			//check whether the entity's x and y values are more or less than the Cherry
			//if the x and y is greater, then the entity is behind the Cherry
			//if the x and y is less, then the entity is in front of the Cherry
			//after checking the entity's position, check if it's any closer than the last recorded enemy
			if (entity.position[0] < origin.position[0] && entity.position[1] < origin.position[1]){
				// If the distance is less than the past nearest distance,
				// Update the stored entity and the stored distance
				if (distance < frontNearestDistance) {
					frontNearest = entity;
					frontNearestDistance = distance;
				}
			}
			else{
				// If the distance is less than the past nearest distance,
				// Update the stored entity and the stored distance
				if (distance < backNearestDistance) {
					backNearest = entity;
					backNearestDistance = distance;
				}
			}	
		
		}

		// Return the nearest found entity, if one exists (`undefined`)
		return {frontNearest, backNearest};

	}


	public async brain() {

		await this.wait(1000);

		let closestEntity = Entity.nearestEntity(this, EnemyEntity);

		if (!closestEntity) return;

		await this.walkTo(closestEntity.position[0], closestEntity.position[1]);

	}

	//old stuff
		// /**
		//  * check to see if the cherry was able to stun enemy
		//  * @param target the enemy
		//  * @returns returns whether the cherry was able to stun the enemy (true or false)
		//  */
		// private attemptStun(target : EnemyEntity) : boolean {
		// 	//roll to see if the Cherry stuns the enemy
		// 	//roll a number between 1-100
		// 	let rollForStun =  Math.floor(Math.random()*(100 - 1 + 1) + 1);
			
		// 	//if the cherry rolls a number less than or equal to 25, they have stunned the enemy
		// 	if (rollForStun<= this.stunChance){
		// 		target.stun(this.stunDuration)
		// 		//when stunned, return that the cherry was able to stun the enemy
		// 		return true;
		// 	}

		// 	//otherwise, return that it was not able to
		// 	return false;
		// }

		// /**
		//  * cherry attacks enemy
		//  * @param target the enemy
		//  * @returns if there is no target or there is some modifier/cooldown that prevents them from hitting, do not attack
		//  */
		// public attackEnemy(target : EnemyEntity) : void{
		// 	//if there is no target or there is some modifier/cooldown that prevents them from hitting, do not attack
		// 	if (!target || this.canHit == false) {
		// 		return;
		// 	}
		// 	//otherwise, the cherry will do damage to the enemy based off of their current stats
		// 	else{
		// 		target.takeDamage(this.defenderBaseStats.defenderAttackDamage)
		// 		//check to see if the cherry was able to stun enemy
		// 		this.attemptStun(target);
		// 	}
		// }

		// /**
		//  * check to see if the cherry is at the max upgrade 
		//  * if it is, it can now hit enemies from the front and behind
		//  * @returns returns the boolean value of whether the cherry can now attack front and back
		//  */
		// public cherryMaxUpgrade () : boolean {
		// 	//if the cherry is at lvl 3, it is at max lvl and can use its new ability
		// 	if (this.defenderBaseStats.defenderLvl == 3){
		// 		this.canAttackFrontBack = true;
		// 	}
		// 	//otherwise, stay doing the same of only attacking enemies in front of them
		// 	else{
		// 		this.canAttackFrontBack = false;
		// 	}

		// 	return this.canAttackFrontBack;
		// }

		// /**
		//  * when the cherry kills an enemy, it will find the next enemy
		//  * @param target the enemy
		//  */
		// public killedEnemy(target: EnemyEntity) : void{
		// 	target.getClosestEntity();
		// }

		// public tick(): void {
		// 	// Put "brain" related stuff here
		// }
		// }

}