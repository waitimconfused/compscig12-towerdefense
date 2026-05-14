import { Corn } from "./corn.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { DefenderEntityStats } from "../defender.js";
import { Entity } from "../entity.js";

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

	public override attackEntity(entity:Entity):Promise<undefined|EntityEvent> {
		return new Promise ((resolve) =>{
			if (this.stunned) {
				resolve({ interrupt_type: "stunned" });
			}
			//attack enemy entity
			entity.dealDamage(this.stats.damage as number, this);

			//if corn's skill is unlocked, kernals can do area of effect damage (enemies around it will also get hurt)
			if (this.kernalAOE == true){
				//deal damage around area
				//deals 1/3 of its damage to the entities around it
				//store an object array of the entities in range of the kernal's attack 
				//use the Entity method totalEntitiesInRange
				let entitiesNearKernal = Entity.totalEntitiesInRange(this,this.stats.aoeRange as number, EnemyEntity);

				//if there are no enemies around, don't even run the rest
				if (entitiesNearKernal.length == 0){
					resolve(undefined);
				}

				//dealDamage - loop through the entire array of entitiesNearKernal and do 1/3 of the corn's damage
				let blastDamage = this.stats.damage as number/3;

				for (let i = 0;i<entitiesNearKernal.length;i++){
					(entitiesNearKernal[i] as Entity).dealDamage(blastDamage,entitiesNearKernal[i] as Entity) ;
				}
			}

			//resolve the promise, without providing a reason
			resolve(undefined);
		});
	}

	/**
	 * the brain checks for events that happen around and to the Kernal
	 * as of now it is used to check for enemies nearby
	 */
	public override async brain(): Promise<void> {
		//get the Kernel to keep on traveling to the target/enemy's position
		await this.walkTo(this.target.position[0], this.target.position[1]);

		//when it has, attack the target
		this.attackEntity(this.target);

		//when the enemy has been attacked, set the kernal's health to 0, disappearing from the playing field
		this.stats.health = 0;
	}
}