import { View } from "./view.js";
import { Ant } from "./enemy.types/ant.js";
import { EnemyEntity } from "./enemyEntity.js";
import { Raccoon } from "./enemy.types/raccoon.js";
import { Wasp } from "./enemy.types/wasp.js";
import { Frog } from "./enemy.types/frog.js";

export class Spawner {
    private view : View;
    
    constructor(view : View) {
        this.view = view;
    }

    public spawnEnemy(enemyType : Raccoon | Wasp | Frog, x : number, y : number, waveNumber : number) : void {
        if (enemyType instanceof Raccoon) {
            new Raccoon(this.view, waveNumber);
        }s
    }

    public spawnAntCluster(waveNumber : number, x : number, y : number) : void {
        const SPAWN_SPECIAL_CLUSTER = Math.random();
        let cluster : number = Math.min(waveNumber, 20);
        let randomAnts : number = Math.floor(Math.random() * 6 + 3);
        let count : number;

        if (SPAWN_SPECIAL_CLUSTER < 0.1) {
            count = cluster;
        } else {
            count = randomAnts;
        }

        for (let i = 0; i < count; i++) {
            const ant = new Ant(this.view, waveNumber);

            ant.spawn(0,0);
        }
    }
}