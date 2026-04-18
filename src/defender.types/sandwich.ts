//import the defenderentity, enemyentity, and view classes
import { DefenderEntity } from "../defenderentity.js";
import {EnemyEntity} from "enemyEntity.js";
import { View } from "../view.js";

class Sandwich extends DefenderEntity{
    //create the unique properties for the defender "sandwich"
    //check for sandwich sprite layer count (how much damage it has taken)
    private sandwichLayerCount : number = 4;
    //when the sandwich is upgraded to lvl 3, it increases the amount of layers in the sandwich by 3
    private increaseSandwichLayers : boolean = false;
    
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
            health : 40,
            speed : 0,
            regeneration : 0
        };
        const DEFENDERBASESTATS = {
            defenderLvl : 1,
            deployCooldown : 5,
            attackCooldown : 0,
            defenderCost : 25,
            defenderSoldCost : 6,
            defenderUpgradeCost : 30,
            defenderUpgradePoints : 10,
            defenderAttackDamage : 0
        };

        super(view, STATS, DEFENDERBASESTATS, knockbackStrength);
        
    }

    /**
     * check whether the sandwich has taken enough hits to show visual damage
     */
    private checkSandwichStatus() : void{
        //divide the max health by the total number of layers, and decrease the layers per increment
        if (this.health <= (this.maxHealth/this.sandwichLayerCount)*this.sandwichLayerCount-1){
            this.sandwichLayerCount --;
        }
        
    }

    /**
     * when enemies come near, the sandwich will deflect damage
     * @param target the enemy
     * @returns if there is no target, do not deflect
     */
    public deflectDamage(target : EnemyEntity) : void{
        //if there is no target or there is some modifier/cooldown that prevents them from hitting, do not attack
        if (!target) {
            return;
        }
        //otherwise, when the enemy comes by, the enemy will take damage based off of 10% of their attack damage
        else{
            target.takeDamage(this.enemyAttackDamage/10);
        }
        //check if there is a need for a sprite change for the sandwich to show damage
        this.checkSandwichStatus();

    }

    /**
     * check to see if the cherry is at the max upgrade 
     * if it is, it can now hit enemies from the front and behind
     * @returns returns the boolean value of whether the cherry can now attack front and back
     */
    public sandwichMaxUpgrade () : boolean {
        //if the cherry is at lvl 3, it is at max lvl and can use its new ability
        if (this.defenderBaseStats.defenderLvl == 3){
            this.increaseSandwichLayers = true;
            this.sandwichLayerCount = this.sandwichLayerCount + 3;
        }
        //otherwise, stay doing the same of only attacking enemies in front of them
        else{
            this.increaseSandwichLayers = false;
        }

        return this.increaseSandwichLayers;
    }

}

export {Sandwich};