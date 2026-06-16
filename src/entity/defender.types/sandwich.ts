import { DefenderEntity, DefenderEntityStats } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { Strawberry } from "./strawberry.js";

export class Sandwich extends DefenderEntity {
	/** Label what the type of entity sandwich is - a Defender*/
	public entityType = "defender/sandwich";

	/**Sandwich base stats */
	public static override baseStats : DefenderEntityStats = {
		health: 40,
		speed: 0,
		damage: 0,
		knockBack: 3,
		entityPurchaseCost: 25,
		entityResaleCost: 12,
		attackCoolDown: 0,
		spawnCoolDown: 5000, 
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 0, 
		regenerationDuration : 0,
		aoeRange : 0,
		upgradeEntityCost : 30
	};

	protected onDeath(): void | Promise<void> {
		
	}
	
	public getEntitiesInRange<EntityType extends typeof Entity>(selector:EntityType, radius:number):InstanceType<EntityType>[] {
		
		let ids:string[] = [ ...Entity.entities.keys() ];

		let entities:InstanceType<EntityType>[] = [];

		for (let i = 0; i < ids.length; i ++) {

			let id:string = ids[i] as string;
			let entity:Entity|undefined = Entity.entities.get(id);

			if (entity instanceof selector == false) continue;

			let distance = Entity.getDistance(this, entity);

			if (distance > radius) continue;

			entities.push(entity as InstanceType<EntityType>);

		}

		return [];
	}

	public async brain() {

		this.state = "idle";

		let entitiesInRange = this.getEntitiesInRange(EnemyEntity, 50);

		await this.wait(Infinity);

		let entities = Sandwich.spawn<Sandwich>(1, [0,0]);

	}
};