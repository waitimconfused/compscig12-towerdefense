import { MouseManager } from "../mouse.js";
import { Position2D } from "../types.js";

type EntityTimer = {
	type: "wait" | "walk";
	callback: (result:EntityEvent|undefined) => void;
	
	/**
	 * Time when the timer should be triggered.
	 */
	trigger_time?: number
};

export type EntityEventType = "wait" | "jump" | "walk";
export type EntityEventInterrupt = "attacked" | "error" | 'stunned';

export type EntityEvent = {
	type?: EntityEventType | undefined;
	interrupt_type?: EntityEventInterrupt;
	triggered_by?: Entity | Error;
};

export type EntityStats = {
	health: number;
	max_health: number;
	speed: number;
	damage: number;
}

export abstract class Entity {

	public stunned : boolean = false;

	public abstract entityType:string;
	private index:number = 0;
	public static idLength:number = 3;

	public state:string = "idle";
	
	public position:Position2D = [ 0, 0 ];

	public stats:EntityStats = {
		health: 100,
		max_health: 100,
		speed: 0.5,
		damage: 0
	};

	public static level:number = 0;

	public static upgrades:EntityStats[] = [
		{ health: 0, max_health: 100, speed: 10, damage: 10 }
	];

	private _targetPosition:Position2D|null = null;

	private internalTimers:EntityTimer[] = [];
	public brainActive:boolean = false;
	public animationOffset:number = 0;

	public static entities:Entity[] = [];

	constructor(position:Position2D) {
		this.position = position;
		this.index = Entity.entities.length;

		this.reloadStats();

		Entity.entities.push(this);
	}

	/**
	 * Direction from the entity to a target, *measured in **radians***.
	 */
	public direction:number = 0;

	// stops entity movement
	public stopMovement() {
		this._targetPosition = null;
	}

	public wait(milliseconds:number):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {
			this.internalTimers.push({
				type: "wait",
				trigger_time: performance.now() + milliseconds,
				callback: resolve,
			})
		});

	}

	/**
	 * Deal damage to this entity, and break out of any timers
	 * @param dealtDamage Amount of damage
	 * @param attacker
	 */
	public dealDamage(dealtDamage:number, attacker:Entity) {
		this.stats.health -= dealtDamage;

		this.interruptTimers(null, {
			triggered_by: attacker,
			interrupt_type: "attacked"
		});

	}

	/**
	 * Attack an enemy
	 * @param entity The enemy to attack
	 * @returns 
	 */
	public attackEntity(entity:Entity):Promise<undefined|EntityEvent> {
		if (this.stunned) {
			return Promise.resolve({
				interrupt_type: 'stunned'
			})
		}

		return new Promise((resolve) => {
			entity.dealDamage(this.stats.damage, this);
			resolve(undefined);
		})
	}

	public walkTo(x:number, y:number):Promise<undefined|EntityEvent> {
		
		if (this.stunned) {
			return Promise.resolve({
				interrupt_type: 'stunned'
			})
		}

		return new Promise((completed) => {

			x = Math.round( x * 100 ) / 100;
			y = Math.round( y * 100 ) / 100;

			if (this.position[0] == x && this.position[1] == y) {
				completed(undefined);
				return;
			}
			
			this._targetPosition = [ x, y ];
			this.state = "walk";

			this.internalTimers.push({
				type: "walk",
				callback: completed,
			});

		});

	}

	public reloadStats() {

		let constructor = this.constructor as typeof Entity;

		let upgrade = constructor.upgrades[constructor.level];

		if (!upgrade) return;

		this.stats.damage = upgrade.damage;
		this.stats.health = (this.stats.health / this.stats.max_health) * upgrade.max_health;
		this.stats.max_health = upgrade.max_health;

	}

	/**
	 * 
	 * Spawn a number of `Entity` instances, around a desired `position`.
	 * 
	 * The `position` can be randomized through specifying a `spreadAmount`.
	 * 
	 * @param count			Number of `Entity` instances to spawn
	 * 						Defaults to `1`.
	 * 
	 * @param position		Starting-location of each `Entity` instance
	 * 						Defaults to `[ 0, 0 ]`.
	 * 
	 * @param spreadAmount	Used to randomize the `Entity` location.
	 * 						Defaults to `0` (directly at `position`)
	 * 						`0` or `undefined` makes all entities spawn directly at the `position` 
	 */
	public static spawn(count:number=1, position:Position2D, spreadAmount?:number):Entity[] {

		// Create a variable to store the new `Entity` instances
		let entities:Entity[] = [];

		// If the number of `Entity` instances to spawn is invalid, set it to `1`.
		if (count < 1) count = 1;

		// Create `count` amount of instances
		for (let i = 0; i < count; i ++) {

			// Keep track of where the current `Entity` should be spawned
			let location:Position2D = position;

			// If the `spreadAmount` has been set, randomize the placement of each
			// `Entity` instance, by using a random angle (radians) and
			// magnitude ( between `0` and `spreadAmount` )
			if (spreadAmount) {

				// Create a random angle in radians
				let angle = Math.random() * 2*Math.PI;

				// Create a random magnitude
				let magnitude = Math.random() * spreadAmount;

				// Round the magnitude to the nearest 0.01
				magnitude = Math.round( magnitude * 100 ) / 100;

				// Offset the location by the randomized angle & magnitude
				location[0] += Math.cos( angle ) * magnitude;
				location[1] += Math.sin( angle ) * magnitude;

				// Round the location to the nearest 0.01
				location[0] = Math.round( location[0] * 100 ) / 100;
				location[1] = Math.round( location[1] * 100 ) / 100;

				
			}
			
			// Ignore the following line, because TypeScript has a problem with it
			// Create a new instance of whatever class was used for the spawning
			// @ts-ignore
			let instance:Entity = new this(location);
			
			// Add the instance to the list of entities
			entities.push(instance);

		}

		// Return the spawned entities
		return entities;
	}

	public static upgrade() {
		this.level += 1;

		for (let i = 0; i < Entity.entities.length; i ++) {
			
			let entity = Entity.entities[i] as Entity;

			if (entity instanceof this == false) continue;

			entity.reloadStats();

		}

	}

	public interruptTimers(selector:EntityEventType|null, reason?:EntityEvent) {

		for (let i = 0; i < this.internalTimers.length; i ++) {

			let timer = this.internalTimers[i] as EntityTimer;

			if (selector && timer.type != selector) continue;

			timer.callback(reason);

			this.internalTimers.splice(i, 1);

		}

	}

	public movementTick(targetPosition:Position2D, deltaTime:number) {
		if (!targetPosition) return;

		let direction = Math.atan(
			(targetPosition[1] - this.position[1]) /
			(targetPosition[0] - this.position[0])
		);
		if (targetPosition[0] < this.position[0]) direction += Math.PI;
		
		let totalDistance = Math.hypot(
			targetPosition[0] - this.position[0],
			targetPosition[1] - this.position[1]
		) || 0;
		
		let currentSpeed = this.stats.speed * deltaTime;
		let magnitude = totalDistance < currentSpeed ? totalDistance : currentSpeed;

		if (magnitude != 0) {
			this.position[0] += magnitude * Math.cos(direction);
			this.position[1] += magnitude * Math.sin(direction);

			this.position[0] = Math.round( this.position[0] * 100 ) / 100;
			this.position[1] = Math.round( this.position[1] * 100 ) / 100;
			
			this.direction = direction;
		}

	}

	/**
	 * The internal state-machine.
	 * 
	 * Handles timers, and all "subconscious" tasks.
	 * 
	 * It keeps the `brain()` running.
	 */
	public tick(deltaTime:number) {
		if (this.stunned) {
			return;
		};

		if (this.stats.health <= 0) {
			this.state = "dead";
			this.wait(1000)
			.then(() => {
				this.index
				Entity.entities.splice(this.index, 1);
			});
		}

		if (!this.brainActive && this.state != "dead") {

			this.brainActive = true;

			this.brain()
			.then(() => {
				this.brainActive = false;
			})

		}

		for (let i = 0; i < this.internalTimers.length; i ++) {
			let timer = this.internalTimers[i] as EntityTimer;

			if (timer.type != "wait") continue;
			
			let triggerTime = timer.trigger_time as number;

			if (triggerTime > performance.now()) continue;

			this.state = "idle";
			timer.callback(undefined);
			this.internalTimers.splice(i, 1);

		}

		if (this._targetPosition) {

			this.movementTick(this._targetPosition, deltaTime);
			
			if (this.position[0] == this._targetPosition[0] && this.position[1] == this._targetPosition[1]) {
				
				this._targetPosition = null;
				this.state = "idle";
				this.interruptTimers("walk");

			}


		}

	}

	public static nearestEntity(origin:Entity, selector:typeof Entity):Entity|undefined {
		
		let nearest = undefined;
		let nearestDistance = Infinity;

		for (let i = 0; i < this.entities.length; i ++) {

			let entity = this.entities[i] as Entity;

			if (entity instanceof selector == false) continue;

			let distance = Math.hypot(
				entity.position[0] - origin.position[0],
				entity.position[1] - origin.position[1]
			);

			if (distance < nearestDistance) {
				nearest = entity;
				nearestDistance = distance;
			}

		}

		return nearest;

	}

	/**
	 * Gets run every game-tick
	 * 
	 * Used to perform "brain"-related action
	 * 
	 * > Should start by calling `super.unconsciousTick()`.
	 * > This is to handle backend tasks, like timers and
	 * > noticing when being attacked
	 */
	public abstract brain():Promise<void>;

	
}
