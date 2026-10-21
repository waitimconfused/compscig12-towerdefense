import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Wave } from "../../wave.js";
export class Ant extends EnemyEntity {
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
    start = true;
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
        let interrupt = await this.wait(400, undefined, false);
        if (interrupt) {
            this.state = 'idle';
            return;
        }
        let result = await super.attackEntity(entity);
        await this.wait(100, undefined, false);
        this.state = 'idle';
        return result;
    }
    async brain() {
        if (this.targetEntity) {
            await this.attackEntity(this.targetEntity);
            if (this.targetEntity.stats.health <= 0) {
                this.targetEntity = null;
                let path = this.currentPath;
                let position = path.getPointAtLength(this.currentPathLength);
                await this.walkTo(position.x, position.y);
            }
            return;
        }
        await this.followPath(EnemyEntity.path, false, (interrupt) => {
            this.start = false;
            if (this.currentPath) {
                this.targetEntity = null;
                this._targetPath = this.currentPath;
                this._targetPathLength = this.currentPathLength;
                this._targetPathMaxLength = this.currentPathMaxLength;
                this.currentPath = null;
            }
            let entity = Entity.nearestEntity(this, DefenderEntity);
            if (!entity)
                return;
            let distance = Entity.getDistance(this, entity);
            if (distance > 100)
                return;
            this.targetEntity = entity;
            this.currentPath = this._targetPath;
            this.currentPathLength = this._targetPathLength;
            this.currentPathMaxLength = this._targetPathMaxLength;
            interrupt();
        }, this.start);
        let entity = this.targetEntity;
        await this.walkToEntity(entity);
        await this.attackEntity(entity);
        if (entity.stats.health <= 0) {
            await StatusEffects.regenerateEntity(this, 5000, 2);
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