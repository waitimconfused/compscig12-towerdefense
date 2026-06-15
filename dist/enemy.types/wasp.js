import { EnemyEntity } from "../enemyEntity";
export class Wasp extends EnemyEntity {
    isFlying = true;
    constructor(view, waveNumber) {
        const STATS = {
            health: 30,
            speed: 1.1,
        };
        super(view, STATS, waveNumber, 1.15);
        this.setDrops({
            coins: 1,
            points: 1,
            materialDropRate: {
                'Fake Honey': 0.25
            }
        });
    }
    spawn(x, y) {
        this.setPosition(x, y);
    }
    attemptStun(target) {
        let chance = Math.random();
        if (chance <= 0.35) {
            target.takeDamage(10);
            target.stun(2);
            this.stats.speed += 0.1;
        }
    }
}
//# sourceMappingURL=wasp.js.map