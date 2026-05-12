// import { EnemyDrops, MaterialType } from "./entity/enemy";

// export class Player {
// 	public resources = {
// 		coinsOwned : 0,
// 		pointsOwned : 0,
// 		materialsOwned : {
// 			jar : 0,
// 			wood : 0,
// 			honey : 0,
// 			glassLemonade : 0
// 		}
// 	}

// 	public setResources (drops : EnemyDrops) {
// 		this.resources.coinsOwned += drops.coins;
// 		this.resources.pointsOwned += drops.points;

// 		for (let material of drops.materials) {
// 			this.resources.materialsOwned[material.type] += material.amount;
// 		}
// 	}
// }