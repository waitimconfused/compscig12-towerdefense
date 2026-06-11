import { Position2D } from "../types.js";
import { EnemyEntity } from "./enemy.js";
import { Entity, EntityStats } from "./entity.js";

export interface DefenderEntityStats extends EntityStats {
	/**
	 * the entity's purchase cost
	 */
	entityPurchaseCost : number;

	/**
	 * the entity's resale cost
	 */
	entityResaleCost : number;

	/**
	 * the cost of upgrading a Defender
	 */
	upgradeEntityCost : number | undefined;
}

export abstract class DefenderEntity extends Entity{

	declare public stats: DefenderEntityStats;

	static override baseStats: DefenderEntityStats;

	/**
	 * Value used inside `this.reloadStats()` to determine
	 * how to increase the entity's stats
	 * 
	 * This is because only one upgrade is to be specified
	 * for each `Defender`. This initial upgrade is used to
	 * determine the following stats for any following wave.
	 * 
	 * Usage: `new_stat = base_stat / levelIncrease`
	 */
	private static levelIncrease:number = 2;

	constructor(position: Position2D){
		super(position);
	}

	protected onDeath(): void {
		
	}

	public override reloadStats(): void {
		super.reloadStats();

		let constructor = this.constructor as typeof DefenderEntity;
		let upgrade = constructor.baseStats as EntityStats;
		let storeUpgrades = Object.keys(upgrade);

		/**
		 * level up the the defender 
		 */
		for (let i = 0; i < storeUpgrades.length; i++){
			
			// Get the key of the upgraded stat
			let statType = storeUpgrades[i] as keyof typeof upgrade;
			
			// Get the upgraded stat value
			let baseState = upgrade[statType] as number;

			// Update the entity stats
			this.stats[statType] += baseState / constructor.levelIncrease;
		}
		
	}
	
	/**
	 * if the type of Defender is level 3 or higher, they have unlocked their unique skill 
	 * override reloadStats to check for Defender upgrade
	 */
	protected unlockSkill(activateSkill : boolean) : void{
		activateSkill = true;
	}


};

export type DefenderStatus = {
	activeDefenders : number;
	defeatedDefenders : number;
	deployDefenderPoints : number;
	upgradeDefenderPoints: number;
}