import { View } from "./view.js";
import { Ant } from "./enemy.types/ant.js";
import { Raccoon } from "./enemy.types/raccoon.js";
import { EnemyEntity } from "./enemyEntity.js";

export class Spawner {
    private view : View;
    
    constructor(view : View) {
        this.view = view;
    }

    public spawnEnemy(enemyType : EnemyEntity, x : number, y : number) : void {
        
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