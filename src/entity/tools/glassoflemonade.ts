import { InventoryItemTag } from "../../inventory.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats} from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Tool } from "./tool.js";

export class GlassOfLemonade extends Tool{
	//Entity type is the tool glass of lemonade
	public override entityType = "tool/glassoflemonade";

	//Requirements for glass of lemonade
	public override toolRequirements : Map<InventoryItemTag, number>;

	/**Base stats of Glass of Lemonade */
	public static override baseStats: EntityStats = {
		health: 20,
		speed: 0,
		damage: 0,
		knockBack: 0,
		spawnCoolDown : 0,
		attackCoolDown : 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
	}

	//Requirements for making glass of lemonade
	constructor(position : Position2D){
		super(position);
		this.toolRequirements = new Map <InventoryItemTag, number>();
		this.toolRequirements.set('jar', 1);
		this.toolRequirements.set('coin', 50);
	}

	protected onDeath(): void {}

	public async brain(){
		this.state = "use";
		//Wait for 6 frames
		await this.wait(600);
		//Spawn in the ice cubes
		//The animation should flow between the glass falling and the ice cubes spawning droppig onto the ground
		new IceCube(this.position);

		this.state = "used";
	}
}

//When the lemonade glass falls the ice cube remains/spawns
export class IceCube extends GlassOfLemonade {
	//Entity type is tool ice cube
	public override entityType = "tool/ice-cube";

	//The sprite number they are currently on
	private iceCubeStateNumber : number = 0;

	// The age of the ice cube
	private age: number = 0;

	public override async brain(){

		this.age += 1;

		if (this.age >= 100) this.iceCubeStateNumber += 1;
		this.age %= 100;

		if (this.iceCubeStateNumber == 4){
			//Once iceCubeMelting reaches 0, the ice cube has evaporated, and dies
			this.stats.health = 0;
		}
		
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
	}
}