import { Entity } from "./entity";

/**
 * Class to handle status effects of entities
 */
export class StatusEffects {
    /**
     * 
     * @param target 
     * @param duration 
     * @returns 
     */
    public async stun(target : Entity, duration : number) : Promise<void> {

        if (target.stunned) {
            return;
        }

        target.stunned = true;
        
        target.interruptTimers(
            null, {
                interrupt_type : 'stunned'
            }
        );

        target.stopMovement();

        await target.wait(duration);

        target.stunned = false;
        target.state = 'idle';
    }

    public regen() : void {

    }
}