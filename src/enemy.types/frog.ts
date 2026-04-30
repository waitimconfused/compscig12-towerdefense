import { View } from "../view";
import { Entity } from "../entity";
import { EnemyEntity } from "../enemyEntity";
import { DefenderEntity } from "../defenderentity";
import { RenderingContext } from "../types";

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

    public override render(canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteReference : string;

        switch (this.state) {
            case 'idle':
                spriteReference = 'frog-idle';
                break;
        
            case 'run':
                spriteReference = 'frog-run';
                break;

            case 'attack':
                spriteReference = 'frog-attack';
                break;

            default:
                break;
        }
    }
}