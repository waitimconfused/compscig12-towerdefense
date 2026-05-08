import { Position2D } from "../types.js";
import { Entity, EntityStats } from "./entity.js";

export abstract class DefenderEntity extends Entity{

	protected die(): void {
		
	}

	constructor(position: Position2D){
		super(position);
	}

	public override reloadStats(): void {
		let constructer = this.constructor as typeof DefenderEntity;
		let upgrade = constructer.upgrades[0] as EntityStats;
		let lvlIncrease = 2;
		let storeUpgrades = Object.keys(upgrade);

		/**
		 * level up the the defender 
		 */
		for (let i = 0; i < storeUpgrades.length; i++){
			//grab and store the key from the upgrades
			let statType = storeUpgrades[i] as string;
			//grab and store the value of the key from upgrades
			//@ts-ignore
			let baseState = upgrade[statType] as number;
			//@ts-ignore
			this.stats[statType] = baseState + baseState/lvlIncrease;
		}
		

	}

	

};

export type DefenderStatus = {
	activeDefenders : number;
	defeatedDefenders : number;
	deployDefenderPoints : number;
	upgradeDefenderPoints: number;
}

