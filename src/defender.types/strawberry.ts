//import the defenderentity, enemyentity, and view classes
import { DefenderEntity } from "../defenderentity.js";
import { EnemyEntity } from "../enemyEntity";
import { View } from "../view.js";

class Strawberry extends DefenderEntity{
    constructor (view : View, knockbackStrength : number){
        const STATS = {
            health : 5,
            speed : 0.6,
            regeneration : 0,
        };
        const DEFENDERBASESTATS = {
            defenderLvl : 1,
            deployCooldown :3,
            attackCooldown : 2,
            defenderCost : 5,
            defenderSoldCost : 2,
            defenderUpgradeCost : 15,
            defenderUpgradePoints : 10,
            defenderAttackDamage : 5
        };

        super(view, STATS, DEFENDERBASESTATS, knockbackStrength);
        
    }

}

export {Strawberry};