import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
export class Strawberry extends DefenderEntity {
    mentalState;
    static psychoticStateProb = 100 / 3;
    entityType = "defender/strawberry";
    static baseStats = {
        health: 20,
        speed: 0.4,
        damage: 10,
        knockBack: 10,
        spawnCoolDown: 3000,
        attackCoolDown: 3000,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
        upgradeEntityCost: 15,
        entityPurchaseCost: 10,
        entityResaleCost: 10,
    };
    constructor(position) {
        super(position);
        let roll = Number(Math.random().toFixed(2));
        let mentalStateDistribution = {
            "0.1": 3,
            "0.2": 2,
            "0.7": 1
        };
        let mentalStateProbabilities = Object.keys(mentalStateDistribution);
        let probabilitySum = 0;
        for (let i = 0; i < mentalStateProbabilities.length; i++) {
            let chance = mentalStateProbabilities[i];
            probabilitySum += Number(chance);
            if (roll > probabilitySum)
                continue;
            this.mentalState = mentalStateDistribution[chance];
            break;
        }
    }
    onDeath() {
    }
    reloadStats() {
        super.reloadStats();
        if (Strawberry.psychoticStateProb != 100 && Strawberry.canUseSkill == true) {
            Strawberry.psychoticStateProb += Strawberry.psychoticStateProb / 3;
            if (Strawberry.psychoticStateProb > 100) {
                Strawberry.psychoticStateProb = 100;
            }
        }
    }
    async walkTo(x, y) {
        if (this.position[0] == x && this.position[1] == y)
            return;
        this.state = "launch";
        await this.wait(600, undefined, false);
        this.state = "walk";
        return await super.walkTo(x, y);
    }
    async walkToEntity(entity, distance = 50) {
        if (this.position[0] == entity.position[0] && this.position[1] == entity.position[1])
            return;
        this.state = "launch";
        await this.wait(600, undefined, false);
        this.state = "walk";
        return await super.walkToEntity(entity, distance);
    }
    async attackEntity(entity) {
        if (this.stunned) {
            return;
        }
        this.state = 'attack';
        await this.wait(400);
        entity.dealDamage(this.stats.damage, this, "melee");
        await this.wait(100);
        this.state = 'idle';
    }
    async brain() {
        let closestEntity = Entity.nearestEntity(this, EnemyEntity);
        if (!closestEntity || closestEntity.stats.health <= 0)
            return;
        await this.walkToEntity(closestEntity);
        await this.attackEntity(closestEntity);
    }
}
;
//# sourceMappingURL=strawberry.js.map