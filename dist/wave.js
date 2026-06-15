import { Ant } from "./entity/enemy.types/ant.js";
import { Frog } from "./entity/enemy.types/frog.js";
import { Raccoon } from "./entity/enemy.types/raccoon.js";
import { Wasp } from "./entity/enemy.types/wasp.js";
import { Entity } from "./entity/entity.js";
import { StaticClass } from "./types.js";
export class Wave extends StaticClass {
    static _waveNumber = 0;
    static getWave() { return this._waveNumber; }
    ;
    static _waveDuration = 60000;
    static _timeLeft = 60000;
    static _waveActive = true;
    static _waveInitialized = false;
    static update(t) {
        if (!this._waveInitialized)
            return;
        this._timeLeft -= t;
        let enemyDead = true;
        for (const entity of Entity.entities.values()) {
            if (entity.entityType.startsWith("enemy")) {
                enemyDead = false;
                break;
            }
        }
        if ((this._timeLeft <= 0 || enemyDead) && this._waveActive) {
            this._waveActive = false;
            this.newWave();
            this._waveDuration += 2000;
            this._timeLeft = this._waveDuration;
            this._waveActive = true;
        }
    }
    static setWave(number = this._waveNumber) {
        this._waveNumber = number;
        Ant.antSpawn([0, 0], 100);
        Raccoon.spawn(1, [100, 100], 2);
        Wasp.spawn(1, [100, 100], 2);
        if (this._waveNumber % 2 == 0) {
            Frog.spawn(1, [100, 100], 2);
        }
        if (this._waveNumber % 3 == 0) {
            Wasp.spawn(1, [100, 100], 2);
        }
        if (this._waveNumber % 5 == 0) {
            Raccoon.spawn(1, [100, 100], 2);
        }
    }
    static newWave() {
        this._waveInitialized = true;
        this._waveNumber++;
        this.setWave();
    }
    static killThemEnemies() {
        for (let entity of Entity.entities.values()) {
            if (entity.entityType.startsWith("enemy"))
                entity.stats.health = 0;
        }
    }
}
window.Wave = Wave;
//# sourceMappingURL=wave.js.map