//import the vie and the basic entity class
import { Entity } from "./entity.js";
import { View } from "./view.js";

class DefenderEntity extends Entity{
    //assign basic properties for all defenders
    //the defender level
    private _defenderBaseStats: {
        defenderLvl : number,
        //the cooldown for how often the player can deploy a defender
        deployCooldown : number,
        //the cooldown of the defender and their attack
        attackCooldown : number,
        //the cost of deploying the defender
        defenderCost : number,
        //the cost of upgrading the defender
        defenderUpgradeCost : number,
        //the amount of money returned when selling a defender (defenders can only be sold if they have not been deployed)
        defenderSoldCost : number,
        //the amount of points the player gets when upgrading aspects of a defender
        defenderUpgradePoints : number,
        //defender attack damage
        defenderAttackDamage : number
    }
    public get defenderBaseStats() {return this._defenderBaseStats};

    //the knockback strength of a defender - all have a knockback strength of 3
    private _knockbackStrength : number;
    public get knockbackStrength() {return this._knockbackStrength};
   
    //check if defender has been stunned
    private _isStunned : boolean = false;
    public get isStunned() {return this._isStunned};

    //check if defender is in cooldown for attack
    private _isOnAttackCooldown : boolean = false;
    public get isOnAttackCooldown() {return this._isOnAttackCooldown};

    //whether or not the Cherry has any modifiers/cooldown that prevents them from currently attacking
    public  canHit : boolean = true;

    //whether the defender has been slowed down

    private _hasBeenSlowed : number;
    public get hasBeenSlowed() {return this._hasBeenSlowed};

    

    constructor(
        view: View,
        stats: {
            health : number; speed : number; regeneration: number
        },
        defenderBaseStats: {
            defenderLvl : number, deployCooldown : number, 
            attackCooldown : number, defenderCost : number,
            defenderUpgradeCost : number, defenderSoldCost : number,
            defenderUpgradePoints : number, defenderAttackDamage : number;
        },
        knockbackStrength : number,
    ){
        super(view, {health: stats.health, speed: stats.speed, });
            
        this._defenderBaseStats = defenderBaseStats;
        this._knockbackStrength = knockbackStrength; 
    }

    /**
     * spawn in the defenders that are moving towards the enemy base from the main base
     * @param x the x coordinate
     * @param y the y coordinate
     */
    public spawnMovingDefender(x:number, y:number) : void{
        this.position = [x,y];
    }
    
    /**
     * begin the hit cooldown for the defender
     * @param time time in milliseconds
     * @returns returns a promise that resolves after the attackcooldown in milliseconds has passed
     */
    public beginHitCooldown(time : number) : Promise<void>{
        return wait(this.beginHitCooldown*1000);
    }

    /**
     * begin the deploy cooldown for the defender
     * @param time time in milliseconds
     * @returns returns a promise that resolves after the deploycooldown in milliseconds has passed
     */
    public beginDeployCooldown(time : number) : Promise<void>{
        return wait(this.beginDeployCooldown*1000);
    }

    /**
     * check if the defender can hit enemies at the moment
     * @returns returns whether they can or cannot through a boolean
     */
    public checkCanHit() : boolean {
        //if the defender is stunned or is on cooldown, they cannot hit
        if (this.isStunned == true || this.isOnAttackCooldown == true){
            this.canHit = false;
        }
        //otherwise they may hit the enemy
        else{
            this.canHit = true;
        }

        //return the boolean 
        return this.canHit;
    }
}

export {DefenderEntity};