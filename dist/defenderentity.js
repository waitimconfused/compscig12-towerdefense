import { Entity } from "./entity.js";
class DefenderEntity extends Entity {
    defenderLvl;
    spawnCooldown;
    attackCooldown;
    defenderCost;
    defenderUpgradeCost;
    defenderSoldCost;
    knockbackStrength = 3;
    defenderUpgradePoints;
    isStunned = false;
    defenderAttackDamage;
    constructor(view, stats, theDefenderLvl, theSpawnCooldown, theAttackCooldown, theDefenderCost, theDefenderSoldCost, theDefenderUpgradePoints, theDefenderUpgradeCost, theDefenderAttackDamage) {
        super(view, {
            health: stats.health,
            speed: stats.speed,
        });
        this.defenderLvl = theDefenderLvl;
        this.spawnCooldown = theSpawnCooldown;
        this.attackCooldown = theAttackCooldown;
        this.defenderUpgradePoints = theDefenderUpgradePoints;
        this.defenderCost = theDefenderCost;
        this.defenderSoldCost = theDefenderSoldCost;
        this.defenderUpgradeCost = theDefenderUpgradeCost;
        this.defenderAttackDamage = theDefenderAttackDamage;
    }
    spawnMovingDefender(x, y) {
        this.position = [x, y];
    }
    stun(stunduration) {
    }
    ;
}
export { DefenderEntity };
//# sourceMappingURL=defenderentity.js.map