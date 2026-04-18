import { DefenderEntity } from "../defenderentity.js";
import { View } from "../view.js";

class Cherry extends DefenderEntity{
    //create the unique properties for the defender "cherry"
    //chance to stun an enemy
    private stunChance : number = 0.25;
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
     */
    constructor (view : View, theDefenderLvl : number = 1, 
        theSpawnCooldown : number = 3, theAttackCooldown : number = 3, 
        theDefenderCost : number = 10, theDefenderSoldCost : number = 3, 
        theDefenderUpgradePoints : number = 10, theDefenderUpgradeCost : number = 10){
        const STATS = {
            health : 20,
            speed : 0.6,
            regeneration : 0
        }

        super(view, STATS, theDefenderLvl, theSpawnCooldown, 
            theAttackCooldown, theDefenderCost, theDefenderSoldCost, 
            theDefenderUpgradePoints, theDefenderUpgradeCost);
        
    }

    private attackEnemy() : void{
        
    }

    //when the player upgrades the cherry to lvl 3, the cherry has the ability to hit front and back
    private attackBackwards() : void {
        //check if the cherry defender is at lvl 3
        //if it is, attack both front and back instead of the front twice
        if (upgrade == 3 && this.canHit == true){

        }

    }
    
    
    private attemptStun(enemy : EnemyEntity[]) : void{

    }

}

export {Cherry};