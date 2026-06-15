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
    rollForMentalState() {
        let roll = Math.floor(Math.random() * (100 - 1 + 1) + 1);
        if (roll < Strawberry.psychoticStateProb) {
            let secondRoll = Math.floor(Math.random() * (100 - 1 + 1) + 1);
            if (secondRoll > 50) {
                this.mentalState = 1;
            }
            else {
                this.mentalState = 2;
            }
        }
        else {
            this.mentalState = 3;
        }
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
        await this.wait(600);
        this.state = "walk";
        return await super.walkTo(x, y);
    }
    async walkToEntity(entity, distance = 50) {
        if (this.position[0] == entity.position[0] && this.position[1] == entity.position[1])
            return;
        this.state = "launch";
        await this.wait(600);
        this.state = "walk";
        return await super.walkToEntity(entity, distance);
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
        await this.wait(100);
        this.state = 'idle';
    }
    async brain() {
        this.rollForMentalState();
        let closestEntity = Entity.nearestEntity(this, EnemyEntity);
        if (!closestEntity || closestEntity.stats.health <= 0) {
            return;
        }
        let interrupt = await this.walkToEntity(closestEntity);
        if (!interrupt) {
            let defenderHealth = closestEntity.stats.health;
            if (this.position[0] == closestEntity.position[0] && this.position[1] == closestEntity.position[1]) {
                if (!(closestEntity.stats.health <= 0)) {
                    await this.attackEntity(closestEntity);
                }
            }
        }
    }
}
;
//# sourceMappingURL=strawberry.js.map