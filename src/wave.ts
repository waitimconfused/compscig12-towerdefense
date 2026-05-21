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

	public static newWave() {
		this._waveNumber++;

		let spawnIncrease = 2;

		Ant.spawn(1,[0,0],2);
		Raccoon.spawn(1,[0,0],2);
		Wasp.spawn(1,[0,0],2);
		Frog.spawn(1,[0,0],2);

	}
}