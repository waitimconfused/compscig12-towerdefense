import { Corn } from "./corn.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
export class Kernel extends Corn {
    target;
    entityType = "defender/Kernel";
    static upgrades = [];
    constructor(position, target) {
        super(position);
        this.target = target;
    }
    die() { }
    attackEntity(entity) {
        return new Promise((resolve) => {
            if (this.stunned) {
                resolve({ interrupt_type: "stunned" });
            }
            entity.dealDamage(this.stats.damage, this);
            if (this.kernalAOE == true) {
                let entitiesNearKernal = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
                if (entitiesNearKernal.length == 0) {
                    resolve(undefined);
                }
                let blastDamage = this.stats.damage / 3;
                for (let i = 0; i < entitiesNearKernal.length; i++) {
                    entitiesNearKernal[i].dealDamage(blastDamage, entitiesNearKernal[i]);
                }
            }
            resolve(undefined);
        });
    }
    async brain() {
        await this.walkTo(this.target.position[0], this.target.position[1]);
        this.attackEntity(this.target);
        this.stats.health = 0;
    }
}
//# sourceMappingURL=kernel.js.map