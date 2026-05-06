import { EnemyDrops, EnemyEntity } from "./entity/enemy";

export type OwnedResources = {
	coinsOwned : number,
	pointsOwned : number,
	materialsOwned : {
		jar : number,
		wood : number,
		honey : number,
		glassLemonade : number
	}
}

export class Player {
	public resources : OwnedResources = {
		coinsOwned : 0,
		pointsOwned : 0,
		materialsOwned : {
			jar : 0,
			wood : 0,
			honey : 0,
			glassLemonade : 0
		}
	};

	public setResources (materials : EnemyDrops) {
		
	}
}