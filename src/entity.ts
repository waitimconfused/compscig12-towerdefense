import { View } from "./view";

type EntityModifiers = {
    speed : number,
    damage : number,
    shield : number
}

type EntityUpgrade = {
    [statName : string] : number;
}

class Entity {
    private parentView : View;

    private walkingTo : [number, number];
    private position : [number, number];

    private health : number;
    private readonly maxHealth : number;

    private readonly stats : { health : number, speed : number, regeneration : number }

    private modifiers : EntityModifiers;

    private currentUpgrade : number;
    private readonly upgradeData : EntityUpgrade[];

    constructor (
        view : View,
        stats : { health : number, speed : number, regeneration : number},
        upgrades : EntityUpgrade[],
        modifiers : EntityModifiers
    ) {
        this.parentView = view;
        this.stats = stats;
        this.modifiers = modifiers;
        this.maxHealth = stats.health;
        this.health = stats.health;
        this.position = [0,0];
        this.walkingTo = [0,0];
        this.upgradeData = upgrades;
        this.currentUpgrade = 0;
    }

    public setPosition(x : number, y : number) : void{
        this.position = [x,y];
    }

    public walkToPosition(x : number, y : number) : void{
        this.walkingTo = [x,y];
    }

    public getPosition() : [number, number] {
        return this.position;
    }

    public setState(state : string) : void {

    }

    public takeDamage(amount : number) : void {
        this.health -= amount;
    }

    public getHealth() : number {
        return this.health;
    }

    public getClosestEntity() : Entity | null {
        return null;
    } 

    public getClosestTargetableEntity() : Entity | null {
        return null;
    }
}

export { Entity };