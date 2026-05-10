import { Frog } from "./enemy.types/frog";
import { Entity } from "./entity";

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
    public static async regenEntity(regeneratingEntity : Entity, duration : number, regenerationAmount : number) : Promise<void> {
        if (regeneratingEntity.currentRegenStacks >= 3) {
            return;
        }

        regeneratingEntity.currentRegenStacks++;

        // Initializes tick rate and total time count
        const TICK_RATE : number = 500;
        let totalTime : number = 0;
        
        // Regenerates entity as long as the total time is less than duration
        while (totalTime < duration) {
            // Checks if entity is dead, breaks loop and removes all regen stacks
            if (regeneratingEntity.stats.health <= 0) {
                regeneratingEntity.currentRegenStacks = 0;
                break;
            }

            // Adds the regeneration amount to the entity's health stat
            // Gets the lower value of the increased health and maximum health
            // (Entity cannot exceed its maximum health)
            regeneratingEntity.stats.health = Math.min(regeneratingEntity.stats.health + regenerationAmount, regeneratingEntity.stats.max_health);

            // Delay by tick rate
            await regeneratingEntity.wait(TICK_RATE);

            totalTime += TICK_RATE;
        }

        regeneratingEntity.currentRegenStacks--;
    }

    public static async slowEntity(target : Entity, duration : number) : Promise<void> {
        let constructor = target.constructor as typeof Entity;
        if (!constructor.upgrades[0]) {
            return;
        }

        target.slowStacks++;

        let thisSlowStacks : number = target.slowStacks;

        if (target instanceof Frog) {
            // disable frog jump when leap method created
        }

        if (!target.slowed) {
            target.slowed = true;
        }

        
        await target.wait(duration);
        
        // Removes slow if stack is the last one applied to the entity
        if (thisSlowStacks == target.slowStacks) {
            target.stats.speed = target.stats.speed = constructor.upgrades[0].speed;;
            target.slowed = false;
        }
    }
}