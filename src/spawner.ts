import { View } from "./view.js";
import { Ant } from "./enemy.types/ant.js";
import { Raccoon } from "./enemy.types/raccoon.js";

class Spawner {
    private view : View;
    
    constructor(view : View) {
        this.view = view;
    }

    public spawnAntCluster(waveNumber : number, x : number, y : number) : void {
        const SPECIAL_CLUSTER = Math.random()
    }
}