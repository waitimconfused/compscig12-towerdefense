import { EnemyEntity } from "../enemyEntity.js";
import { SpriteRenderer } from "../sprites.js";
import { Position2D, RenderingContext } from "../types.js";
import { View } from "../view.js";

/**
 * Creates an Ant as an EnemyEntity
 * 
 * Ants are low health enemies that deal damage and spawn in clusters
 * Vulnerable to AOE, health increases every wave by 10%
 */
export class Ant extends EnemyEntity {
    /**
     * Constructs an Ant enemy
     * @param view The game view to reference
     * @param waveNumber Current wave number
     */
    constructor(view: View, waveNumber: number) {
        const STATS = {
            health : 10,
            speed : 0.7,
        }

        super(view, STATS, waveNumber, 1.1);

        this.setDrops({
            coins : 1,
            points : 2,
            materialDropRate : {
                'wood' : 0.2,
                'glass' : 0.2
            }
        })
    }

    /**
     * Spawns Ant at given position
     * @param x The x coordinate on the world map
     * @param y The y coordinate on the world map
     */
    public spawn(x: number, y : number) : void {
        this.setPosition(x,y);
    }

    /**
     * Attacks the closest defender in range
     * @returns If there is no defender in range
     */
    public attackClosest() : void {
        // placeholder
        const DEFENDER = this.getClosestTargetableEntity();
        if (!DEFENDER) return;

        // Deals 2 damage to the defender
        DEFENDER.takeDamage(2);
    }

    // Triggers short regeneration effect when Ant kills a defender
    public killDefender() : void {
        this.regen(1,2);
    }

    /**
     * Overrides base damage taken to apply aoeVulnerability
     * Initializes isAOE as false
     * @param damage The incoming damage
     * @param isAOE Whether the attack is AOE or not
     */
    public override takeDamage(damage : number, isAOE : boolean = false) : void {
        // Initializes the final damage as incoming damage
        let finalDamage = damage;

        // Increases damage dealth to Ant by 25% if attack is AOE
        if (isAOE) {
            finalDamage += finalDamage * 0.25;
        }

        super.takeDamage(finalDamage);
    }

    public override render (canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteReference : string = '';

        switch (this.state) {
            case 'idle':
                spriteReference = 'ant-idle';
                break;

            case 'run':
                spriteReference = 'ant-run';
                break;

            case 'attack':
                spriteReference = 'ant-attack';
                break;

            default:
                break;
        }

        SpriteRenderer.drawSprite({
            name: spriteReference,
            position: this.position,
            size: [ 0, 0 ]
        }, context,)
    }
}