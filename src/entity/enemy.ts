import { Player } from "../player.js";
import { Position2D } from "../types.js";
import { Entity } from "./entity.js";

export type EnemyDrops = {
    coins : number,
    points : number,
    materials : { [key : string] : number }
}

export abstract class EnemyEntity extends Entity {
	protected waveNumber : number;
    protected healthScale : number;

    // Kenneth can figure this out haha
    // protected path : Position2D[];

    protected abstract drops : EnemyDrops;

	public die() {
        
		this.state = "dead";

		for (let item in this.drops.materials) {
			let probability : number = this.drops.materials[item] as number;

            if (Math.random() <= probability) {
                
            }
		}

	}

    protected giveReward(coins : number, points : number) : void {
        
    }
}