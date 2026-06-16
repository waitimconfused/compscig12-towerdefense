import { Entity, EntityEvent } from "../entity.js";
import { EnemyEntity } from "../enemy.js";
import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { Position2D } from "../../types.js";

/**
 * create the class Corn that extends from Entity
 */
export class Corn extends DefenderEntity{
	/**Label the kind of entity corn is - a defender */
	public override entityType : string = "defender/corn";

	/**
	 * The corn's lvl 1 stats
	 * Through the DefenderEntity class, it will be able to level up, with reference to its base stats
	 */
	public static override baseStats: DefenderEntityStats = {
		health: 50,
		speed: 0,
		damage: 0, 
		knockBack: 0,
		spawnCoolDown: 7000,
		attackCoolDown: 5000,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 0,
		upgradeEntityCost : 40,
		entityPurchaseCost: 35,
		entityResaleCost: 17
	};

	
	protected override onDeath(): void {}

	/**
	 * the brain checks for events that happen around and to the Corn
	 * as of now it is used to check for enemies nearby
	 * @returns if there are no enemies nearby, get out of teh brain
	 */
	public async brain() {
		//store the closest enemy entity nearby from the Corn
		let closestEnemy = Entity.nearestEntity(this, EnemyEntity) as EnemyEntity | undefined;

		//if there are no entities nearby, don't continue running the code
		if (!closestEnemy) return;

		// Get the direction from the entity to the target position
		// In radians
		this.direction = Math.atan(
			(closestEnemy.position[1] - this.position[1]) /
			(closestEnemy.position[0] - this.position[0])
		) || 0;

		// Fix the angle for when the target position's x value
		// is less than the entity's position
		if (this.position[0] < closestEnemy.position[0]) this.direction += Math.PI;

		//store the distance between the enemy and the corn
		let distance = Entity.getDistance(this, closestEnemy);

		//if the distance between the enemy and the corn is less than or equal to 45 pixels, 
		// and Corn has not been stunned, start attacking
		//the corn will shoot/summon a kernel between the position of the Corn and the enemy
		if (distance <= 1000 && this.stunned == false){
			
			//change the Corn's state to shooting
			this.state = "shoot";

			await this.wait(200);

			await this.wait(200);

			new Kernel(this.position, closestEnemy);

			//wait for a bit for the animation to play(half a second)
			await this.wait(1100);

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
	public override entityType : string = "defender/kernel";

	//use the corn's position and store the tracked target into the kernel's target property
	constructor(position: Position2D, target: EnemyEntity){
		super(position);

		this.invulnerable = true;
		this.target = target;
	}

	//Kernal will have its own base stats
	//This means that enemies have the opportunity to get rid of the kernel before it hits them, but it doesn't directly effect the corn itself
	public static override baseStats: DefenderEntityStats = {
		health: 1,
		speed: 1,
		damage: 15, 
		knockBack: 3,
		spawnCoolDown: 0,
		attackCoolDown: 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0,
		regenerationDuration : 0,
		aoeRange : 1000,
		upgradeEntityCost : 0,
		entityPurchaseCost: 0,
		entityResaleCost: 0,
	};

	public override async attackEntity(entity:Entity):Promise<undefined|EntityEvent> {
		if (this.stunned) {
			return;
		}

		//Attack enemy entity
		entity.dealDamage(this.stats.damage, this);

		//If corn's skill is unlocked, kernels can do area of effect damage (enemies around it will also get hurt)
		if (Kernel.canUseSkill == true){
			this.state = "pop";

			//Deal damage around area
			//Deals 1/3 of its damage to the entities around it
			//Store an object array of the entities in range of the kernel's attack 
			//Use the Entity method totalEntitiesInRange
			let entitiesNearKernel = Entity.totalEntitiesInRange(this,this.stats.aoeRange, EnemyEntity);

			//If there are no enemies around, don't even run the rest
			if (entitiesNearKernel.length == 0) return;

			//Deal Damage - loop through the entire array of entitiesNearKernel and do 1/3 of the corn's damage
			let blastDamage = this.stats.damage/3;

			for (let i = 0;i<entitiesNearKernel.length;i++){
				(entitiesNearKernel[i] as Entity).dealDamage(blastDamage,entitiesNearKernel[i] as Entity) ;
			}
		}

		//Play last frame
		await this.wait(400);

		return;
	}

	/**
	 * The brain checks for events that happen around and to the Kernel
	 * As of now it is used to check for enemies nearby
	 */
	public override async brain(): Promise<void> {	
		//Change Defender State
		this.state = "attack";

		
		//Get the Kernel to keep on traveling to the target/enemy's position
		await this.walkToEntity(this.target);

		//When it has, attack the target
		this.attackEntity(this.target);

		//When the enemy has been attacked, set the kernel's health to 0, disappearing from the playing field
		this.stats.health = 0;
	}
}