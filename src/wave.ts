import { Cherry } from "./entity/defender.types/cherry.js";
import { Corn } from "./entity/defender.types/corn.js";
import { Strawberry } from "./entity/defender.types/strawberry.js";
import { EnemyEntity } from "./entity/enemy.js";
import { Ant } from "./entity/enemy.types/ant.js";
import { Frog } from "./entity/enemy.types/frog.js";
import { Raccoon } from "./entity/enemy.types/raccoon.js";
import { Wasp } from "./entity/enemy.types/wasp.js";
import { Entity } from "./entity/entity.js";
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
	 * @param deltaTime The time of each game tick
	 */
	public static update(deltaTime : number) : void {
		
		// Store if a wave is active (any enemies are alive)
		// Initially assume all enemies are dead
		let waveActive = true;
		
		// Search map for any enemies
		// Breaks loop and sets enemyDead to be false if an enemy is found
		for (const entity of Entity.entities.values()) {
			if (entity instanceof EnemyEntity) {
				waveActive = false;
				break;
			}
		}

		// If a wave is active, do not do anything
		if (waveActive) return;

		// Updates the current time left
		this._timeLeft -= deltaTime;

		// If the time is not up, do not do anything
		if (this._timeLeft > 0) return;

		// Starts a new wave of enemies
		this.newWave();

		// Increases the wave duration by 2 seconds every time a wave ends
		this._waveDuration += 2000;

		// Reset the wave timeout
		this._timeLeft = this._waveDuration;
	}

	public static setWave(number:number=this._waveNumber) {

		this._waveNumber = number;

		// Spawns an ant every wave
		Ant.antSpawn([0,0],100);
		Raccoon.spawn(1,[100,100],2);
		Wasp.spawn(1,[100,100],2);

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
	
	/**
	 * Starts a new wave
	 * 
	 * Spawns enemies based on wave number
	 */
	public static newWave() : void {	
		// Increase the wave number
		this._waveNumber++;

		this.setWave()
		
	}

	// test to kill everyone :thumbs-up:
	public static killThemEnemies() : void {
		for (let entity of Entity.entities.values()) {
			if (entity.entityType.startsWith("enemy")) entity.stats.health = 0;
		}
	}
}

// @ts-ignore
window.Wave = Wave;