import { StaticClass } from "../types.js";
export class StatusEffects extends StaticClass {
    static async stunEntity(target, duration) {
        if (target.stunned) {
            return;
        }
        target.stunned = true;
        target.interruptTimers(null, {
            interrupt_type: 'stunned'
        });
        await target.wait(duration);
        target.stunned = false;
        target.state = 'idle';
    }
    static async regenerateEntity(regeneratingEntity, duration, regenerationAmount) {
        if (regeneratingEntity.currentRegenerationStacks >= 3) {
            return;
        }
        regeneratingEntity.currentRegenerationStacks++;
        let regeneratingEntityConstructor = regeneratingEntity.constructor;
        const TICK_RATE = 500;
        let totalTime = 0;
        while (totalTime < duration) {
            if (regeneratingEntity.stats.health <= 0) {
                regeneratingEntity.currentRegenerationStacks = 0;
                break;
            }
            let level = regeneratingEntityConstructor.level;
            let currentUpgrade = regeneratingEntityConstructor.baseStats;
            regeneratingEntity.stats.health = Math.min(regeneratingEntity.stats.health + regenerationAmount, currentUpgrade.health);
            await regeneratingEntity.wait(TICK_RATE);
            totalTime += TICK_RATE;
        }
        regeneratingEntity.currentRegenerationStacks--;
    }
    static async slowEntity(target, duration) {
        let constructor = target.constructor;
        if (!constructor.baseStats) {
            return;
        }
        target.slowStacks++;
        target.slowed = true;
        if (target.slowStacks == 1) {
            target.stats.speed *= 0.75;
        }
        if (target.entityType == 'enemy/frog') {
            target.canLeap = false;
        }
        await target.wait(duration);
        target.slowStacks--;
        if (target.slowStacks <= 0) {
            target.stats.speed = constructor.baseStats.speed;
            ;
            target.slowed = false;
            if (target.entityType == 'enemy/frog') {
                target.canLeap = true;
            }
        }
    }
}
//# sourceMappingURL=statusEffects.js.map