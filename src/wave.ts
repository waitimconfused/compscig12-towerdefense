import { Cherry } from "./entity/defender.types/cherry.js";
import { Corn } from "./entity/defender.types/corn.js";
import { Strawberry } from "./entity/defender.types/strawberry.js";
import { EnemyEntity } from "./entity/enemy.js";
import { Ant } from "./entity/enemy.types/ant.js";
import { Frog } from "./entity/enemy.types/frog.js";
import { Raccoon } from "./entity/enemy.types/raccoon.js";
import { Wasp } from "./entity/enemy.types/wasp.js";
import { StaticClass } from "./types.js";

/**
 * Class to handle waves and enemy behaviour after each wave
 * 
 * Spawns enemies, upgrades enemies after every wave
 * 
 * Wave ends after set duration or when all enemies die
 */
export class Wave extends StaticClass {
	// Tracks wave number, starts at wave 0
	private static _waveNumber : number = 0;
	public static getWave() { return this._waveNumber };

	private static _waveDuration : number = 60000;
	private static _timeLeft : number = 60000;
	
	/**
	 * Game loop updates the wave time
	 * @param t The time of each game tick
	 */
	public static update(t : number) : void {
		// Updates the current time left
		this._timeLeft -= t;

		// Checks if the wave is finished
		if (this._timeLeft <= 0) {
			// Starts a new wave of enemies
			this.newWave();

			// Increases the wave duration by 2 seconds every time a wave ends
			this._waveDuration += 2000;

			// Updates current time left to match the wave duration
			this._timeLeft = this._waveDuration;
		}
	}
	
	/**
	 * Starts a new wave
	 * 
	 * Spawns enemies based on wave number
	 */
	public static newWave() : void {	
		// Increase the wave number
		this._waveNumber++;

		// let spawnCount : number = 1 + Math.floor(this._waveNumber / 3);
		
		// Spawns an ant every wave
		Ant.antSpawn([0,0],100);
		Raccoon.spawn(1,[100,100],2);
		Wasp.spawn(1,[100,100],2);
		Strawberry.spawn(1,[100,500],2);
		Strawberry.spawn(1,[500,500],2);
		
		// Spawns a frog every 2 waves
		if (this._waveNumber % 2 == 0) {
			Frog.spawn(1,[100,100],2);
		}	
		
		// Spawns a wasp every 3 waves
		if (this._waveNumber % 3 == 0) {
			Wasp.spawn(1,[100,100],2);
		}
		
		// Spawns a raccoon every 5 waves
		if (this._waveNumber % 5 == 0) {
			Raccoon.spawn(1,[100,100],2);
		}
		

	}

	// private waveLoop() : void {
	// 	for (let entity of Entity.entities.values()) {
		
	// 		if (entity instanceof EnemyEntity == false) continue;
		
	// 		if (entity.stats.health > 0) {
	// 			console.warn("Not all EnemyEntity instances are dead.");
	// 			return;
	// 		}
	// 	}
	// }

}

// @ts-ignore
window.Wave = Wave;