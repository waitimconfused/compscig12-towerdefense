import { Entity } from "./entity.js";
export class DefenderEntity extends Entity {
    static baseStats;
    static defenderLevel = 1;
    static canUseSkill = false;
    static levelIncrease = 2;
    constructor(position) {
        super(position);
    }
    onDeath() {
    }
    reloadStats() {
        super.reloadStats();
        let constructor = this.constructor;
        let upgrade = constructor.baseStats;
        let storeUpgrades = Object.keys(upgrade);
        for (let i = 0; i < storeUpgrades.length; i++) {
            let statType = storeUpgrades[i];
            let baseState = upgrade[statType];
            this.stats[statType] += baseState / constructor.levelIncrease;
            if (constructor.defenderLevel == 3) {
                constructor.canUseSkill = true;
                if (this.entityType == "defender/sandwich" && statType == 'health') {
                    this.stats[statType] += baseState + 100;
                }
            }
        }
    }
}
;
//# sourceMappingURL=defender.js.map