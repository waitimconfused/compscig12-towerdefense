import { Position2D } from "../../types.js";
import GameplayView from "../../view/elements/gameplay-view.js";
import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityEvent } from "../entity.js";

export class Strawberry extends DefenderEntity {
	/**the mental state the Strawberry spawns with */
	public readonly mentalState : number;

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

	constructor(position:Position2D) {
		super(position);
		
		let roll : number =  Number( Math.random().toFixed(2) );

		// Probability distribution:
		// Normal: 70%
		// Moderate: 20%
		// Psychotic: 10%
		let mentalStateDistribution = {
			"0.1": 3,
			"0.2": 2,
			"0.7": 1
		}

		let mentalStateProbabilities = Object.keys(mentalStateDistribution);

		let probabilitySum = 0;
		for (let i = 0; i < mentalStateProbabilities.length; i ++) {
			let chance = mentalStateProbabilities[i] as keyof typeof mentalStateDistribution;
			probabilitySum += Number(chance);

			if (roll > probabilitySum) continue;

			this.mentalState = mentalStateDistribution[chance] as number;

			break;

		}

	}

	protected onDeath(): void | Promise<void> {
		
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

		await this.wait(600, undefined, false);

		this.state = "walk";

		return await super.walkTo(x, y);
	}

	//Override walkTo to add the Strawberry animations
	public override async walkToEntity<EntityInstance extends Entity>(entity:EntityInstance, distance=50): Promise<undefined | EntityEvent> {
		
		if (this.position[0] == entity.position[0] && this.position[1] == entity.position[1]) return;

		this.state = "launch";

		await this.wait(600, undefined, false);

		this.state = "walk";

		return await super.walkToEntity(entity, distance);
	}

	public override async attackEntity(entity: Entity): Promise<undefined | EntityEvent> {
		// Returns if the entity is stunned
		if (this.stunned) {
			return;
		}

		// Begins attack animation
		this.state = 'attack';

		// Waits for 4 attack frames
		await this.wait(400);

		entity.dealDamage(this.stats.damage, this, "melee");

		// Plays last frame
		await this.wait(100);

		// Reset animation to idle
		this.state = 'idle';

	}

	public async brain() {

		let closestEntity = Entity.nearestEntity(this, EnemyEntity);

		if (!closestEntity || closestEntity.stats.health <=0) return;

		// Walk toward defender
		await this.walkToEntity(closestEntity);

		// Attacks closest entity
		await this.attackEntity(closestEntity);
	}
};