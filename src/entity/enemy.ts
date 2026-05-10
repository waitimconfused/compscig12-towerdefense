import { Player } from "../player.js";
import { Position2D } from "../types.js";
import { Entity, EntityStats } from "./entity.js";

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
    protected spawnLocation : Position2D = [0,0];

    /**
     * Changes enemy state to dead on death and calculates rewards
     * 
     * @returns Coins, points, and materials enemies drop on death
     */
	public die() {  
        this.state = 'dead';

        this.calculateRewards();
	}
    
    protected calculateRewards() {
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
    
    private increaseHealth() : void {
        let constructor = this.constructor as typeof EnemyEntity;
        let upgrades = constructor.upgrades[0];

        if (!upgrades) {
            return;
        }

        this.stats.max_health += upgrades.max_health + 50 * this.waveNumber;
        this.stats.health += upgrades.health + 50 * this.waveNumber;
    }
}