import { EnemyEntity } from "../enemyEntity";
import { DefenderEntity } from "../defenderEntity";
import { View } from "../view";

class Raccoon extends EnemyEntity {
    private stunDuration: number = 5;
    private attackChance: number = 0.2;

    constructor(view: View, waveNumber: number) {
        const STATS = {
            health: 200,
            speed: 0.5,
            regeneration: 0
        };

        super(view, STATS, waveNumber, 1.20);
    }

    public spawn(x : number, y : number): void {
        this.setPosition(x,y);
    }

    public attemptAttack(target : DefenderEntity): void {
        if (!target) {
            return;
        }

        let chance = Math.random();

        if (chance < this.attackChance) {
            target.takeDamage(20);
            target.stun(this.stunDuration);
        }
    }

    public killDefender(): void {
        this.regen(1, 5);
    }

    public raccoonDeath(): void {

    }

    public setStunDuration(value: number): void {
        this.stunDuration = value;
    }

    public setAttackChance(value: number): void {
        this.attackChance = value;
    }
}

export { Raccoon };