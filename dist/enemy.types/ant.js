import { EnemyEntity } from "../enemyEntity.js";
export class Ant extends EnemyEntity {
    constructor(view, waveNumber) {
        const STATS = {
            health: 10,
            speed: 0.7,
        };
        super(view, STATS, waveNumber, 1.1);
        this.setDrops({
            coins: 1,
            points: 2,
            materialDropRate: {
                'wood': 0.2,
                'glass': 0.2
            }
        });
    }
    spawn(x, y) {
        this.setPosition(x, y);
    }
    attackClosest() {
        const DEFENDER = this.getClosestTargetableEntity();
        if (!DEFENDER)
            return;
        DEFENDER.takeDamage(2);
    }
    killDefender() {
        this.regen(1, 2);
    }
    takeDamage(damage, isAOE = false) {
        let finalDamage = damage;
        if (isAOE) {
            finalDamage += finalDamage * 0.25;
        }
        super.takeDamage(finalDamage);
    }
}
//# sourceMappingURL=ant.js.map