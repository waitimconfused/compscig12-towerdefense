import { EnemyEntity } from "./entity/enemy.js";
import { Ant } from "./entity/enemy.types/ant.js";
import { Frog } from "./entity/enemy.types/frog.js";
import { Raccoon } from "./entity/enemy.types/raccoon.js";
import { Wasp } from "./entity/enemy.types/wasp.js";
import { Entity } from "./entity/entity.js";


export class Wave {
	private static _waveNumber : number = 0;
	public static getWave() { return this._waveNumber };

	public static newWave() : void {	
		// for (let entity of Entity.entities.values()) {

		// 	if (entity instanceof EnemyEntity == false) continue;

		// 	if (entity.stats.health > 0) {
		// 		console.warn("Not all EnemyEntity instances are dead.");
		// 		return;
		// 	}
		// }
		
		this._waveNumber++;

		console.log(this._waveNumber);

		// let spawnCount : number = 1 + Math.floor(this._waveNumber / 3);

		Ant.antSpawn([0,0],100);
		
		if (this._waveNumber % 2 == 0) {
			Frog.spawn(1,[100,100],2);
		}	

		if (this._waveNumber % 3 == 0) {
			Wasp.spawn(1,[100,100],2);
		}
		
		if (this._waveNumber % 5 == 0) {
			Raccoon.spawn(1,[100,100],2);
		}

		EnemyEntity.upgrade();
	}
}

// @ts-ignore
window.Wave = Wave;