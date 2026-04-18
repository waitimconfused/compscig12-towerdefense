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
    //whether or not the Cherry has any modifiers/cooldown that prevents them from currently attacking
    private canHit : boolean = true;
    
    /**
     * passes through all the properties needed for the Cherry. the constructer has the base stats
     * @param view //the place where the Cherry will be found on the screen
     * @param theDefenderLvl //starts at lvl 1
     * @param theSpawnCooldown //the cooldown for how fast the player can deploy the Cherry
     * @param theAttackCooldown //the cooldown for how often the Cherry can attach
     * @param theDefenderCost //the cost of deploying the Cherry
     * @param theDefenderSoldCost //the money the player gets back when selling the Cherry
     * @param theDefenderUpgradePoints //the points the player gets for their overall game when they upgrade the Cherry defender
     * @param theDefenderAttackDamage //the attack damage for the Cherry
     */
    constructor (view : View, theDefenderLvl : number = 1, 
        theSpawnCooldown : number = 3, theAttackCooldown : number = 3, 
        theDefenderCost : number = 10, theDefenderSoldCost : number = 3, 
        theDefenderUpgradePoints : number = 10, theDefenderUpgradeCost : number = 10,
        theDefenderAttackDamage : number = 20){
        const STATS = {
            health : 20,
            speed : 0.6,
            regeneration : 0
        }

        super(view, STATS, theDefenderLvl, theSpawnCooldown, 
            theAttackCooldown, theDefenderCost, theDefenderSoldCost, 
            theDefenderUpgradePoints, theDefenderUpgradeCost, theDefenderAttackDamage);
        
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
            return true;
        }

        return false;
    }

    //cherry attacks enemy
    public attackEnemy(target : EnemyEntity) : void{
        //if there is no target or there is some modifier/cooldown that prevents them from hitting, do not attack
        if (!target || this.canHit == false) {
            return;
        }
        //otherwise, the cherry will do damage to the enemy based off of their current stats
        else{
            target.takeDamage(this.theDefenderAttackDamage)
            //check to see if the cherry was able to stun enemy
            this.attemptStun(target);
        }
    }

    //when the player upgrades the cherry to lvl 3, the cherry has the ability to hit front and back
    private attackBackwards() : void {
        //check if the cherry defender is at lvl 3
        //if it is, attack both front and back instead of the front twice
        if (upgrade == 3 && this.canHit == true){
            
        }
        else{
            return;
        }

    }
    
    

    public killedEnemy() : void{

    }

}

export {Cherry};