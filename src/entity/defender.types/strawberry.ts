import { MouseManager } from "../../mouse.js";
import { Position2D } from "../../types.js";
import { DefenderEntity } from "../defender.js";
import { EntityEvent, EntityStats } from "../entity.js";

export class Strawberry extends DefenderEntity {
	private mentalState : number;

	//when strawberry is upgraded, the chance for it to be psychotic will increase
	private static getsCrazier : boolean = false;

	//chance of the mental state of strawberry being psychotic
	//when upgraded, this state will appear more frequently
	//normal and moderate state will decrease in appearance at the same rate
	private static psychoticStateProb : number = 100/3;

	public entityType = "defender/strawberry";

	public static override upgrades: EntityStats[] = [
		{ health: 0, max_health: 20, speed: 2, baseSpeed : 2, damage: 6, 
			knockback:2, spawnCooldown: 3, attackCooldown: 3, entityPurchaseCost:10, 
			entityResaleCost:5, upgradeEntityCost:15 }
	];

	//the mental state of the strawberry comes in 3 levels
	private rollForMentalState() : void{
		let roll : number =  Math.floor(Math.random()*(100 - 1 + 1) + 1);

		//mental state will be a number for now
		//depending on the number, it will correspond to which level of psycho it will be
		//1 = normal, 2 = moderate, 3 = psychotic
		if (roll < Strawberry.psychoticStateProb){
			//if the strawberry rolls a number that is greater than the chance of being psychotic - roll again
			//roll to see if it is moderate or normal
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

	public override reloadStats(): void {
		super.reloadStats();
		//if the chance of the strawberry being pyschotic is not 100% - 
		// keep on increasing the chance by the current probability divided by 3
		if (Strawberry.psychoticStateProb != 100){
			Strawberry.psychoticStateProb += Strawberry.psychoticStateProb/3;	
			//check if the chance is over 100
			//if it is - make it 100
			if (Strawberry.psychoticStateProb > 100){
				Strawberry.psychoticStateProb = 100;
			}
		}
	}

	//call method that unlocks Strawberry's skill
	//unlockSkill(getsCrazier);

	public override async walkTo(x: number, y: number): Promise<undefined | EntityEvent> {
		
		if (this.position[0] == x && this.position[1] == y) return;

		this.state = "launch";

		await this.wait(600);

		this.state = "walk";

		return await super.walkTo(x, y);
	}

	public async brain() {

		let random:Position2D = [
			Math.random() * window.innerWidth,
			Math.random() * window.innerHeight
		];

		await this.walkTo( random[0], random[1] );
		await this.wait( Math.random() * 100 + 400 );

	}
};