import { Position2D } from "./types.js";
import { View } from "./view.js";

type EntityModifers = {
    speed : number,
    damage : number,
    sheild : number
}

type EntityUpgrade = {
    [statName : string] : number;
}

/**
 * Base class for all Entities
 * 
 * Handles position, movement, health, damage, healing, and death
 * 
 * Extended by specialized Entities
 * e.g. enemies, defenders
 */
export class Entity {
    // World view or rendering system reference
    private parentView: View
    
    // Current entity position
    public position : Position2D = [ 0, 0 ];

    // Target position entity is moving toward
    private walkingTo : Position2D = [ 0, 0 ];
    
    // Current health
    private _health: number;
    public get health() { return this._health };

    // Maximum possible health value
    private _maxHealth: number;
    public get maxHealth() { return this._maxHealth };
    
    // Base stats
    private _stats: { health : number, speed : number };
    public get stats() { return this._stats };
    
    // Temporary modifiers
    private modifers: EntityModifers;
    
    // Entity upgrades
    private _currentUpgrade: number;
    public get currentUpgrade() { return this._currentUpgrade };

    // Upgrade data table
    private _upgradeData: EntityUpgrade[];
    public get upgradeData() { return this._upgradeData };

    /**
     * Constructs an Entity
     * 
     * Initializes Entity with base stats and sets starting health
     * Health is capped at a maximum value
     * 
     * @param view The game view to reference
     * @param stats Base entity stats that include health, speed, and regeneration
     */
    constructor (
        view: View,
        stats: { health: number; speed: number }
    ) {
        this.parentView = view;
        this._stats = stats;
        this._maxHealth = stats.health;
        this._health = stats.health;
    }

    /**
     * Sets Entity end position to traverse toward
     * @param x The x coordinate on the world map
     * @param y The y coordinate on the world map
     */
    public walkToPosition(x : number, y : number) : void {
        this.walkingTo = [x,y];
    }

    // Placeholder : returns closest entity
    public getClosestEntity() : Entity | null {
        return null;
    }

    // Placeholder : returns closest targetable entity
    public getClosestTargetableEntity() : Entity | null {
        return null;
    }

    /**
     * Sets Entity position instantly
     * @param x the x coordinate on the world map
     * @param y the y coordinate on the world map
     */
    public setPosition(x : number, y : number) : void {
        this.position = [x,y];
    }

    /**
     * Placeholder : Entity state
     * @param state 
     */
    public setState(state : string) : void {
        
    }
    
    /**
     * Sets the Entity health
     * @param value The value to set Entity health to
     */
    public setHealth(value: number): void {
        // Math.min caps health at maximum
        // Math.max prevents health from going negative
        this._health = Math.max(0, Math.min(value, this._maxHealth));
    
        // Entity is dead if health reaches 0
        if (this._health == 0) {
            this.onDeath();
        }
    }

    /**
     * Applies damage to an Entity
     * @param damage The damage to apply
     * @returns If the entity dies
     */
    public takeDamage(damage : number) : void {
        if (!this.isAlive) {
            return;
        }

        // Removes damage number from Entity health
        this.setHealth(this._health - damage);
    }

    /**
     * Heal entity without exceeding max health
     * @param amount The amount to heal the Entity
     */
    public heal(amount: number): void {
        // Math.min is used to cap the Entity health so it does not exceed the max health
        this._health = Math.min(this._health + amount, this._maxHealth);
    }

    // Checks if the Entity is alive
    public isAlive(): boolean {
        return this._health > 0;
    }

    // Called when Entity health reaches 0
    public onDeath(): void {
        // placeholder : override for subclasses
    }
}