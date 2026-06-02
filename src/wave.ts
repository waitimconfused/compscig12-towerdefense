import { EnemyEntity } from "./entity/enemy.js";
import { Ant } from "./entity/enemy.types/ant.js";
import { Frog } from "./entity/enemy.types/frog.js";
import { Raccoon } from "./entity/enemy.types/raccoon.js";
import { Wasp } from "./entity/enemy.types/wasp.js";
import { Entity } from "./entity/entity.js";

/**
 * Class to handle waves and enemy behaviour after each wave
 * 
 * Spawns enemies, upgrades enemies after every wave
 * 
 * Wave ends after set duration or when all enemies die
 */
export class Wave {
	// Tracks wave number, starts at wave 0
	private static _waveNumber : number = 0;
	public static getWave() { return this._waveNumber };

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
		
		// Upgrades all enemies
		EnemyEntity.upgrade();
	}

	private waveLoop() : void {
		for (let entity of Entity.entities.values()) {
		
			if (entity instanceof EnemyEntity == false) continue;
		
			if (entity.stats.health > 0) {
				console.warn("Not all EnemyEntity instances are dead.");
				return;
			}
		}
		
		
	}

}

// @ts-ignore
window.Wave = Wave;