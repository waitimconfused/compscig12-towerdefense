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
    private parentView: View
    
    public position : Position2D = [ 0, 0 ];
    private walkingTo : Position2D = [ 0, 0 ];
    
    private _health: number;
    public get health() { return this._health };
    private _maxHealth: number;
    public get maxHealth() { return this._maxHealth };
    
    private _stats: { health : number, speed : number, regeneration : number };
    public get stats() { return this._stats };
    
    private modifers: EntityModifers;
    
    private _currentUpgrade: number;
    public get currentUpgrade() { return this._currentUpgrade };

    private _upgradeData: EntityUpgrade[];
    public get upgradeData() { return this._upgradeData };

    constructor (
        view: View,
        stats: { health: number; speed: number; regeneration: number }
    ) {
        this.parentView = view;
        this._stats = stats;
        this._maxHealth = stats.health;
        this._health = stats.health;
    }

    public setPosition(x : number, y : number) : void {
        this.position = [x,y];
    }

    public walkToPosition(x : number, y : number) : void {
        this.walkingTo = [x,y];
    }

    public setState(state : string) : void {
        
    }

    public takeDamage(damage : number) : void {
        
    }

    public getClosestEntity() : Entity | null {
        return null;
    }

    public getClosestTargetableEntity() : Entity | null {
        return null;
    }

    public heal(amount: number): void {
        this._health = Math.min(this._health + amount, this._maxHealth);
    }

    public setHealth(value: number): void {
        this._health = Math.max(0, Math.min(value, this._maxHealth));
    
        if (this._health === 0) {
            this.onDeath();
        }
    }

    public isAlive(): boolean {
        return this._health > 0;
    }

    public onDeath(): void {

    }
}

export { Entity };