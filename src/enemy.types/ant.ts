import { EnemyEntity } from "../enemyEntity";
import { View } from "../view";

class Ant extends EnemyEntity {
    private aoeVulnerability : number = 0.25;

    constructor(view: View, waveNumber: number) {
        const STATS = {
            health : 10,
            speed : 0.7,
            regeneration : 0
        }

        super(view, STATS, waveNumber, 1.1);
    }

    public spawn(x: number, y : number) : void {
        this.setPosition(x,y);
    }

    public attackClosest() : void {
        // placeholder
        const DEFENDER = this.getClosestTargetableEntity();
        if (!DEFENDER) return;

        DEFENDER.takeDamage(2);
    }

    public killDefender() : void {
        this.regen(1,2);
    }

    public override takeDamage(damage : number, isAOE : boolean = false) : void {
        let finalDamage = damage;

        if (isAOE) {
            finalDamage += finalDamage * this.aoeVulnerability;
        }

        super.takeDamage(finalDamage);
    }

    public setAoeVulnerability(amount : number) : void {
        this.aoeVulnerability = amount;
    }
}

export {Ant};