//import the defenderentity, enemyentity, and view classes
import { DefenderEntity } from "../defenderentity.js";
import { EnemyEntity } from "../enemyEntity";
import { View } from "../view.js";
import { Kernal } from "./kernal.js";

class Corn extends DefenderEntity{

    constructor (view : View, knockbackStrength : number){
        const STATS = {
            health : 20,
            speed : 0.6,
            regeneration : 0,
        };
        const DEFENDERBASESTATS = {
            defenderLvl : 1,
            deployCooldown : 4,
            attackCooldown : 3,
            defenderCost : 15,
            defenderSoldCost : 5,
            defenderUpgradeCost : 20,
            defenderUpgradePoints : 10,
            defenderAttackDamage : 25
        };

        super(view, STATS, DEFENDERBASESTATS, knockbackStrength);
        
    }
    
    /**the corn itself cannot deal damage, but the kernals it produces can. 
     * Therefore, the attackEnemy method is in the Kernal class
     */

}

export {Corn};