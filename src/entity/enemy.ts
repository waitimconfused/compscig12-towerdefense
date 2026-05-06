import { Player } from "../player.js";
import { Position2D } from "../types.js";
import { Entity } from "./entity.js";

export type MaterialType = 'jar' | 'wood' | 'honey' | 'glassLemonade'

export type MaterialDrop = {
    type : MaterialType,
    amount : number;
}

export type EnemyDrops = {
    coins: number;
    points: number;
    materials: {
        type: MaterialType;
        chance: number;
        amount: number;
    }[];
}

export abstract class EnemyEntity extends Entity {
	protected waveNumber : number;
    protected healthScale : number;
    protected abstract drops : EnemyDrops;

    /**
     * Changes enemy state to dead on death
     * Handles drops for enemy death
     * 
     * @returns Coins, points, and materials enemies drop on death
     */
	public die() {  
        this.state = 'dead';

        // Initializes an empty array to store materials
        let dropsOnDeath : MaterialDrop[] = [];

        // Loops through all materials of the enemy
        for (let drop of this.drops.materials) {
            // Checks if material drops on enemy death
            if (Math.random() <= drop.chance) {
                // Pushes material and drop amount and stores it in the dropsOnDeath array
                dropsOnDeath.push({
                    type : drop.type,
                    amount : drop.amount
                })
            }
        }

        return {
            coins : this.drops.coins,
            points : this.drops.points,
            materials : dropsOnDeath
        }
	}
}