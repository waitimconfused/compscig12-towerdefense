//import the defenderentity, enemyentity, and view classes
import { DefenderEntity } from "../defenderentity.js";
import {EnemyEntity} from "enemyEntity.js";
import { View } from "../view.js";

class Cherry extends DefenderEntity{
    //create the unique properties for the defender "cherry"
    //chance to stun an enemy
    private stunChance : number = 0.25;
    //the duration the enemy will be stunned for
    private stunDuration : number = 3;
    //when the cherry is upgraded to lvl 3, they can attack front and back
    private canAttackFrontBack : boolean = false;
    
    /**
     * passes through all the properties needed for the Cherry. the constructer has the base stats and the view
     * @param view //the place where the Cherry will be found on the screen
     * @param theDefenderLvl //starts at lvl 1
     * @param theDeployCooldown //the cooldown for how fast the player can deploy the Cherry
     * @param theAttackCooldown //the cooldown for how often the Cherry can attach
     * @param theDefenderCost //the cost of deploying the Cherry
     * @param theDefenderSoldCost //the money the player gets back when selling the Cherry
     * @param theDefenderUpgradePoints //the points the player gets for their overall game when they upgrade the Cherry defender
     * @param theDefenderAttackDamage //the attack damage for the Cherry
     */
    constructor (view : View, knockbackStrength : number){
        const STATS = {
            health : 20,
            speed : 0.6,
        };
        const DEFENDERBASESTATS = {
            defenderLvl : 1,
            deployCooldown : 3,
            attackCooldown : 3,
            defenderCost : 10,
            defenderSoldCost : 3,
            defenderUpgradeCost : 10,
            defenderUpgradePoints : 10,
            defenderAttackDamage : 20
        };

        super(view, STATS, DEFENDERBASESTATS, knockbackStrength);
        
    }

    /**
     * check to see if the cherry was able to stun enemy
     * @param target the enemy
     * @returns returns whether the cherry was able to stun the enemy (true or false)
     */
    private attemptStun(target : EnemyEntity) : boolean {
        //roll to see if the Cherry stuns the enemy
        //roll a number between 1-100
        let rollForStun =  Math.floor(Math.random()*(100 - 1 + 1) + 1);
        
        //if the cherry rolls a number less than or equal to 25, they have stunned the enemy
        if (rollForStun<= this.stunChance){
            target.stun(this.stunDuration)
            //when stunned, return that the cherry was able to stun the enemy
            return true;
        }

        //otherwise, return that it was not able to
        return false;
    }

    /**
     * cherry attacks enemy
     * @param target the enemy
     * @returns if there is no target or there is some modifier/cooldown that prevents them from hitting, do not attack
     */
    public attackEnemy(target : EnemyEntity) : void{
        //if there is no target or there is some modifier/cooldown that prevents them from hitting, do not attack
        if (!target || this.canHit == false) {
            return;
        }
        //otherwise, the cherry will do damage to the enemy based off of their current stats
        else{
            target.takeDamage(this.defenderBaseStats.defenderAttackDamage)
            //check to see if the cherry was able to stun enemy
            this.attemptStun(target);
        }
    }

    /**
     * check to see if the cherry is at the max upgrade 
     * if it is, it can now hit enemies from the front and behind
     * @returns returns the boolean value of whether the cherry can now attack front and back
     */
    public cherryMaxUpgrade () : boolean {
        //if the cherry is at lvl 3, it is at max lvl and can use its new ability
        if (this.defenderBaseStats.defenderLvl == 3){
            this.canAttackFrontBack = true;
        }
        //otherwise, stay doing the same of only attacking enemies in front of them
        else{
            this.canAttackFrontBack = false;
        }

        return this.canAttackFrontBack;
    }

    /**
     * when the cherry kills an enemy, it will find the next enemy
     * @param target the enemy
     */
    public killedEnemy(target: EnemyEntity) : void{
        target.getClosestEntity();
    }
}

export {Cherry};