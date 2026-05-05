import { Position2D } from "../types.js";
import { Entity } from "./entity.js";

type EnemyDrops = {
    coins : number,
    points : number,
    materials : { [key : string] : number }
}

export abstract class EnemyEntity extends Entity {
	protected waveNumber : number;
    protected healthScale : number;

    // Kenneth can figure this out haha
    // protected path : Position2D[];

    protected drops : EnemyDrops = {
        coins : 0,
        points : 0,
        materials : {}
    }

    constructor(position : Position2D, waveNumber : number) {
        super(position);

        // someone should add some sort of path system with position 2d
        // all enemies will follow the path from left to right maybe???

        this.waveNumber = waveNumber
        this.stats.health = this.stats.health * (this.healthScale ** (waveNumber - 1))
    }

    protected giveReward(coins : number, points : number) : void {
        // add coins and points after player interface created
    }
};