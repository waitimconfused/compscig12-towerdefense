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

	private static _waveCoolDown : number = 1_0000;
	private static _timeLeft : number = 1_0000;
	
	/**
	 * Game loop updates the wave time
	 * @param deltaTime The time of each game tick
	 */
	public static update(deltaTime : number) : void {

		let waveActive:boolean = false;

		let entities = [ ...Entity.entities.keys() ];

		for (let i = 0; i < entities.length; i ++) {
			let id = entities[i] as string;
			let entity = Entity.entities.get(id) as Entity;

			if (entity instanceof EnemyEntity == false) continue;
			
			waveActive = true;
			break;
		}

		if (waveActive == true) return;

		// Updates the current time left
		this._timeLeft -= deltaTime;

		if (this._timeLeft > 0) return;
		
		// Starts a new wave of enemies
		this.newWave();

		// Decrease the wave duration by 0.5 seconds every time a wave ends
		this._waveCoolDown -= 500;
		this._waveCoolDown = Math.max(this._waveCoolDown, 0);

		// Updates current time left to match the wave duration
		this._timeLeft = this._waveCoolDown;
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

		this.setWave(this._waveNumber);
		
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