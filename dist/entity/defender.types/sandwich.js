import { DefenderEntity } from "../defender.js";
export class Sandwich extends DefenderEntity {
    entityType = "defender/sandwich";
    static baseStats = {
        health: 40,
        speed: 0,
        damage: 0,
        knockBack: 3,
        entityPurchaseCost: 25,
        entityResaleCost: 12,
        attackCoolDown: 0,
        spawnCoolDown: 5000,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
        upgradeEntityCost: 30
    };
    async brain() {
        this.state = "idle";
        await this.wait(Infinity);
    }
}
;
//# sourceMappingURL=sandwich.js.map