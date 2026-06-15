import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import GameplayView from "../../view/elements/gameplay-view.js";
export class BananaSpawner extends DefenderEntity {
    entityType = "defender/banana_spawner";
    static baseStats = {
        health: 30,
        speed: 0.1,
        damage: 10,
        knockBack: 10,
        spawnCoolDown: 10000,
        attackCoolDown: 0,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 5000,
        regenerationDuration: 0,
        aoeRange: 50,
        upgradeEntityCost: 35,
        entityPurchaseCost: 30,
        entityResaleCost: 15
    };
    onDeath() { }
    async brain() {
        await this.wait(1000);
        console.log("Spawning Banana");
        Banana.spawn(1, this.position);
    }
}
export class Banana extends BananaSpawner {
    entityType = "defender/banana_entity";
    async rollOverEnemy() {
        if (this.stunned)
            return;
        this.state = "reveal";
        await this.wait(200);
        this.state = "rolling";
        let entitiesNearBanana = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
        if (entitiesNearBanana.length == 0) {
            return;
        }
        for (let i = 0; i < entitiesNearBanana.length; i++) {
            entitiesNearBanana[i].dealDamage(this.stats.damage, entitiesNearBanana[i]);
        }
    }
    async brain() {
        let interrupt = await this.walkTo(this.position[0], GameplayView.playSpaceSize[1]);
        this.rollOverEnemy();
        await this.wait(400);
        new BananaPeel(this.position);
        if (interrupt)
            return;
        if (Banana.canUseSkill == true) {
            interrupt;
            this.rollOverEnemy();
            await this.wait(400);
        }
        this.state = "die";
        this.stats.health = 0;
    }
}
export class BananaPeel extends Banana {
    entityType = "defender/banana_peel";
    slowEnemies() {
        let slowInRange = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
        for (let i = 0; i < slowInRange.length; i++) {
            StatusEffects.slowEntity(slowInRange[i], this.stats.slowDuration);
        }
    }
    async brain() {
        this.state = "banana remains";
        this.slowEnemies();
    }
}
//# sourceMappingURL=banana.js.map