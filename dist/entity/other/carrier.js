import { DefenderEntity } from "../defender.js";
export class Carrier extends DefenderEntity {
    entityType = "entity/carrier";
    static baseStats = {
        health: 100,
        speed: 0,
        damage: 0,
        knockBack: 0,
        spawnCoolDown: 0,
        attackCoolDown: 0,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
        entityPurchaseCost: 100,
        upgradeEntityCost: 100,
        entityResaleCost: 123
    };
    onDeath() {
    }
    async brain() {
    }
}
//# sourceMappingURL=carrier.js.map