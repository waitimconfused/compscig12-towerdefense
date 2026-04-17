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

class Entity {
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
    private _stats: { health : number, speed : number, regeneration : number };
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
     * 
     * @param view 
     * @param stats 
     */
    constructor (
        view: View,
        stats: { health: number; speed: number; regeneration: number }
    ) {
        this.parentView = view;
        this._stats = stats;
        this._maxHealth = stats.health;
        this._health = stats.health;
    }

    public walkToPosition(x : number, y : number) : void {
        this.walkingTo = [x,y];
    }

    public getClosestEntity() : Entity | null {
        return null;
    }

    public getClosestTargetableEntity() : Entity | null {
        return null;
    }

    public setPosition(x : number, y : number) : void {
        this.position = [x,y];
    }

    public setState(state : string) : void {
        
    }
    
    public setHealth(value: number): void {
        this._health = Math.max(0, Math.min(value, this._maxHealth));
    
        if (this._health === 0) {
            this.onDeath();
        }
    }

    public takeDamage(damage : number) : void {
        if (!this.isAlive) {
            return;
        }

        this.setHealth(this._health - damage);
    }

    public heal(amount: number): void {
        this._health = Math.min(this._health + amount, this._maxHealth);
    }

    public isAlive(): boolean {
        return this._health > 0;
    }

    public onDeath(): void {

    }
}

export { Entity };