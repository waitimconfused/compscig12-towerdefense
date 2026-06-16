import Inventory, { InventoryItemTag } from "../inventory.js";
import { Position2D } from "../types.js";
import { Wave } from "../wave.js";
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

	public static path = "M0 50.0634C311.161 43.5073 285.567 549.586 561.679 457.548C837.79 365.511 1133.82 328.192 1160.05 573.793C1186.27 819.393 693.305 992.373 577.06 751.311C460.816 510.249 486.752 130.908 881.377 115.526C1276 100.145 1478.86 273.376 1553.5 492.5C1613.21 667.8 1797.04 726.431 1900 700.88"

    // Ensures enemies WILL have stats
	declare public stats: EnemyEntityStats;

    // Enemy base stats
	public static override baseStats: EnemyEntityStats;
    
    protected disableWalking:boolean = false;
    protected currentPath:SVGPathElement|null = null;
    protected currentPathLength:number = 0;
    protected currentPathMaxProgress:number = 0;

    public override reloadStats(): void {
        super.reloadStats();
    
        let waveNumber = Wave.getWave();
        let scale = Math.pow(1.10, waveNumber - 1);
    
        this.stats.health = Math.floor(this.stats.health * scale);
    }

    /**
     * Changes enemy state to dead on death and calculates rewards
     * 
     * @returns Coins, points, and materials enemies drop on death
     */
	public onDeath() : void {  
        this.state = 'dead';

        this.dropItems();
	}
    
    /**
     * Drops items and gives the player materials
     */
    protected dropItems() : void {
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

    protected abstract brainHelper(interrupt: ()=> void) : Promise<void>;
}