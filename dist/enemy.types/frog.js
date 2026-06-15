import { EnemyEntity } from "../enemyEntity";
export class Frog extends EnemyEntity {
    isLeaping;
    canLeap = true;
    constructor(view, waveNumber) {
        const STATS = {
            health: 1,
            speed: 0.8
        };
        super(view, STATS, waveNumber, 1.15);
        this.setDrops({
            coins: 123,
            points: 1,
            materialDropRate: {
                'jar': 1
            }
        });
    }
    spawn(x, y) {
        this.setPosition(x, y);
    }
}
//# sourceMappingURL=frog.js.map