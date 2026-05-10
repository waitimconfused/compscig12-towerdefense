import { Position2D } from "../types.js";
import { Entity, EntityStats } from "./entity.js";

export abstract class DefenderEntity extends Entity{
	//whether the entity type has been upgraded
	protected skillUnlocked: boolean = false;

	constructor(position: Position2D){
		super(position);
	}

	protected die(): void {
		
	}

	
	/**
	 * if the type of Defender is level 3 or higher, they have unlocked their unique skill 
	 * override reloadStats to check for Defender upgrade
	 */
	public override reloadStats(): void {
		super.reloadStats();
		if (DefenderEntity.level >= 3){
			this.skillUnlocked = true;
		}
	}

	protected unlockSkill(activateSkill : boolean){
		activateSkill = true;
	}

	

};

export type DefenderStatus = {
	activeDefenders : number;
	defeatedDefenders : number;
	deployDefenderPoints : number;
	upgradeDefenderPoints: number;
}

