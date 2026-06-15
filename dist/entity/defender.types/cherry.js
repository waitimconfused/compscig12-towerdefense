import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
export class Cherry extends DefenderEntity {
    entityType = "defender/cherry";
    static baseStats = {
        health: 20,
        speed: 0.50,
        damage: 10,
        knockBack: 2,
        spawnCoolDown: 3000,
        attackCoolDown: 3000,
        stunChance: 0.25,
        stunDuration: 4000,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
        upgradeEntityCost: 15,
        entityPurchaseCost: 10,
        entityResaleCost: 5
    };
    nearestEnemies() {
        let front = undefined;
        let back = undefined;
        let frontNearestDistance = Infinity;
        let backNearestDistance = Infinity;
        let entities = [...Entity.entities.values()];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity instanceof EnemyEntity == false)
                continue;
            let distance = Math.hypot(entity.position[0] - this.position[0], entity.position[1] - this.position[1]);
            if (Cherry.canUseSkill == true) {
                if (entity.position[0] < this.position[0] && entity.position[1] < this.position[1]) {
                    if (distance < frontNearestDistance) {
                        front = entity;
                        frontNearestDistance = distance;
                    }
                }
                else {
                    back = entity;
                    backNearestDistance = distance;
                }
            }
            else {
                if (distance < backNearestDistance) {
                    back = entity;
                    backNearestDistance = distance;
                }
            }
        }
        return { front, back };
    }
    async attemptStun(target) {
        let rollForStun = Math.random();
        if (this.stats.stunChance == undefined) {
            return;
        }
        if (rollForStun <= this.stats.stunChance) {
            await StatusEffects.stunEntity(target, this.stats.stunDuration);
        }
        return;
    }
    async attackEntity(entity) {
        if (this.stunned)
            return;
        let interrupt = await this.wait(400);
        if (interrupt) {
            this.state = 'idle';
            return;
        }
        await super.attackEntity(entity);
        await this.attemptStun(entity);
        await this.wait(100);
        this.state = "idle";
        return;
    }
    async brain() {
        let cherryNearestEntity = this.nearestEnemies();
        await this.wait(500);
        let closestFrontEntity = cherryNearestEntity.front;
        let closestBackEntity = cherryNearestEntity.back;
        if (!closestFrontEntity || closestFrontEntity.stats.health <= 0)
            return super.interruptTimers("walk");
        let interrupt = await this.walkToEntity(closestFrontEntity);
        let frontEnemyDistance = Entity.getDistance(this, closestFrontEntity);
        if (frontEnemyDistance <= 45 && !interrupt) {
            this.state = "front-attack";
            this.attackEntity(closestFrontEntity);
            if (Cherry.canUseSkill == false || !closestBackEntity)
                return;
            let backEnemyDistance = Entity.getDistance(this, closestBackEntity);
            if (backEnemyDistance <= 45 && !interrupt) {
                this.state = "back-attack";
                this.attackEntity(closestBackEntity);
            }
        }
    }
}
//# sourceMappingURL=cherry.js.map