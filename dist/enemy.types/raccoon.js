import { EnemyEntity } from "../enemyEntity.js";
export class Raccoon extends EnemyEntity {
    constructor(view, waveNumber) {
        const STATS = {
            health: 200,
            speed: 0.5,
        };
        super(view, STATS, waveNumber, 1.20);
        this.setDrops({
            coins: 1,
            points: 2,
            materialDropRate: {
                'wood': 0.3,
                'jar': 0.3
            }
        });
    }
    spawn(x, y) {
        this.setPosition(x, y);
    }
    attemptAttack(target) {
        let chance = Math.random();
        if (chance <= 0.2) {
            target.takeDamage(20);
            target.stun(5);
        }
    }
    killDefender() {
        this.regen(2, 5);
    }
}
//# sourceMappingURL=raccoon.js.map