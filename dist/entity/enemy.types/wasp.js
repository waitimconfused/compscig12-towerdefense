import { EnemyEntity } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity } from "../entity.js";
export class Wasp extends EnemyEntity {
    static ENEMY_NAME = "Wasp";
    entityType = "enemy/wasp";
    isFlying = true;
    speedStacks = 0;
    static baseStats = {
        health: 25,
        speed: 0.2,
        damage: 10,
        knockBack: 10,
        spawnCoolDown: 10,
        attackCoolDown: 10,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
    };
    drops = {
        coins: 5,
        points: 10,
        materials: [
            { type: 'honey', chance: 0.25, amount: 2 }
        ]
    };
    async attackEntity(entity) {
        if (this.stunned) {
            return;
        }
        this.state = 'attack';
        let interrupt = await this.wait(500);
        if (interrupt) {
            this.state = 'idle';
        }
        let result = await super.attackEntity(entity);
        await this.wait(200);
        this.state = 'idle';
        return result;
    }
    async brain() {
        await this.wait(500);
        let closestEntity = Entity.nearestEntity(this, DefenderEntity);
        if (!closestEntity || closestEntity.stats.health <= 0) {
            super.interruptTimers("walk");
            return;
        }
        let interrupt = await this.walkToEntity(closestEntity);
        if (!interrupt) {
            let attackInterrupt = await this.attackEntity(closestEntity);
            if (attackInterrupt) {
            }
            else if (closestEntity.stats.health <= 0) {
                this.stats.speed *= Math.pow(1.1, this.speedStacks);
                this.speedStacks++;
            }
        }
    }
}
//# sourceMappingURL=wasp.js.map