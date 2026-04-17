import { Entity } from "./entity";
import { View } from "./view";

type EnemyDrops = {
    coins: number;
    points: number;
    materialDropRate: { [material: string]: number };
};

class EnemyEntity extends Entity {
    private waveNumber: number;

    private stunned: boolean = false;
    
    private regenInterval: number | null = null;
    private stunTimeout: number | null = null;

    private drops: EnemyDrops = {
        coins: 0,
        points: 0,
        materialDropRate: {}
    };
    
    constructor(
        view: View,
        stats: { health: number; speed: number; regeneration: number },
        waveNumber: number,
        healthScale: number
    ) {
        const SCALED_HEALTH = Math.floor(
            stats.health * (healthScale ** (waveNumber - 1))
        );
    
        super(view, {
            health: SCALED_HEALTH,
            speed: stats.speed,
            regeneration: stats.regeneration
        });
    
        this.waveNumber = waveNumber;
    }

    public isStunned(): boolean {
        return this.stunned;
    }

    public getWaveNumber(): number {
        return this.waveNumber;
    }

    public getSpeed(): number {
        return this.stats.speed;
    }
    
    public stun(duration: number): void {
        this.stunned = true;
    
        if (this.stunTimeout) {
            clearTimeout(this.stunTimeout);
        }
    
        this.stunTimeout = setTimeout(() => {
            this.stunned = false;
            this.stunTimeout = null;
        }, duration * 1000);
    }
    
    private regenTick(hpPerSecond: number): void {
        if (!this.isAlive()) return;
        if (this.stunned) return;
    
        this.heal(hpPerSecond);
    }
    
    public regen(hpPerSecond: number, duration: number): void {
        let totalTime = 0;
    
        if (this.regenInterval !== null) {
            clearInterval(this.regenInterval);
        }
    
        this.regenInterval = setInterval(() => {
            if (totalTime >= duration || !this.isAlive()) {
                clearInterval(this.regenInterval!);
                this.regenInterval = null;
                return;
            }
    
            this.regenTick(hpPerSecond);
    
            totalTime++;
        }, 1000);
    }

    public enemyDamaged(): void {

    }

    public setDrops(drops: EnemyDrops): void {
        this.drops = drops;
    }

    private handleDrops(): void {

    }
    
    public override onDeath(): void {
        
        if (this.stunTimeout != null) {
            clearTimeout(this.stunTimeout);
            this.stunTimeout = null;
        }
        
        if (this.regenInterval != null) {
            clearInterval(this.regenInterval);
            this.regenInterval = null;
        }

        this.handleDrops();
    }
}

export { EnemyEntity };