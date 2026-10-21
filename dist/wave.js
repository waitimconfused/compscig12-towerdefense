import { EnemyEntity } from "./entity/enemy.js";
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
    static _waveCoolDown = 1_0000;
    static _timeLeft = 1_0000;
    static update(deltaTime) {
        let waveActive = false;
        let entities = [...Entity.entities.keys()];
        for (let i = 0; i < entities.length; i++) {
            let id = entities[i];
            let entity = Entity.entities.get(id);
            if (entity instanceof EnemyEntity == false)
                continue;
            waveActive = true;
            break;
        }
        if (waveActive == true)
            return;
        this._timeLeft -= deltaTime;
        if (this._timeLeft > 0)
            return;
        this.newWave();
        this._waveCoolDown -= 500;
        this._waveCoolDown = Math.max(this._waveCoolDown, 0);
        this._timeLeft = this._waveCoolDown;
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
        this._waveNumber++;
        this.setWave(this._waveNumber);
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