import { Entity } from "./entity.js";
import { View } from "./view.js";

type EnemyDrops = {
    coins: number;
    points: number;
    materialDropRate: { [material: string]: number };
};

/**
 * Class for all enemy entities
 * 
 * Handles wave scaling
 */
export class EnemyEntity extends Entity {
    // Current wave enemy is spawned in
    private waveNumber: number;

    // Whether enemy is stunned or not
    private stunned: boolean = false;
   
    // Regen interval ID
    private regenInterval: number | null = null;

    // Stun interval ID
    private stunTimeout: number | null = null;

    // Loot dropped from enemies on death
    private drops: EnemyDrops = {
        coins: 0,
        points: 0,
        materialDropRate: {}
    };
    
    /**
     * Constructs an EnemyEntity
     * 
     * Applies wave-based health scaling and initializes enemy stats
     * 
     * @param view The game view to reference
     * @param stats Base enemy stats that include health, speed, regeneration
     * @param waveNumber Current wave number for scaling health
     * @param healthScale Multiplier applied to health scaling
     */
    constructor(
        view: View,
        stats: { health: number; speed: number },
        waveNumber: number,
        healthScale: number
    ) {
        // Multiplies health scale by the current wave (every wave after the first wave)
        // Scales newly created enemies with the new increased health
        const SCALED_HEALTH = Math.floor(
            stats.health * (healthScale ** (waveNumber - 1))
        );
    
        super(view, {
            health: SCALED_HEALTH,
            speed: stats.speed,
        });
    
        this.waveNumber = waveNumber;
    }

    /**
     * Returns whether enemy is currently stunned
     * @returns True if enemy is stunned, otherwise false
     */
    public isStunned(): boolean {
        return this.stunned;
    }

    /**
     * Gets the wave number the enemy was spawned in
     * @returns Wave number
     */
    public getWaveNumber(): number {
        return this.waveNumber;
    }

    /**
     * Gets the enemy movement speed from stats
     * @returns Speed value
     */
    public getSpeed(): number {
        return this.stats.speed;
    }
    
    /**
     * Applies stun effect for a given duration
     * @param duration Time in seconds that the enemy is stunned for
     */
    public stun(duration: number): void {
        this.stunned = true;
    
        if (this.stunTimeout) {
            clearTimeout(this.stunTimeout);
        }
    
        this.stunTimeout = setTimeout(() => {
            this.stunned = false;
            this.stunTimeout = null;
        }, duration * 1000);
    }
    
    /**
     * Tick function for regeneration
     * @param hpPerSecond Amount of hp restored every second
     * @returns If the enemy is dead or stunned
     */
    private regenTick(hpPerSecond: number): void {
        if (!this.isAlive()) return;
        if (this.stunned) return;
    
        this.heal(hpPerSecond);
    }
    
    /**
     * Regenerates enemy hp per second
     * @param hpPerSecond Amount of hp restored every second
     * @param duration The duration of regeneration in seconds
     */
    public regen(hpPerSecond: number, duration: number): void {
        // Initializes total time as 0
        let totalTime = 0;
    
        // Clears interval if enemy is not regenerating
        if (this.regenInterval != null) {
            clearInterval(this.regenInterval);
        }
    
        // Creates a new regeneration interval
        // Regenerates every second (1000ms)
        this.regenInterval = setInterval(() => {
            // Checks if total time has exceeded duration or the enemy is dead
            if (totalTime >= duration || !this.isAlive()) {
                // Clears regeneration, timer, and returns
                clearInterval(this.regenInterval!);
                this.regenInterval = null;
                return;
            }
    
            this.regenTick(hpPerSecond);
    
            totalTime++;
        }, 1000);
    }

    /**
     * Sets the unique enemy drops
     * @param drops Possible drops
     */
    public setDrops(drops: EnemyDrops): void {
        this.drops = drops;
    }

    // Placeholder : Handles drops after enemy dies
    private handleDrops(): void {

    }
    
    // Called when an enemy dies
    public override onDeath(): void {
        // Clears enemy stun and regeneration if the effects are still active
        if (this.stunTimeout != null) {
            clearTimeout(this.stunTimeout);
            this.stunTimeout = null;
        }
        
        if (this.regenInterval != null) {
            clearInterval(this.regenInterval);
            this.regenInterval = null;
        }

        // Triggers drop handling
        this.handleDrops();
    }
}