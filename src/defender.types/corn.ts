//import the defenderentity, enemyentity, and view classes
import { DefenderEntity } from "../defenderentity.js";
import { EnemyEntity } from "../enemyEntity";
import { View } from "../view.js";

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
     //the corn will be the entity related to Corn that does the actual damage to the enemies
    public override attackEnemy(target : EnemyEntity): void {
        //get the targeted entity's x and y position and save it to local variables
        let targettedEntityXPosition = this.walkingTo[0];
        let targettedEntityYPosition = this.walkingTo[1];
        //wait 5 seconds before proceeding
        wait(5000);
        //walk to the position given the constructers from corn, and get the enemy to take damge
        this.walkToPosition(targettedEntityXPosition,targettedEntityYPosition);
        target.takeDamage(this.defenderBaseStats.defenderAttackDamage)
    }
}

export {Corn};