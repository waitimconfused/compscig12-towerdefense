import { EnemyEntity } from "../enemyEntity";
import { DefenderEntity } from "../defenderEntity";
import { View } from "../view";

/**
 * Creates a Raccoon as an EnemyEntity
 * 
 * Raccoons are high hp enemies that deal damage and randomly attack and stun defenders on the path
 */
class Raccoon extends EnemyEntity {
    // Duration in seconds that defender is stunned for when hit
    private stunDuration: number = 5;
    
    // Probability of attacking with each attempt
    // 20% chance of attacking
    private attackChance: number = 0.2;

    /**
     * Constructs a Raccoon enemy
     * @param view The game view to reference
     * @param waveNumber Current wave number
     */
    constructor(view: View, waveNumber: number) {
        const STATS = {
            health: 200,
            speed: 0.5,
            regeneration: 0
        };

        super(view, STATS, waveNumber, 1.20);
    }

    /**
     * Spawns Raccoon at given position
     * @param x The x coordinate on the world map
     * @param y The y coordinate on the world map
     */
    public spawn(x : number, y : number): void {
        this.setPosition(x,y);
    }

    /**
     * Attempts to attack a defender
     * @param target The DefenderEntity to attack
     */
    public attemptAttack(target : DefenderEntity): void {
        // Generates a random number from 0-0.99...........
        let chance = Math.random();

        // Deals 20 damage and stuns if the chance is lower than or equal to 20% (0.2)
        if (chance <= this.attackChance) {
            target.takeDamage(20);
            target.stun(this.stunDuration);
        }
    }

    // Triggers short regeneration effect when Raccoon kills a defender
    public killDefender(): void {
        this.regen(2, 5);
    }

    //
    public override onDeath(): void {
        
    }
}

export { Raccoon };