import { Position2D } from "../../types.js";
import GameplayView from "../../view/elements/gameplay-view.js";
import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityEvent } from "../entity.js";

export class Strawberry extends DefenderEntity {
	/**the mental state the Strawberry spawns with */
	public mentalState : number;

	//Chance of the mental state of strawberry being psychotic
	//When upgraded, this state will appear more frequently
	//Normal and moderate state will decrease in appearance at the same rate
	private static psychoticStateProb : number = 100/3;

	/**Label the kind of entity strawberry is - a defender */
	public entityType = "defender/strawberry";

	/**Base stats of Strawberry */
	public static override baseStats: DefenderEntityStats = {
		health: 20,
		speed: 0.4,
		damage: 10,
		knockBack: 10,
		spawnCoolDown : 3000,
		attackCoolDown : 3000,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
		upgradeEntityCost : 15,
		entityPurchaseCost: 10,
		entityResaleCost: 10,
	}

	/** The mental state of the strawberry comes in 3 levels*/
	private rollForMentalState() : void{
		let roll : number =  Math.floor(Math.random()*(100 - 1 + 1) + 1);

		//(Mental state will be a number for now)
		//Depending on the number, it will correspond to which level of psycho it will be
		//1 = normal, 2 = moderate, 3 = psychotic
		if (roll < Strawberry.psychoticStateProb){
			//If the strawberry rolls a number that is greater than the chance of being psychotic - roll again
			//Roll to see if it is moderate or normal
			let secondRoll : number = Math.floor(Math.random()*(100 - 1 + 1) + 1);
	
			if (secondRoll > 50){
				this.mentalState = 1;
			}
			else{
				this.mentalState = 2;
			}
		}
		else{
			this.mentalState = 3;
		}
	}

	/** Override reload Stats to include rolling for the mental state of the Strawberry
	 * When the Strawberry is being upgraded and it's at level 3 or higher, 
	 * the chance for the Strawberry to spawn psychotic increases 
	 */
	public override reloadStats(): void {
		super.reloadStats();

		//If the chance of the strawberry being psychotic is not 100% - 
		//Keep on increasing the chance by the current probability divided by 3
		if (Strawberry.psychoticStateProb != 100 && Strawberry.canUseSkill == true){
			Strawberry.psychoticStateProb += Strawberry.psychoticStateProb/3;	
			//Check if the chance is over 100
			//If it is - make it 100
			if (Strawberry.psychoticStateProb > 100){
				Strawberry.psychoticStateProb = 100;
			}
		}
	}

	//Override walkTo to add the Strawberry animations
	public override async walkTo(x: number, y: number): Promise<undefined | EntityEvent> {
		
		if (this.position[0] == x && this.position[1] == y) return;

		this.state = "launch";

		await this.wait(600);

		this.state = "walk";

		return await super.walkTo(x, y);
	}

	public override async attackEntity(entity: Entity): Promise<undefined | EntityEvent> {
		// Returns if the entity is stunned
		if (this.stunned) {
			return;
		}

		// Begins attack animation
		this.state = 'attack';

		// Waits for 4 attack frames
		let interrupt = await this.wait(400);

		// Stops attack animation when interrupted
		if (interrupt) {
			this.state = 'idle';
			return;
		}

		// Plays last frame
		await this.wait(100);

		// Reset animation to idle
		this.state = 'idle';

	}

	public async brain() {
		this.rollForMentalState();

		let closestEntity = Entity.nearestEntity(this, EnemyEntity);

		if (!closestEntity || closestEntity.stats.health <=0) {
			return;
		}
		// Walk toward defender
		let interrupt = await this.walkToEntity(closestEntity);

			// Attack if nothing was interrupted
			if (!interrupt) {
				// Store defender health
				let defenderHealth = closestEntity.stats.health;

				if (this.position[0] == closestEntity.position[0] && this.position[1] == closestEntity.position[1]) {
					if (!(closestEntity.stats.health <= 0)) {
						// Attacks closest entity
						await this.attackEntity(closestEntity);
			
					}
				}
			}	

		}
};