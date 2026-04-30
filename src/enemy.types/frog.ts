import { View } from "../view";
import { EnemyEntity } from "../enemyEntity";

export class Frog extends EnemyEntity {
    public isLeaping : boolean;
    public canLeap : boolean = true;

    constructor (view : View, waveNumber : number) {
        const STATS = {
            health : 1,
            speed : 0.8
        }

        super(view, STATS, waveNumber, 1.15);

        this.setDrops({
            coins : 123,
            points : 1,
            materialDropRate : {
                'jar' : 1
            }
        })
    }

    public override render() : string {
        switch (this.state) {
            case 'idle':
                return 'frog-idle';
        
            case 'run':
                return 'frog-run';

            case 'attack':
                return 'frog-attack';

            default:
                return 'frog-idle';
        }
    }
}