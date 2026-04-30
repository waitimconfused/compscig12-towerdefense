import { EnemyEntity } from "../enemyEntity.js";
import { DefenderEntity } from "../defenderentity.js";
import { View } from "../view.js";
import { RenderingContext } from "../types.js";

/**
 * Creates a Raccoon as an EnemyEntity
 * 
 * Raccoons are high hp enemies that deal damage and randomly attack and stun defenders on the path
 */
export class Raccoon extends EnemyEntity {
    // Duration in seconds that defender is stunned for when hit
    //private stunDuration: number = 5;
    
    // Probability of attacking with each attempt
    // 20% chance of attacking
    //private attackChance: number = 0.2;

    /**
     * Constructs a Raccoon enemy
     * @param view The game view to reference
     * @param waveNumber Current wave number
     */
    constructor(view: View, waveNumber: number) {
        const STATS = {
            health: 200,
            speed: 0.5,
        };

        super(view, STATS, waveNumber, 1.20);

        this.setDrops({
            coins : 1,
            points : 2,
            materialDropRate : {
                'wood' : 0.3,
                'jar' : 0.3
            }
        })
    }

    /**
     * Attempts to attack a defender
     * @param target The DefenderEntity to attack
     */
    public attemptAttack(target : DefenderEntity): void {
        // Generates a random number from 0-0.99...........
        let chance = Math.random();

        // Deals 20 damage and stuns if the chance is lower than or equal to 20% (0.2)
        if (chance <= 0.2) {
            target.takeDamage(20);
            target.stun(5);
        }
    }

    // Triggers short regeneration effect when Raccoon kills a defender
    public killDefender(): void {
        this.regen(2, 5);
    }

    public override render(canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteReference : string;

        switch (this.state) {
            case 'idle':
                spriteReference = 'raccoon-idle';
                break;

            case 'run':
                spriteReference = 'raccoon-run';
                break;
        
            case 'attack':
                spriteReference = 'raccoon-attack';
                break;
                
            default:
                break;
        }   
    }
}