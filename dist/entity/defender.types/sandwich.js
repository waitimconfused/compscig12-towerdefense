import { DefenderEntity } from "../defender.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
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
        stunDuration: 500,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
        upgradeEntityCost: 30
    };
    onDeath() {
    }
    getEntitiesInRange(selector, radius) {
        let ids = [...Entity.entities.keys()];
        let entities = [];
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let entity = Entity.entities.get(id);
            if (entity instanceof selector == false)
                continue;
            let distance = Entity.getDistance(this, entity);
            if (distance > radius)
                continue;
            entities.push(entity);
        }
        return [];
    }
    async brain() {
        this.state = "idle";
        let interrupt = await this.wait(Infinity);
        if (interrupt?.interrupt_type == "attacked" && interrupt.triggered_by instanceof Entity) {
            StatusEffects.stunEntity(interrupt.triggered_by, this.stats.stunDuration);
        }
    }
}
;
//# sourceMappingURL=sandwich.js.map