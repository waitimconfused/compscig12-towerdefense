import Inventory, { InventoryItemTag } from "../../inventory.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats, EntityTimerTicker } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Tool } from "./tool.js";

export class GlassOfLemonade extends Tool{
	//entity type is the tool glass of lemonade
	public override entityType = "tool/glassoflemonade";
	//constant for tool name - to be used when creating tool and not make spelling errors
	public override TOOL_NAME: string = "GLASS_OF_LEMONADE";

	//a linear array is used for tool requirements so that the requirements can be searched through and analysed 
	//when assessing of the player has sufficient items to create it

	//requirements for making glass of lemonade
	public override toolRequirements : Array<InventoryItemTag> = ['jar','coin'];
	//the total amount of each item for the lemonade
	public override toolRequirementsValue : Array<number> = [1,50];
	
	/**base stats of Glass of Lemonade */
	public static override baseStats: EntityStats = {
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
	}

	protected onDeath(){
		
	}


	public async brain(){
		//wait for 6 frames
		await this.wait(600);
		//spawn in the ice cubes
		//the animation should flow between the glass falling and the ice cubes spawning droppig onto the ground
		new IceCube(this.position);
	}
}

//when the lemonade glass falls the ice cube remains/spawns
export class IceCube extends GlassOfLemonade {
	//entity type is tool ice cube
	public override entityType = "tool/ice-cube";

	//duration the ice cube states at their current state
	private iceCubeMelting : number = 5000;

	//the sprite number they are currently on
	private iceCubeStateNumber : number = 4;

	public override async brain(){
		//See if there are any enemies that are touching the ice cube
		let entitiesNearIceCube = Entity.totalEntitiesInRange(this,this.stats.aoeRange as number, EnemyEntity);

		//If there is at least one, stun and slow them
		if (entitiesNearIceCube.length >= 1){
			for (let i = 0;i<entitiesNearIceCube.length;i++){
				StatusEffects.stunEntity(entitiesNearIceCube[i] as Entity,4);
				StatusEffects.slowEntity(entitiesNearIceCube[i] as Entity, 8);
			}
		}
		//Otherwise, don't search through the variable "entitiesNearIceCube"
		else{
			return;
		}

		//change the state of the ice cube as time goes on to show it is melting
		while (this.iceCubeMelting != 0){
			//change the state based off of their current state number
			this.state = String('ice-cube' + (this.iceCubeStateNumber-1));
			//wait for as long as the current duration
			await this.wait(this.iceCubeMelting);

			//update the upcoming state number and melting duration
			this.iceCubeStateNumber --;
			this.iceCubeMelting -= 1000;
		}

		//once iceCubeMelting reaches 0, the ice cube has evaporated, and dies
		this.stats.health = 0;
	}
}