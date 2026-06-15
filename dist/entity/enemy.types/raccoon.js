import { EnemyEntity } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
export class Raccoon extends EnemyEntity {
    static ENEMY_NAME = "Raccoon";
    entityType = "enemy/raccoon";
    static baseStats = {
        health: 100,
        speed: 0.2,
        damage: 10,
        knockBack: 10,
        spawnCoolDown: 10,
        attackCoolDown: 10,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0
    };
    drops = {
        coins: 10,
        points: 10,
        materials: [
            { type: 'wood', chance: 0.5, amount: 1 },
            { type: 'jar', chance: 0.2, amount: 1 }
        ]
    };
    async attackEntity(entity) {
        if (this.stunned) {
            return;
        }
        this.state = 'attack';
        let interrupt = await this.wait(400);
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
            let defenderHealth = closestEntity.stats.health;
            let attackInterrupt = await this.attackEntity(closestEntity);
            if (attackInterrupt) {
            }
            else if (closestEntity.stats.health <= 0) {
                if (defenderHealth > 0 && closestEntity.stats.health <= 0) {
                    await StatusEffects.regenerateEntity(this, 5000, 3);
                }
            }
        }
    }
}
//# sourceMappingURL=raccoon.js.map