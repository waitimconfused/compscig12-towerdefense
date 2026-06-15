import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Wave } from "../../wave.js";
export class Ant extends EnemyEntity {
    static ENEMY_NAME = "Ant";
    entityType = "enemy/ant";
    static baseStats = {
        health: 100,
        speed: 0.1,
        damage: 1,
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
        coins: 2,
        points: 5,
        materials: [
            { type: 'wood', chance: 0.2, amount: 2 },
            { type: 'lemonade_glass', chance: 0.1, amount: 1 }
        ]
    };
    dealDamage(dealtDamage, attacker, damageType = 'melee') {
        return new Promise((resolve) => {
            let finalDamage = dealtDamage;
            if (damageType == 'aoe') {
                finalDamage *= 1.25;
            }
            this.stats.health -= finalDamage;
            this.interruptTimers(null, {
                triggered_by: attacker,
                interrupt_type: "attacked"
            });
            resolve(undefined);
        });
    }
    async attackEntity(entity) {
        if (this.stunned) {
            return;
        }
        this.state = 'attack';
        let interrupt = await this.wait(400);
        if (interrupt) {
            this.state = 'idle';
            return;
        }
        let result = await super.attackEntity(entity);
        await this.wait(100);
        this.state = 'idle';
        return result;
    }
    async brain() {
        await this.followPath(EnemyEntity.path);
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
                    await StatusEffects.regenerateEntity(this, 5000, 2);
                }
            }
        }
    }
    static antSpawn(position, spread) {
        let cluster = Math.min(Wave.getWave(), 10) + 5;
        let randomAnts = Math.floor(Math.random() * 6 + 3);
        let count = 0;
        if (Math.random() <= 0.1) {
            count = cluster;
        }
        else {
            count = randomAnts;
        }
        return super.spawn(count, position, spread);
    }
}
//# sourceMappingURL=ant.js.map