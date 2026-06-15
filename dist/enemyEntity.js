import { Entity } from "./entity.js";
export class EnemyEntity extends Entity {
    waveNumber;
    stunned = false;
    regenInterval = null;
    stunTimeout = null;
    drops = {
        coins: 0,
        points: 0,
        materialDropRate: {}
    };
    constructor(view, stats, waveNumber, healthScale) {
        const SCALED_HEALTH = Math.floor(stats.health * (healthScale ** (waveNumber - 1)));
        super(view, {
            health: SCALED_HEALTH,
            speed: stats.speed,
        });
        this.waveNumber = waveNumber;
    }
    isStunned() {
        return this.stunned;
    }
    getWaveNumber() {
        return this.waveNumber;
    }
    getSpeed() {
        return this.stats.speed;
    }
    stun(duration) {
        this.stunned = true;
        if (this.stunTimeout) {
            clearTimeout(this.stunTimeout);
        }
        this.stunTimeout = setTimeout(() => {
            this.stunned = false;
            this.stunTimeout = null;
        }, duration * 1000);
    }
    regenTick(hpPerSecond) {
        if (!this.isAlive())
            return;
        if (this.stunned)
            return;
        this.heal(hpPerSecond);
    }
    regen(hpPerSecond, duration) {
        let totalTime = 0;
        if (this.regenInterval != null) {
            clearInterval(this.regenInterval);
        }
        this.regenInterval = setInterval(() => {
            if (totalTime >= duration || !this.isAlive()) {
                clearInterval(this.regenInterval);
                this.regenInterval = null;
                return;
            }
            this.regenTick(hpPerSecond);
            totalTime++;
        }, 1000);
    }
    setDrops(drops) {
        this.drops = drops;
    }
    handleDrops() {
    }
    onDeath() {
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
//# sourceMappingURL=enemyEntity.js.map