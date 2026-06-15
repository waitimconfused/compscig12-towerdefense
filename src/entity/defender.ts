import { Position2D } from "../types.js";
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
	upgradeEntityCost : number;

}

export abstract class DefenderEntity extends Entity{
	declare public stats: DefenderEntityStats;

	public static override get stats():DefenderEntityStats {

		let upgrade = this.baseStats as EntityStats;
		let storeUpgrades = Object.keys(upgrade);

		let stats:DefenderEntityStats = super.stats as DefenderEntityStats;

		/**
		 * level up the the defender 
		 */
		for (let i = 0; i < storeUpgrades.length; i++){
			
			// Get the key of the upgraded stat
			let statType = storeUpgrades[i] as keyof typeof upgrade;
			
			// Get the upgraded stat value
			let baseState = upgrade[statType] as number;

			// Update the entity stats
			stats[statType] += baseState / this.levelIncrease;

			//If the Defender has been upgraded to level 3, their skill will activate
			if (this.defenderLevel == 3){
				this.canUseSkill = true;
				if (this.prototype.entityType == "defender/sandwich" && statType == "health"){
					stats[statType] += baseState + 100;
				}
			}
		}

		return stats;
	}	

	static override baseStats: DefenderEntityStats;

	private static defenderLevel : number = 1;

	protected static canUseSkill : boolean = false;

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

};

export type DefenderStatus = {
	activeDefenders : number;
	defeatedDefenders : number;
	deployDefenderPoints : number;
	upgradeDefenderPoints: number;
}