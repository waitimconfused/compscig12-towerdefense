import Inventory, { InventoryItemTag } from "../../inventory.js";
import { Position2D } from "../../types.js";
import { EnemyEntity } from "../enemy.js";
import { Entity, EntityStats } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Tool } from "./tool.js";

export class JarOfHoney extends Tool{
	public override entityType = "tool/jar-of-honey";

	//Requirements for Jar of Honey
	public override toolRequirements : Map<InventoryItemTag, number>;

	//Jar of Honey can only slow up to 10 enemies
	private enemiesCaptured : number = 0; 
	
	/**Base stats of Jar of Honey */
	public static override baseStats: EntityStats = {
		health: 20,
		speed: 0,
		damage: 0,
		knockBack: 0,
		spawnCoolDown : 0,
		attackCoolDown : 0,
		stunChance : 0,
		stunDuration : 0,
		slowDuration : 15000,
		regenerationDuration : 0,
		aoeRange : 0,
	}

	//Requirements for making glass of lemonade
	constructor(position : Position2D){
		super(position);
		this.toolRequirements = new Map <InventoryItemTag, number>();
		this.toolRequirements.set('jar', 1);
		this.toolRequirements.set('coin', 20);
	}
	
	protected onDeath(): void {}

	public async brain(){
		//See if there are any enemies that are touching the honey
		let entitiesNearHoney = Entity.totalEntitiesInRange(this,this.stats.aoeRange as number, EnemyEntity);

		//If there is at least one, stun and slow them
		if (entitiesNearHoney.length >= 1){
			for (let i = 0;i<entitiesNearHoney.length;i++){
				//Honey can only slow 10 enemies before disappearing off the playing field
				if (this.enemiesCaptured < 10){
					StatusEffects.slowEntity(entitiesNearHoney[i] as Entity, this.stats.slowDuration as number);
					this.enemiesCaptured ++;
				}
				else {
					this.stats.health = 0;
				}
			}
		}
		//Otherwise, don't search through the variable "entitiesNearHoney"
		else{
			return;
		}
	}

	


	

	



	
}