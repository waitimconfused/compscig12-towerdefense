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

export abstract class EnemyEntity extends Entity {
	protected waveNumber : number;
    protected abstract healthScale : number;
    protected abstract drops : EnemyDrops;
    protected spawnLocation : Position2D = [0,0];

	public static override upgrades: EnemyEntityStats[];

    /**
     * Changes enemy state to dead on death and calculates rewards
     * 
     * @returns Coins, points, and materials enemies drop on death
     */
	public die() {  
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
    
    public increaseHealth() : void {
        let constructor = this.constructor as typeof EnemyEntity;
        let upgrades = constructor.upgrades[0];

        if (!upgrades) {
            return;
        }

        this.stats.health *= Math.pow(this.healthScale, this.waveNumber);
    }
}

export class TileController {
    protected _canvas : HTMLCanvasElement;
    protected _ctx : CanvasRenderingContext2D;
    protected _tileColour : string;

    protected _tile : EnemyEntity;

    public get tile() : EnemyEntity { return this._tile };
    public get tileColour() : string { return this._tileColour };
    public get x() : number { return 1 };
    public get y() : number { return 1 };
    public get width() : number { return 1 };
    public get height() : number { return 1 };
    


}