import { DefenderEntity } from "../defender.js";
import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
export class Frog extends EnemyEntity {
    static ENEMY_NAME = "Frog";
    entityType = "enemy/frog";
    static baseStats = {
        health: 75,
        speed: 0.75,
        damage: 0,
        knockBack: 10,
        spawnCoolDown: 10,
        attackCoolDown: 10,
        stunChance: 0,
        stunDuration: 0,
        slowDuration: 0,
        regenerationDuration: 0,
        aoeRange: 0
    };
    isLeaping;
    canLeap = true;
    drops = {
        coins: 5,
        points: 10,
        materials: [
            { type: 'jar', chance: 0.3, amount: 1 }
        ]
    };
    async tryLeap() {
        this.isLeaping = true;
        this.stunned = true;
        this.invulnerable = true;
        this.state = 'walk';
        await this.walkTo(this.position[0] + 100, this.position[1]);
        await this.wait(600);
        this.state = 'idle';
        this.isLeaping = false;
        this.stunned = false;
        this.invulnerable = false;
    }
    async brain() {
        await this.wait(500);
        let closestEntity = Entity.nearestEntity(this, DefenderEntity);
        if (!closestEntity) {
            return;
        }
        let interrupt = await this.walkTo(closestEntity.position[0], closestEntity.position[1]);
        if (!interrupt) {
            if (this.canLeap) {
                this.tryLeap();
            }
        }
    }
}
//# sourceMappingURL=frog.js.map