import { View } from "../view";
import { EnemyEntity } from "../enemyEntity";
import { DefenderEntity } from "../defenderentity";

export class Wasp extends EnemyEntity {
    
    private flying : boolean;
    private speedMultiplier : number;
    private stunChance : number;
    private stunDuration : number;

    constructor(view : View, waveNumber : number) {
        const STATS = {
            health : 30,
            speed : 1.1,
        }

        super(view, STATS, waveNumber, 1.15);
    }

    public spawn(x : number, y : number) {
        this.setPosition(x,y);
    }

    public attemptStun(target : DefenderEntity) {
        let chance = Math.random();

        if (chance <= 0.35) {
            target.takeDamage(10);
            target.stun(2);

            this.stats.speed += 0.1;
        }
    }
}