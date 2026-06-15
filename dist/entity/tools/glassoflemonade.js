import { EnemyEntity } from "../enemy.js";
import { Entity } from "../entity.js";
import { StatusEffects } from "../statusEffects.js";
import { Tool } from "./tool.js";
export class GlassOfLemonade extends Tool {
    entityType = "tool/glassoflemonade";
    toolRequirements;
    static baseStats = {
        health: 20,
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
    };
    constructor(position) {
        super(position);
        this.toolRequirements = new Map();
        this.toolRequirements.set('jar', 1);
        this.toolRequirements.set('coin', 50);
    }
    onDeath() { }
    async brain() {
        this.state = "use";
        await this.wait(600);
        new IceCube(this.position);
        this.state = "used";
    }
}
export class IceCube extends GlassOfLemonade {
    entityType = "tool/ice-cube";
    iceCubeStateNumber = 0;
    age = 0;
    async brain() {
        this.age += 1;
        if (this.age >= 100)
            this.iceCubeStateNumber += 1;
        this.age %= 100;
        if (this.iceCubeStateNumber == 4) {
            this.stats.health = 0;
        }
        let entitiesNearIceCube = Entity.totalEntitiesInRange(this, this.stats.aoeRange, EnemyEntity);
        if (entitiesNearIceCube.length >= 1) {
            for (let i = 0; i < entitiesNearIceCube.length; i++) {
                StatusEffects.stunEntity(entitiesNearIceCube[i], 4);
                StatusEffects.slowEntity(entitiesNearIceCube[i], 8);
            }
        }
        else {
            return;
        }
    }
}
//# sourceMappingURL=glassoflemonade.js.map