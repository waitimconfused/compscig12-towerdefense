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
        spawnCoolDown: 3_000,
        attackCoolDown: 0,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 5_000,
        regenerationDuration: 0,
        aoeRange: 293 / 2,
        upgradeEntityCost: 35,
        entityPurchaseCost: 30,
        entityResaleCost: 15
    };
    constructor(position) {
        super(position);
        this.position[1] = 0;
    }
    onDeath() { }
    async brain() {
        await this.wait(this.stats.spawnCoolDown);
        console.log("Spawning Banana");
        Banana.spawn(1, this.position);
    }
}
export class Banana extends BananaSpawner {
    entityType = "defender/banana_entity";
    static showInInventory = false;
    async rollOverEnemy() {
        if (this.stunned)
            return;
        let entitiesNearBanana = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
        if (entitiesNearBanana.length == 0)
            return;
        for (let i = 0; i < entitiesNearBanana.length; i++) {
            let entity = entitiesNearBanana[i];
            entity.dealDamage(this.stats.damage, entitiesNearBanana[i]);
        }
    }
    async brain() {
        let downInterrupt = await this.walkTo(this.position[0], GameplayView.playSpaceSize[1], () => {
            this.rollOverEnemy();
        });
        if (downInterrupt)
            return;
        if (Banana.canUseSkill) {
            let upInterrupt = await this.walkTo(this.position[0], 0, () => {
                this.rollOverEnemy();
            });
            if (upInterrupt)
                return;
        }
        new BananaPeel(this.position);
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