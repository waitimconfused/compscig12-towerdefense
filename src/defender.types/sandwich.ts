//import the defenderentity class
import { DefenderEntity } from "../defenderentity.js";
import { EnemyEntity } from "../enemyEntity.js";
import { View } from "../view.js";

class Sandwich extends DefenderEntity {
	//create the unique properties for the defender "sandwich"
	private hitCount : number;
	private sandwichLayerCount : number;

	private isThinking:boolean = false;

	constructor(
		view: View,
		stats: { health: number; speed: number; regeneration: number }, 
		theDefenderLvl : number,
		theSpawnCooldown : number,
		theAttackCooldown : number, 
		theDefenderCost : number,
		theDefenderSoldCost : number,
		theDefenderUpgradePoints : number, 
		theDefenderUpgradeCost : number,
		theDefenderAttackDamage : number
	){
		super( view, stats, theDefenderLvl, theSpawnCooldown, theAttackCooldown, theDefenderCost, theDefenderSoldCost, theDefenderUpgradePoints, theDefenderUpgradeCost, theDefenderAttackDamage );
	}

	private async waitForInteraction():Promise<EnemyEntity> {
		return new Promise(() => {

		});
	}

	public tick() {
		if (!this.isThinking) this.brain();

	}

	private async brain() {

		this.isThinking = true;
	
		let hitByEnemy = await this.waitForInteraction();

		this.isThinking = false;

	}
}

export{Sandwich};