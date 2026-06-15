import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Tool } from "./tool.js";
export class JarOfHoney extends Tool {
    entityType = "tool/jar-of-honey";
    toolRequirements;
    enemiesCaptured = 0;
    static baseStats = {
        health: 20,
        speed: 0,
        damage: 0,
        knockBack: 0,
        spawnCoolDown: 0,
        attackCoolDown: 0,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 15000,
        regenerationDuration: 0,
        aoeRange: 0,
    };
    constructor(position) {
        super(position);
        this.toolRequirements = new Map();
        this.toolRequirements.set('jar', 1);
        this.toolRequirements.set('coin', 20);
    }
    onDeath() { }
    async brain() {
        this.state = "use";
        await this.wait(2000);
        this.state = "used";
        let entitiesNearHoney = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
        if (entitiesNearHoney.length >= 1) {
            for (let i = 0; i < entitiesNearHoney.length; i++) {
                if (this.enemiesCaptured < 10) {
                    StatusEffects.slowEntity(entitiesNearHoney[i], this.stats.slowDuration);
                    this.enemiesCaptured++;
                }
                else {
                    this.stats.health = 0;
                }
            }
        }
        else {
            return;
        }
    }
}
//# sourceMappingURL=jarofhoney.js.map