import { EnemyEntity } from "../enemyEntity";
import { View } from "../view";

class Ant extends EnemyEntity {
    private regenerationActive : boolean = false;
    private aoeVulnerability : number = 0;

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
        
    }

    public killDefender() : void {
        this.regenerationActive = true;

        this.regen(1,2);
    }

    public override takeDamage(amount : number, isAOE : boolean = false) : void {
        let finalDamage = amount;

        if (isAOE) {
            finalDamage += finalDamage * this.aoeVulnerability;
        }

        super.takeDamage(finalDamage);
    }

    public setAoeVulnerability(amount : number) : void {
        this.aoeVulnerability = amount;
    }

    public isRegenerating() : boolean {
        return this.regenerationActive;
    }
}

export {Ant};