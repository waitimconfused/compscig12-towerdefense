import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { Tool } from "./tool.js";
export class Toothpick extends Tool {
    entityType = "tool/toothpick";
    toolRequirements;
    toolUsedCounter = 3;
    static baseStats = {
        health: 20,
        speed: 0,
        damage: 10,
        knockBack: 0,
        spawnCoolDown: 0,
        attackCoolDown: 3000,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0,
    };
    constructor(position) {
        super(position);
        this.toolRequirements = new Map();
        this.toolRequirements.set('wood', 3);
        this.toolRequirements.set('coin', 10);
    }
    onDeath() { }
    async brain() {
        this.state = "idle";
        let closestEnemy = Entity.nearestEntity(this, EnemyEntity);
        if (!closestEnemy)
            return;
        let distance = Entity.getDistance(this, closestEnemy);
        if (distance <= 10 && this.toolUsedCounter != 0) {
            this.state = "use";
            this.attackEntity(closestEnemy);
            this.toolUsedCounter--;
        }
        else if (this.toolUsedCounter == 0) {
            this.state = "no-more-uses";
            this.stats.health = 0;
        }
    }
}
//# sourceMappingURL=toothpick.js.map