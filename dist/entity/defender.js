import { Entity } from "./entity.js";
export class DefenderEntity extends Entity {
    static get stats() {
        let upgrade = this.baseStats;
        let storeUpgrades = Object.keys(upgrade);
        let stats = super.stats;
        for (let i = 0; i < storeUpgrades.length; i++) {
            let statType = storeUpgrades[i];
            let baseState = upgrade[statType];
            stats[statType] += baseState / this.levelIncrease;
            if (this.defenderLevel == 3) {
                this.canUseSkill = true;
                if (this.prototype.entityType == "defender/sandwich" && statType == "health") {
                    stats[statType] += baseState + 100;
                }
            }
        }
        return stats;
    }
    static baseStats;
    static defenderLevel = 1;
    static canUseSkill = false;
    static levelIncrease = 2;
    constructor(position) {
        super(position);
    }
}
;
//# sourceMappingURL=defender.js.map