import { Entity } from "./entity";
import { View } from "./view";

type EnemyDrops = {
    coins : number,
    points : number,
    materialDropRate : {[material : string] : number}
}

class EnemyEntity extends Entity {
    private waveNumber : number;
    private disabled : boolean = false;
    private speed : number;
    private healthScale : number;

    constructor (
        view : View,
        stats : {health : number, speed : number, regeneration : number},
        waveNumber : number,
        healthScale : number
    ) {
        const HEALTH_INCREASE = Math.floor(stats.health * (healthScale ** (waveNumber - 1)))
        const STAT_SCALE = {
            health : HEALTH_INCREASE,
            speed : stats.speed,
            regeneration : stats.regeneration
        }
        super(view, STAT_SCALE);

        this.waveNumber = waveNumber;
        this.healthScale = healthScale;
        this.speed = stats.speed;
        this.disabled = false;
    }

    public getSpeed() : number {
        return this.speed;
    }

    public setSpeed(speedValue : number) : void {
        this.speed = speedValue;
    }

    public stun(duration : number) : void {
        this.disabled = true;

    }

    public regen(hpPerSecond : number, duration : number) : void {
        let time = 0;

    }

    public heal(amount : number) : void {

    }

    public enemyDamaged() : void {
        
    }

    private enemyDeath() : void {

    }

    public getWaveNumber() : number {
        return this.waveNumber;
    }
}

export {EnemyEntity};