import { DefenderEntity } from "./defender";
import { EnemyEntity } from "./enemy";
import { Entity } from "./entity";

export class StatusEffects {

    public async stun(attacker : Entity, duration : number) : Promise<void> {

        

        await attacker.wait(duration);

        attacker.interruptTimers(
            null, {
            triggered_by : attacker,
            interrupt_type : 'attacked'
            }
        );
    }

    public regen() : void {

    }
}