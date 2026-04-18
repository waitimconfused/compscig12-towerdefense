//import the vie and the basic entity class
import { Entity } from "./entity.js";
import { View } from "./view.js";

class DefenderEntity extends Entity{
    //assign basic properties for all defenders
    //the defender level
    private defenderLvl : number;
    //the cooldown for how often the player can deploy a defender
    private spawnCooldown : number;
    //the cooldown of the defender and their attack
    private attackCooldown : number;
    //the cost of deploying the defender
    private defenderCost : number;
    //the cost of upgrading the defender
    private defenderUpgradeCost : number;
    //the amount of money returned when selling a defender (defenders can only be sold if they have not been deployed)
    private defenderSoldCost : number;
    //the knockback strength of a defender - all have a knockback strength of 3
    private knockbackStrength : number = 3;
    //the amount of points the player gets when upgrading aspects of a defender
    private defenderUpgradePoints : number;
    //check if defender has been stunned
    private isStunned : boolean = false;
    //defender attack damage
    private defenderAttackDamage : number;

    /**
     * passes through all the properties
     * @param theDefenderLvl 
     * @param theSpawnCooldown 
     * @param theAttackCooldown 
     * @param theDefenderCost 
     * @param theDefenderSoldCost 
     * @param theDefenderUpgradePoints 
     * @param theDefenderAttackDamage
     */
   
    constructor (view: View,
        stats: { health: number; speed: number; regeneration: number }, 
        theDefenderLvl : number, theSpawnCooldown : number, theAttackCooldown : number, 
        theDefenderCost : number, theDefenderSoldCost : number, theDefenderUpgradePoints : number, 
        theDefenderUpgradeCost : number, theDefenderAttackDamage : number){

        super(view, {
            health: stats.health,
            speed: stats.speed,
            regeneration: stats.regeneration
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

    public spawnMovingDefender(x:number, y:number) : void{
        this.position = [x,y];
    }
}

export {DefenderEntity};