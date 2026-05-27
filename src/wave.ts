import { EnemyEntity } from "./entity/enemy";
import { Ant } from "./entity/enemy.types/ant";
import { Frog } from "./entity/enemy.types/frog";
import { Raccoon } from "./entity/enemy.types/raccoon";
import { Wasp } from "./entity/enemy.types/wasp";
import { Entity } from "./entity/entity";


export class Wave {
	private static _waveNumber : number = 0;
	public static getWave() { return this._waveNumber };

	constructor() {
		throw new TypeError('Wave class cannot be created as an object');
	}

	public static newWave() : void {	
		for (let entity of Entity.entities.values()) {
			if (entity instanceof EnemyEntity) {
				if (entity.stats.health > 0) {
					return;
				}
			}
		}
		
		this._waveNumber++;

		Ant.spawn(0,[0,0],2);
		
		if (this._waveNumber % 2) {
			Frog.spawn(1,[0,0],2);
		}	

		if (this._waveNumber % 3) {
			Wasp.spawn(1,[0,0],2);
		}
		
		if (this._waveNumber % 5) {
			Raccoon.spawn(1,[0,0],2);
		}

		EnemyEntity.upgrade();
	}
}