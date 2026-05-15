import { Position2D } from "../../types.js";
import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EntityEvent } from "../entity.js";

export class Strawberry extends DefenderEntity {
	/**the readonly name of the entity Strawberry - to prevent spelling mistakes*/
	public static readonly DEFENDER_NAME = "Strawberry";
	/**
	 * The increased chance for Strawberry to be psychotic
	 * 	This is available to use when at level 3 and up
	 */
	private static getsCrazier : boolean = false;

	/**the mental state the Strawberry spawns with */
	public mentalState : number;

	//Chance of the mental state of strawberry being psychotic
	//When upgraded, this state will appear more frequently
	//Normal and moderate state will decrease in appearance at the same rate
	private static psychoticStateProb : number = 100/3;

	/**Label the kind of entity strawberry is - a defender */
	public entityType = "defender/strawberry";

	/**base stats of Strawberry */
	public static override baseStats: DefenderEntityStats = {
		health: 20,
		speed: 0.4,
		damage: 10,
		knockBack: 10,
		spawnCoolDown : 3,
		attackCoolDown : 3,
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

		//Check if the Strawberry has been upgraded to lvl 3 
		//if so, keep a record that they have unlocked it
		if (Strawberry.level == 3){
			this.unlockSkill(Strawberry.getsCrazier);
		}
		//If the chance of the strawberry being psychotic is not 100% - 
		//Keep on increasing the chance by the current probability divided by 3
		if (Strawberry.psychoticStateProb != 100 && Strawberry.level >= 3){
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

	public async brain() {
		this.rollForMentalState();

		let random:Position2D = [
			Math.random() * window.innerWidth,
			Math.random() * window.innerHeight
		];

		await this.walkTo( random[0], random[1] );
		await this.wait( Math.random() * 100 + 400 );

	}
};