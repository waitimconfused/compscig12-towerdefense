import { Frog } from "./enemy.types/frog";
import { Entity, EntityStats } from "./entity";

/**
 * Class to handle status effects of entities
 */
export class StatusEffects {
    /**
     * Stuns the target entity for a specified duration
     * Stunned enemies cannot perform any actions
     * @param target The entity to stun
     * @param duration How long the target entity is stunned for
     * @returns If target is already stunned
     */
    public static async stunEntity(target : Entity, duration : number) : Promise<void> {

        // Target can only be stunned once for the duration of the stun
        if (target.stunned) {
            return;
        }

        target.stunned = true;
        
        // Interrupts entity timers
        target.interruptTimers(
            null, {
                interrupt_type : 'stunned'
            }
        );

        // Target is stunned until duration ends
        await target.wait(duration);

        // Reset target states
        target.stunned = false;
        target.state = 'idle';
    }

    /**
     * Regenerates an Entity's health by a specified amount and duration
     * Regeneration can be applied to an Entity for a maximum of 3 stacks (3 times)
     * @param regeneratingEntity The entity to regenerate
     * @param duration How long the entity regenerates for
     * @param regenerationAmount The amount the entity regenerates every tick (100ms)
     * @returns If Entity has more than 3 regeneration stacks
     */
    public static async regenerateEntity(regeneratingEntity : Entity, duration : number, regenerationAmount : number) : Promise<void> {
        if (regeneratingEntity.currentRegenerationStacks >= 3) {
            return;
        }

        regeneratingEntity.currentRegenerationStacks++;

		let regeneratingEntityConstructor = regeneratingEntity.constructor as typeof Entity;

        // Initializes tick rate and total time count
        const TICK_RATE : number = 500;
        let totalTime : number = 0;
        
        // Regenerates entity as long as the total time is less than duration
        while (totalTime < duration) {
            // Checks if entity is dead, breaks loop and removes all regeneration stacks
            if (regeneratingEntity.stats.health <= 0) {
                regeneratingEntity.currentRegenerationStacks = 0;
                break;
            }

			let level = regeneratingEntityConstructor.level;
			let currentUpgrade = regeneratingEntityConstructor.baseStats as EntityStats;

            // Adds the regeneration amount to the entity's health stat
            // Gets the lower value of the increased health and maximum health
            // (Entity cannot exceed its maximum health)
            regeneratingEntity.stats.health = Math.min(
				regeneratingEntity.stats.health + regenerationAmount,
				currentUpgrade.health
			);

            // Delay by tick rate
            await regeneratingEntity.wait(TICK_RATE);

            totalTime += TICK_RATE;
        }

        regeneratingEntity.currentRegenerationStacks--;
    }

    public static async slowEntity(target : Entity, duration : number) : Promise<void> {
        let constructor = target.constructor as typeof Entity;
        if (!constructor.baseStats) {
            return;
        }

        target.slowStacks++;
        
        target.slowed = true;

        if (target.slowStacks == 1) {
            target.stats.speed *= 0.75;
        }
        
        if (target.entityType == 'enemy/frog') {
            (target as Frog).canLeap = false;
        }
        
        await target.wait(duration);

        target.slowStacks--;

        // Removes slow if stack is the last one applied to the entity
        if (target.slowStacks <= 0) {
            target.stats.speed = constructor.baseStats.speed;;
            target.slowed = false;

            if (target.entityType == 'enemy/frog') {
                (target as Frog).canLeap = true;
            }
        }
    }
}