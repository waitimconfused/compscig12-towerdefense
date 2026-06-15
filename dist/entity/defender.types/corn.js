import { Entity } from "../entity.js";
import { EnemyEntity } from "../enemy.js";
import { DefenderEntity } from "../defender.js";
export class Corn extends DefenderEntity {
    entityType = "defender/corn";
    static baseStats = {
        health: 50,
        speed: 0,
        damage: 0,
        knockBack: 0,
        spawnCoolDown: 7000,
        attackCoolDown: 5000,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
        upgradeEntityCost: 40,
        entityPurchaseCost: 35,
        entityResaleCost: 17
    };
    onDeath() { }
    async brain() {
        let closestEnemy = Entity.nearestEntity(this, EnemyEntity);
        if (!closestEnemy)
            return;
        this.direction = Math.atan((closestEnemy.position[1] - this.position[1]) /
            (closestEnemy.position[0] - this.position[0])) || 0;
        if (this.position[0] < closestEnemy.position[0])
            this.direction += Math.PI;
        let distance = Entity.getDistance(this, closestEnemy);
        if (distance <= 45 && this.stunned == false) {
            new Kernel(this.position, closestEnemy);
            this.state = "shoot";
            await this.wait(500);
            this.state = "idle";
        }
    }
}
export class Kernel extends Corn {
    target;
    entityType = "defender/Kernel";
    constructor(position, target) {
        super(position);
        this.target = target;
    }
    static baseStats = {
        health: 10,
        speed: 3,
        damage: 15,
        knockBack: 3,
        spawnCoolDown: 0,
        attackCoolDown: 0,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 10,
        upgradeEntityCost: 0,
        entityPurchaseCost: 0,
        entityResaleCost: 0,
    };
    async attackEntity(entity) {
        if (this.stunned) {
            return;
        }
        this.state = "attack";
        let interrupt = await this.wait(400);
        if (interrupt) {
            this.state = "idle";
            return;
        }
        entity.dealDamage(this.stats.damage, this);
        if (Kernel.canUseSkill == true) {
            this.state = "pop";
            let entitiesNearKernel = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
            if (entitiesNearKernel.length == 0) {
                return;
            }
            let blastDamage = this.stats.damage / 3;
            for (let i = 0; i < entitiesNearKernel.length; i++) {
                entitiesNearKernel[i].dealDamage(blastDamage, entitiesNearKernel[i]);
            }
        }
        await this.wait(100);
        return;
    }
    async brain() {
        await this.walkToEntity(this.target);
        this.attackEntity(this.target);
        this.stats.health = 0;
    }
}
//# sourceMappingURL=corn.js.map