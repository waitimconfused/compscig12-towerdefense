import { Ant } from "./enemy.types/ant.js";
import { Raccoon } from "./enemy.types/raccoon.js";
export class Spawner {
    view;
    constructor(view) {
        this.view = view;
    }
    spawnEnemy(enemyType, x, y, waveNumber) {
        if (enemyType instanceof Raccoon) {
            new Raccoon(this.view, waveNumber);
        }
    }
    spawnAntCluster(waveNumber, x, y) {
        const SPAWN_SPECIAL_CLUSTER = Math.random();
        let cluster = Math.min(waveNumber, 20);
        let randomAnts = Math.floor(Math.random() * 6 + 3);
        let count;
        if (SPAWN_SPECIAL_CLUSTER < 0.1) {
            count = cluster;
        }
        else {
            count = randomAnts;
        }
        for (let i = 0; i < count; i++) {
            const ant = new Ant(this.view, waveNumber);
            ant.spawn(0, 0);
        }
    }
}
//# sourceMappingURL=spawner.js.map