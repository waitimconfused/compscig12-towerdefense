import { EnemyEntity } from "../enemyEntity";
import { View } from "../view";

class Ant extends EnemyEntity {
    private regenerationActive : boolean;
    private aoeVulnerability : number;

    constructor(view: View, waveNumber: number) {
        const STATS = {
            health : 10,
            speed : 1,
            regeneration : 0
        }

        super(view, STATS, waveNumber, 1.1);
    }

    public spawn(wave : number) : void {
        
    }

    public attackClosest() : void {

    }

    public killDefender() : void {
        this.regenerationActive = true;

        this.regen(1,2)
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