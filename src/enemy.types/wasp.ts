import { View } from "../view";
import { EnemyEntity } from "../enemyEntity";
import { DefenderEntity } from "../defenderentity";
import { RenderingContext } from "../types";

export class Wasp extends EnemyEntity {
    public isFlying : boolean = true;

    constructor(view : View, waveNumber : number) {
        const STATS = {
            health : 30,
            speed : 1.1,
        }

        super(view, STATS, waveNumber, 1.15);

        this.setDrops({
            coins : 1,
            points : 1,
            materialDropRate : {
                'Fake Honey' : 0.25
            }
        })
    }

    public spawn(x : number, y : number) {
        this.setPosition(x,y);
    }

    public attemptStun(target : DefenderEntity) {
        let chance = Math.random();

        if (chance <= 0.35) {
            target.takeDamage(10);
            target.stun(2);

            this.stats.speed += 0.1;
        }
    }

    public override render(canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteReference : string;

        switch (this.state) {
            case 'idle' :
                spriteReference = 'wasp-idle';
                break;
            
            case 'run' :
                spriteReference = 'wasp-run';
                break;
            
            case 'attack' :
                spriteReference = 'wasp-attack';
                break
            
            default :
                break;
        }
    }
}