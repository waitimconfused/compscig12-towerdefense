import Inventory, { InventoryItemTag } from "../inventory.js";
import { Position2D } from "../types.js";
import { Entity, EntityStats } from "./entity.js";

export type MaterialType = 'jar' | 'wood' | 'honey' | 'glassLemonade'

export type MaterialDrop = {
    type : MaterialType,
    amount : number;
};

export type EnemyDrops = {
    coins: number;
    points: number;
    materials: {
        type: InventoryItemTag;
        chance: number;
        amount: number;
    }[];
};

export interface EnemyEntityStats extends EntityStats {
	/**
	 * the entity's spawn cool-down
	 */
	spawnCoolDown : number;

	/**
	 * the entity's attack cool-down
	 */
	attackCoolDown : number;
};

/**
 * Enemy entities can drop items, spawn, have stats, and die
 */
export abstract class EnemyEntity extends Entity {
    // Enemies have different drops
    protected abstract drops : EnemyDrops;

    // Enemy spawm location
    protected spawnLocation : Position2D = [0,0];

    // Ensures enemies WILL have stats
	declare public stats: EnemyEntityStats;

    // Enemy base stats
	public static override baseStats: EnemyEntityStats;

    /**
     * Changes enemy state to dead on death and calculates rewards
     * 
     * @returns Coins, points, and materials enemies drop on death
     */
	public onDeath() {  
        this.state = 'dead';

        this.dropItems();
	}
    
    protected dropItems() {
		// Add the predetermined coins & points to the inventory
		Inventory.give("coin", this.drops.coins);
		Inventory.give("point", this.drops.points);

        // Loops through all materials of the enemy
        for (let drop of this.drops.materials) {
            
			// Checks if material drops on enemy death
            if (Math.random() <= drop.chance) {
                
				// Add the item (and amount) to the inventory
				Inventory.give(drop.type, drop.amount);
            }
        }
    }
}