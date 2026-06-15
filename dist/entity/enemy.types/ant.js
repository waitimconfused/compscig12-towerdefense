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
    static path = "M0 50.0634C311.161 43.5073 285.567 549.586 561.679 457.548C837.79 365.511 1133.82 328.192 1160.05 573.793C1186.27 819.393 693.305 992.373 577.06 751.311C460.816 510.249 486.752 130.908 881.377 115.526C1276 100.145 1478.86 273.376 1553.5 492.5C1613.21 667.8 1797.04 726.431 1900 700.88";
    _disableBrain = false;
    currentPath = null;
    currentPathProgress = 0;
    currentPathMaxProgress = 0;
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
        if (this._disableBrain)
            return;
        await this.followPath(Ant.path, () => {
            if (this.currentPath) {
                console.log("RESETING POSITION");
                this._targetPath = this.currentPath;
                this._targetPathLength = this.currentPathProgress;
                this._targetPathMaxLength = this.currentPathMaxProgress;
                this.currentPath = null;
                this.currentPathProgress = 0;
                this.currentPathMaxProgress = 0;
            }
            this.tester();
        });
    }
    async tester() {
        let closestEntity = Entity.nearestEntity(this, DefenderEntity);
        if (!closestEntity) {
            this._disableBrain = false;
            return;
        }
        let distance = Entity.getDistance(this, closestEntity);
        if (distance >= 200) {
            this._disableBrain = false;
            return;
        }
        this._disableBrain = true;
        this.currentPath = this._targetPath;
        this.currentPathProgress = this._targetPathLength;
        this.currentPathMaxProgress = this._targetPathMaxLength;
        this.interruptTimers("walk");
        let interrupt = await this.walkToEntity(closestEntity);
        if (interrupt) {
            this._disableBrain = false;
            return;
        }
        let defenderHealth = closestEntity.stats.health;
        let attackInterrupt = await this.attackEntity(closestEntity);
        if (attackInterrupt) {
            this._disableBrain = false;
            return;
        }
        if (closestEntity.stats.health <= 0) {
            if (defenderHealth > 0 && closestEntity.stats.health <= 0) {
                await StatusEffects.regenerateEntity(this, 5000, 2);
            }
        }
        this._disableBrain = false;
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