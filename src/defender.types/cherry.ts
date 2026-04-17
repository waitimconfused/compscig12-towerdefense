import {DefenderEntity} from "../defenderentity.js";

class Cherry extends DefenderEntity{
    //create the unique properties for the defender "cherry"
    private stunChance : number;
    private hitCooldown : number;
    private canHit : boolean;
    

    /**
     * passes through all the properties
     * @param theDefenderLvl 
     * @param theSpawnCooldown 
     * @param theAttackCooldown 
     * @param theDefenderCost 
     * @param theDefenderSoldCost 
     * @param theKnockbackStrength 
     * @param theDefenderUpgradePoints 
     */
    constructor (theDefenderLvl : number = 1, theSpawnCooldown : number = 3, 
        theAttackCooldown : number = 3, theDefenderCost : number = 10, 
        theDefenderSoldCost : number = 3, theKnockbackStrength : number = 3, 
        theDefenderUpgradePoints : number = 10, theDefenderUpgradeCost : number = 10){
        super(theDefenderLvl, theSpawnCooldown, theAttackCooldown, 
            theDefenderCost, theDefenderSoldCost, theKnockbackStrength, 
            theDefenderUpgradePoints, theDefenderUpgradeCost);
        
    }

    //when the player upgrades the cherry to lvl 3, the cherry has the ability to hit front and back
    private attackBackwards(upgrade : number) : void {
        //check if the cherry defender is at lvl 3
        //if it is, attack both front and back instead of the front twice
        if (upgrade == 3){

        }

    }

    //
    //private attemptStun(enemy : EnemyEntity[]) : void{

    //}

}