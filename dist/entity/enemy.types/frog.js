import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { Carrier } from "../other/carrier.js";
export class Frog extends EnemyEntity {
    entityType = "enemy/frog";
    static baseStats = {
        health: 75,
        speed: 0.1,
        damage: 20,
        knockBack: 10,
        spawnCoolDown: 10,
        attackCoolDown: 10,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0
    };
    isLeaping;
    canLeap = true;
    drops = {
        coins: 5,
        points: 10,
        materials: [
            { type: 'jar', chance: 0.3, amount: 1 }
        ]
    };
    async brain() {
        let entities = Entity.totalEntitiesInRange(this, Infinity, DefenderEntity);
        let target;
        for (let i = 0; i < entities.length; i++) {
            if (entities[i] instanceof Carrier) {
                target = entities[i];
                break;
            }
        }
        if (!target)
            return;
        await this.walkToEntity(target);
        await this.wait(500);
        this.attackEntity(target);
    }
    async brainHelper(interrupt) {
        interrupt();
        return;
    }
}
//# sourceMappingURL=frog.js.map