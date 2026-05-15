import { Entity, EntityEvent } from "../entity.js";
import { EnemyEntity } from "../enemy.js";
import { DefenderEntityStats } from "../defender.js";
import { Position2D } from "../../types.js";

/**
 * create the class Corn that extends from Entity
 */
export class Corn extends Entity{
	public static readonly DEFENDER_NAME = "Corn";

	protected kernelAOE : boolean = false;

	/**Label the kind of entity corn is - a defender */
	public override entityType = "defender/corn";

	/**
	 * The corn's lvl 1 stats
	 * Through the DefenderEntity class, it will be able to level up, with reference to its base stats
	 */
	public static override baseStats: DefenderEntityStats = {
		health: 25,
		speed: 3,
		damage: 15, 
		knockBack: 3,
		spawnCoolDown: 7,
		attackCoolDown: 5,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 10,
		upgradeEntityCost : 40,
		entityPurchaseCost: 35,
		entityResaleCost: 17
	};

	/**
	 * WIP when the corn dies
	 */
	protected override die(): void {
		
	}

	//call method to unlock corn's skill
	//unlockSkill(kernelAOE);

	/**
	 * the brain checks for events that happen around and to the Corn
	 * as of now it is used to check for enemies nearby
	 * @returns if there are no enemies nearby, get out of teh brain
	 */
	public async brain() {
		//store the closest enemy entity nearby from the Corn
		let closestEntity = Entity.nearestEntity(this, EnemyEntity) as EnemyEntity | undefined;

		//if there are no entities nearby, don't continue running the code
		if (!closestEntity) return;

		//store the distance between the enemy and the corn
		let distance = Entity.getDistance(this, closestEntity);

		//if the distance between the enemy and the corn is less than or equal to 45 pixels, 
		// and Corn has not been stunned, start attacking
		//the corn will shoot/summon a kernel between the position of the Corn and the enemy
		if (distance <= 45 && this.stunned == false){
			new Kernel(this.position, closestEntity);
			
			//change the Corn's state to shooting
			this.state = "shoot";

			//wait for a bit for the animation to play(half a second)
			await this.wait(500);

			//once done waiting revert Corn's animation back to idling
			this.state = "idle";
		}
	}
}


//the kernel is created via the Corn, and is a child of the corn
export class Kernel extends Corn{
	//store who the target is
	private target : EnemyEntity;
	
	//label the kind of entity corn is - a defender
	public override entityType = "defender/Kernel";

	static override baseStats: DefenderEntityStats;

	//use the corn's position and store the tracked target into the kernel's target property
	constructor(position: Position2D, target: EnemyEntity){
		super(position);

		this.target = target;
	}

	//this method needs to exist, but will not have anything in it because the Kernel's death is done in the brain
	protected override die(): void {}

	public override attackEntity(entity:Entity):Promise<undefined|EntityEvent> {
		return new Promise ((resolve) =>{
			if (this.stunned) {
				resolve({ interrupt_type: "stunned" });
			}
			//attack enemy entity
			entity.dealDamage(this.stats.damage as number, this);

			//if corn's skill is unlocked, kernels can do area of effect damage (enemies around it will also get hurt)
			if (this.kernelAOE == true){
				//deal damage around area
				//deals 1/3 of its damage to the entities around it
				//store an object array of the entities in range of the kernel's attack 
				//use the Entity method totalEntitiesInRange
				let entitiesNearKernel = Entity.totalEntitiesInRange(this,this.stats.aoeRange as number, EnemyEntity);

				//if there are no enemies around, don't even run the rest
				if (entitiesNearKernel.length == 0){
					resolve(undefined);
				}

				//dealDamage - loop through the entire array of entitiesNearKernel and do 1/3 of the corn's damage
				let blastDamage = this.stats.damage as number/3;

				for (let i = 0;i<entitiesNearKernel.length;i++){
					(entitiesNearKernel[i] as Entity).dealDamage(blastDamage,entitiesNearKernel[i] as Entity) ;
				}
			}

			//resolve the promise, without providing a reason
			resolve(undefined);
		});
	}

	/**
	 * the brain checks for events that happen around and to the Kernel
	 * as of now it is used to check for enemies nearby
	 */
	public override async brain(): Promise<void> {
		//get the Kernel to keep on traveling to the target/enemy's position
		await this.walkTo(this.target.position[0], this.target.position[1]);

		//when it has, attack the target
		this.attackEntity(this.target);

		//when the enemy has been attacked, set the kernel's health to 0, disappearing from the playing field
		this.stats.health = 0;
	}
}