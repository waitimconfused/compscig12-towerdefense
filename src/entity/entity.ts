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
export type EntityEventInterrupt = "success" | "error" | "attacked" | "stunned" | "slowed";

export type DamageType = 'melee' | 'ranged' | 'aoe';

export type EntityEvent = {
	interrupt_type?: EntityEventInterrupt;
	triggered_by?: Entity | Error;
};

/**
 * Structure for entity stats.
 */
export interface EntityStats {
	
	/**
	 * The current entity health
	 */
	health: number;

	/**
	 * The movement speed of the entity
	 */
	speed: number;
	
	/**
	 * How much damage the entity inflicts on another entity
	 */
	damage: number;

	/**
	 *the knock-back the entity does against another entity
	 */
	knockBack : number;

	/**
	 * the entity's spawn cool-down
	 */
	spawnCoolDown : number | undefined;

	/**
	 * the entity's attack cool-down
	 */
	attackCoolDown : number | undefined;

	/**
	 * the chance for entity to stun target (if they have the ability to stun entities)
	 */
	stunChance : number | undefined;

	/**
	 * the duration the entity stuns the target for (if they have the ability to stun entities)
	 */
	stunDuration : number | undefined;

	/**
	 * the duration the entity slows the target for (if they have the ability to slow entities)
	 */
	slowDuration : number | undefined;

	/**
	 * the duration the entity regenerates their health for (if they have the ability to regenerate)
	 */
	regenerationDuration : number | undefined;

	/**
	 * the range of an Entity's area of effect attack (if they have the ability to do aoe attacks)
	 */
	aoeRange : number | undefined;

	/**
	 * the cost of upgrading an entity (only applicable to Defenders)
	 */
	upgradeEntityCost : number | undefined;
	
}

export abstract class Entity {

	protected _id:string;

	/**
	 * Keep track of if the entity is stunned
	 */
	public stunned:boolean = false;

	/**
	 * Tracks number of regeneration stacks currently active on an entity
	 * Prevents regeneration from stacking infinitely
	 */
	public currentRegenerationStacks:number = 0;
	
	/**
	 * Keep track of if the entity has the slowness modifier
	 */
	public slowed:boolean = false;

	/**
	 * 
	 */
	public slowStacks:number = 0;

	/**
	 * Keep track of if the entity is invulnerable,
	 * meaning cannot take any damage
	 */
	public invulnerable:boolean = false;

	/**
	 * The string-name of the entity.
	 * 
	 * This is used for selecting which logic
	 * flow should be used when rendering
	 */
	public abstract entityType:string;
	public static idLength:number = 3;

	/**
	 * Keep track of what the entities stat is.
	 * 
	 * This is used for selecting which logic
	 * flow should be used when rendering
	 */
	public state:string = "idle";
	
	/**
	 * Keep track of where the entity is in the world, as a `Position2D` array
	 */
	public position:Position2D = [ 0, 0 ];

	/**
	 * Keep track of the entities stats (health, speed, etc.)
	 */
	public stats:EntityStats;

	/**
	 * Keep track of what level the Entity is.
	 * 
	 * This is used for selecting what stats should be
	 * used, in relation to `Entity.upgrades`
	 */
	public static level:number = 0;

	/**
	 * Store what upgrades the entity has, and in which order
	 * 
	 * The upgrades are applied in relation to `Entity.level`
	 */
	public static baseStats:EntityStats;

	public static statIncreaseMultiplier : number = 1;

	/**
	 * The maximum value of the `Entity.level`
	 * 
	 * If set to `0`, then there is no max level
	 */
	public static maxLevel : number = 0;

	/**
	 * Keep track of what the location the entity is trying to walk to
	 * 
	 * If `null`, the entity is not trying to move to any location
	 */
	protected _targetPosition:Position2D|null = null;

	private internalTimers:EntityTimer[] = [];
	
	/**
	 * Keep track of if the "conscious" `brain()` function is running
	 * 
	 * The `brain()` function is called inside of `tick()`, when it
	 * isn't currently running
	 */
	private brainActive:boolean = false;

	/**
	 * Keep track of if the entity is dead
	 * 
	 * Used in `tick()`, for determining when to run
	 * the `die()` function only once
	 */
	private isDead:boolean = false;
	
	/**
	 * Keep track of what offset to apply to the sprite when
	 * being rendered onto the `GameplayView`
	 */
	public animationOffset:number = 0;

	/**
	 * This function will be called when the entity's health is <= `0`.
	 */
	protected abstract die():void;

	/**
	 * A list of all *alive-ish* (or rather, active) entities to be updated and
	 * rendered onto a `GameplayView`
	 * 
	 * *Alive-ish*: Entities probably have a death
	 * animation which is played before removing itself from the list
	 */
	public static entities:Map<string, Entity> = new Map();

	constructor(position:Position2D) {

		let constructor = this.constructor as typeof Entity;
		
		if (!constructor.baseStats) throw new Error(`Entity ${constructor.name} does not have baseStats.`)

		// Set the position
		this.position = position;

		// Reload the entity stats (health, speed, etc.)
		this.reloadStats();

		// Set the ID to an empty string
		this._id = "";

		// While the ID is an empty string (starting value) or
		// the ID is already used inside the global entity list,
		// randomize the ID
		while (this._id == "" || Entity.entities.has(this._id)) {
			
			// Generate a random number (length=6) in base 16,
			// with the left-most digits filled with "0"
			this._id = Math.floor(Math.random() * 999999)
						.toString(16)
						.padStart(6, "0");
		}

		// Add this entity to the list of active entities
		Entity.entities.set(this._id, this);
	}

	/**
	 * Direction from the entity to a target, *measured in **radians***.
	 */
	public direction:number = 0;

	/**
	 * Wait for a specified number of milliseconds
	 * 
	 * **Can be interrupted**, like when being attacked
	 * 
	 * @param milliseconds	The number of milliseconds that the timer should wait for
	 * 
	 * @returns				A promise that is resolved when the
	 * 						amount of milliseconds has passed, or
	 * 						the timer has been interrupted (like if
	 * 						the entity was attacked)
	 */
	public wait(milliseconds:number):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {

			// Add an internal WAIT timer
			this.internalTimers.push({
				type: "wait",
				
				// Specify what time the timer should be
				// triggered (`current_time + timer_duration`)
				trigger_time: performance.now() + milliseconds,
				
				// The resolution function to call when
				// the timer is up
				callback: resolve,
			})
		});

	}

	/**
	 * Triggered when an entity deals damage to this entity
	 * 
	 * *Note*: This function **should be overwritten**, in order to add animations
	 * 
	 * @param dealtDamage	Amount of damage that has been dealt
	 * @param attacker		What enemy dealt damage to this entity
	 */
	public dealDamage(dealtDamage:number, attacker:Entity, damageType : DamageType = 'melee'):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {
			if (this.invulnerable) {
				resolve(undefined);
				return;
			}

			let finalDamage = dealtDamage;

			this.stats.health -= finalDamage;

			this.interruptTimers(null, {
				triggered_by: attacker,
				interrupt_type: "attacked"
			});

			resolve(undefined);
		});

	}

	/**
	 * Attack a targeted enemy, dealing damage to it
	 * 
	 * *Note*: This function **should be overwritten**, in order to add animations
	 * 
	 * @param entity	The targeted enemy to attack
	 * 
	 * @returns			A promise which is resolved when the entity is
	 * 					done attacking, or is interrupted
	 */
	public attackEntity(entity:Entity):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {

			// If the entity is stunned, resolve the promise,
			// with the reason that it is stunned
			if (this.stunned) {
				resolve({ interrupt_type: "stunned" });
			}

			// Deal damage to the entity
			entity.dealDamage(this.stats.damage as number, this);
			
			// Resolve the promise, without providing a reason
			resolve(undefined);
		});
	}

	/**
	 * Make the entity start walking to a target location
	 * 
	 * @param x		The `x`-coordinate of the target location
	 * @param y		The `y`-coordinate of the target position
	 * 
	 * @returns		A promise that is resolved when the target
	 * 				position is reached, OR if the walking has been
	 * 				interrupted.
	 */
	public walkTo(x:number, y:number):Promise<undefined|EntityEvent> {

		return new Promise((resolve) => {

			// If the entity is stunned, resolve the promise,
			// with the reason that it is stunned
			if (this.stunned) {
				resolve({ interrupt_type: "stunned" });
				return;
			}

			// Round the coordinates to the nearest 0.01
			x = Math.round( x * 100 ) / 100;
			y = Math.round( y * 100 ) / 100;

			// If the position is the same as the target location, stop
			if (this.position[0] == x && this.position[1] == y) {
				resolve(undefined);
				return;
			}
			
			// Set the internal target position
			this._targetPosition = [ x, y ];

			// Set the internal state to `"walk"`
			this.state = "walk";

			// Add a walking timer to the list of internal timers
			// This timer will be resolved when the target position
			// has been reached, or the entity could not reach
			// said position due to some reason
			this.internalTimers.push({
				type: "walk",
				callback: resolve,
			});

		});

	}

	
	/**
	 * Update the entities stats, using their base stats as reference
	 */
	
	public reloadStats(): void {
		let constructor = this.constructor as typeof Entity;
		let upgrade = constructor.baseStats as EntityStats;
		let level = constructor.level;
		let statIncreaseMultiplier = constructor.statIncreaseMultiplier;
		let storeUpgrades = Object.keys(upgrade) as (keyof typeof upgrade)[];

		if (!constructor.baseStats) {
			throw new Error(`Entity ${constructor.name} must specify baseStats.`);
		}

		if (!this.stats) this.stats = {} as EntityStats;

		for (let i = 0; i < storeUpgrades.length; i++){

			// Get the key from the current upgrade
			let statType = storeUpgrades[i] as keyof typeof upgrade;
			let statValue = upgrade[statType] as number;

			// Update the current entity stats
			// this.stats[statType] = upgrade[statType]  + upgrade[statType] * lvlIncrease/2 * level;
			this.stats[statType] = statValue * ( 1 + level*statIncreaseMultiplier );
		}

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
			let location:Position2D = Array.from(position) as Position2D;

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
			console.log("Spawned", this.name);
			
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

	/**
	 * Increase the entities level by one, and
	 * reload each instance's stats
	 */
	public static upgrade() {

		if (this.level < this.maxLevel) return;

		// Increase the level by `1s
		this.level += 1;

		let entities = [ ...Entity.entities.values() ];

		// Loop through each Entity, and reload it's
		// stats if it's an instance of the same Entity class
		for (let i = 0; i < entities.length; i ++) {
			
			// Get the current entity
			let entity = entities[i] as Entity;

			// If it isn't an instance of this class, move onto the next one
			if (entity instanceof this == false) continue;

			// Reload the stats
			entity.reloadStats();

		}

	}

	/**
	 * Cancel or interrupt the active timers
	 * 
	 * @param selector	What kind of timer should be interrupted.
	 * 					If `null`, all timers will be stopped.
	 * 					Eg: All "walk" timers
	 * 
	 * @param reason 	Reason for why the timer was interrupted.
	 * 					Eg: It was attacked, by Billy `{ interrupt_type:"attacked", triggered_by:billy }`
	 * 					*(Optional)*
	 */
	public interruptTimers(selector:EntityEventType|null, reason?:EntityEvent) {

		// Loop through each timer
		for (let i = 0; i < this.internalTimers.length; i ++) {

			// Get the current timer
			let timer = this.internalTimers[i] as EntityTimer;

			// If there is a set selector, and the timer's type does not
			// match the selector, go to the next timer
			if (selector && timer.type != selector) continue;

			// The timer should be interrupted.
			// Trigger the callback function
			timer.callback(reason);

			// Remove the timer from `internalTimers`.
			this.internalTimers.splice(i, 1);

		}

	}

	/**
	 * This function is called on each game-tick, where the entity has a
	 * target position that is trying to navigate to.
	 * 
	 * @param targetPosition	A `Position2D` coordinate of where
	 * 							the entity is trying to get to
	 * 
	 * @param deltaTime			The time between the `entity.tick()` call.
	 * 							Adjusts the speed in relation to the FPS.
	 * 							Eg: `real_speed = base_speed * deltaTime`
	 */
	public movementTick(targetPosition:Position2D, deltaTime:number) {

		// Get the direction from the entity to the target position
		// In radians
		let direction = Math.atan(
			(targetPosition[1] - this.position[1]) /
			(targetPosition[0] - this.position[0])
		) || 0;
		
		// Store the direction that the entity moved
		this.direction = direction;

		// Fix the angle for when the target position's x value
		// is less than the entity's position
		if (targetPosition[0] < this.position[0]) direction += Math.PI;
		
		// Get the total distance to the target position
		// using Pythagorean Theorem
		let totalDistance = Math.hypot(
			targetPosition[0] - this.position[0],
			targetPosition[1] - this.position[1]
		);
		
		// Get the actual speed, adjusted using the deltaTime
		let currentSpeed = (this.stats.speed as number) * deltaTime;
		
		// If the distance is less than the step size, move
		// directly to the target position, and stop
		if (totalDistance < currentSpeed) {
			this.position[0] = targetPosition[0];
			this.position[1] = targetPosition[1];
			return;
		}

		// If the speed that the entity will move by is `0`, don't do anything
		if (currentSpeed == 0) return;

		// Update the position
		this.position[0] += currentSpeed * Math.cos(direction);
		this.position[1] += currentSpeed * Math.sin(direction);

		// Round to the nearest 0.01
		this.position[0] = Math.round( this.position[0] * 100 ) / 100;
		this.position[1] = Math.round( this.position[1] * 100 ) / 100;
		

	}

	/**
	 * The internal state-machine.
	 * 
	 * Handles timers, and all "subconscious" tasks.
	 * 
	 * It keeps the `brain()` running.
	 * 
	 * ***DO NOT OVERWRITE***
	 */
	public tick(deltaTime:number) {

		// If the entity's health is <= 0, kill it
		if (this.stats.health <= 0 && this.isDead == false) {

			this.isDead = true;

			// Call the `die()` function,
			// for last-minute actions like dropping items
			this.die();

			// Set the entity state to `"dead"`
			this.state = "dead";
			
			// Wait 1000 ms (1 sec), then remove this
			// entity from the list of Entity objects
			this.wait(1000).then(() => {

				// Remove this entity from the Entity.entities map
				Entity.entities.delete(this._id);

			});
		}

		// Restart the brain if it isn't running
		//
		// If the brain isn't running, and the entity is not dead
		if (!this.brainActive && this.state != "dead") {

			// State that the brain is now running/active
			this.brainActive = true;

			// Run the brain (`Promise<void>`)
			// Then, once the brain has completed it's actions, state that
			// the brain isn't running. This will cause the brain to be
			// rerun on the next `entity.tick()` call
			this.brain().then(() => {
				// State that the brain is no longer running/active
				this.brainActive = false;
			})

		}

		// Loop through each timer, 
		for (let i = 0; i < this.internalTimers.length; i ++) {

			// Get the current timer
			let timer = this.internalTimers[i] as EntityTimer;

			// If the current timer is not a WAIT timer, go to the next timer
			if (timer.type != "wait") continue;
			
			// Get the time when the timer should be triggered
			let triggerTime = timer.trigger_time as number;

			// If the time isn't in the past, go to the next timer
			if (triggerTime > performance.now()) continue;

			// Call the timer's callback function
			timer.callback(undefined);

			// Remove the timer from the internal timer list
			this.internalTimers.splice(i, 1);

		}

		// If a target position has been set (and it isn't stunned),
		// perform a movement-tick,  and stop walking if the
		// target position has been reached
		if (this._targetPosition && !this.stunned) {

			// Perform a movement-tick
			this.movementTick(this._targetPosition, deltaTime);
			
			// Check if the new position is the same as the target position
			if (
				this.position[0] == this._targetPosition[0] &&
				this.position[1] == this._targetPosition[1]
			) {
				// Clear the target position
				this._targetPosition = null;

				// Set the state back to `"idle"`
				this.state = "idle";

				// Clear walking timers, saying that the action was a success
				this.interruptTimers("walk", { interrupt_type: "success" });

			}


		}

	}

	/**
	 * Find the closest entity to an origin entity
	 * 
	 * @param origin	Specifies what entity is asking for the nearest entity
	 * 
	 * @param selector	What kind of Entity should be selected. *(Optional)*
	 * 
	 * @returns			The closest entity, matched by the selector.
	 * 					Is `undefined` if an entity could not be found
	 */
	public static nearestEntity(origin:Entity, selector?:typeof Entity):Entity|undefined {
		
		// Keep track of the nearest found entity (starts as undefined)
		let nearest:Entity|undefined = undefined;

		// Keep track of the distance to the closest entity (starts as `Infinity`)
		let nearestDistance = Infinity;

		// Get an array of all entities
		let entities = [ ...Entity.entities.values() ];

		// Loop through each Entity instance
		for (let i = 0; i < entities.length; i ++) {

			// Get the current entity
			let entity = entities[i] as Entity;

			// If a selector has been set, and the entity is
			// not an instance of it, move onto the next entity
			if (selector && entity instanceof selector == false) continue;

			// Get the distance between the origin entity and the current entity
			let distance = this.getDistance(origin,entity);

			// If the distance is less than the past nearest distance,
			// Update the stored entity and the stored distance
			if (distance < nearestDistance) {
				nearest = entity;
				nearestDistance = distance;
			}

		}

		// Return the nearest found entity, if one exists (`undefined`)
		return nearest;

	}

	/**
	 * find the total Entities in range of a specific Entity
	 * used for finding the amount of entities that will be affected by an area of effect event
	 * @param origin Specifies what entity is asking for the nearest entity
	 * @param range the pixel distance of the effect
	 * @param selector What kind of Entity should be selected. *(Optional)*
	 * @returns 
	 */
	public static totalEntitiesInRange(origin:Entity, range:number, selector?: typeof Entity): Entity[]{
		//create an object array to collect the specific entities that will be effected
		let entitiesInRange : Entity[] = [];
		// Get an array of all entities
		let entities = [ ...Entity.entities.values() ];

		// Loop through each Entity instance
		for (let i = 0; i<entities.length;i++){
			//get the current entity
			let entity = entities[i] as Entity;

			// If a selector has been set, and the entity is
			// not an instance of it, move onto the next entity
			if (selector && entity instanceof selector == false) continue;

			// Get the distance between the origin entity and the current entity
			let distance = this.getDistance(origin,entity);

			// if the distance is within range, they Entity will be affected
			// Update the stored entity and the stored distance
			if (distance <= range) {
				//update the list of entities in range
				entitiesInRange.push(entity);
			}
		}

		//return the list of Entities in range of the Entity
		return entitiesInRange;
	}


	public static getDistance(origin:Entity, target: Entity) : number {
		return Math.hypot(target.position[0] - origin.position[0], target.position[1] - origin.position[1]);

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
