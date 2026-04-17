import { EnemyEntity } from "../enemyEntity";
import { View } from "../view";

/**
 * Creates an Ant as an EnemyEntity
 * 
 * Ants are low health enemies that deal damage and spawn in clusters
 * Vulnerable to AOE, health increases every wave by 10%
 */
class Ant extends EnemyEntity {
    // Applied to AOE damage attacks
    private aoeVulnerability : number = 0.25;

    /**
     * Constructs an Ant enemy
     * @param view The game view to reference
     * @param waveNumber Current wave number
     */
    constructor(view: View, waveNumber: number) {
        const STATS = {
            health : 10,
            speed : 0.7,
            regeneration : 0
        }

        super(view, STATS, waveNumber, 1.1);
    }

    /**
     * Spawns ant at given position
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
            finalDamage += finalDamage * this.aoeVulnerability;
        }

        super.takeDamage(finalDamage);
    }
}

export {Ant};