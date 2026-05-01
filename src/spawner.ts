import { View } from "./view.js";
import { Ant } from "./enemy.types/ant.js";
import { Raccoon } from "./enemy.types/raccoon.js";
import { Wasp } from "./enemy.types/wasp.js";
import { Frog } from "./enemy.types/frog.js";

/**
 * Class to spawn entities at a specified location
 * Creates defender and enemy entities
 */
export class Spawner {
    private view : View;
    
    constructor(view : View) {
        this.view = view;
    }

    /**
     * Creates a new enemy and sets their initial position as the location of the enemy spawn
     * @param enemyType The enemy type to spawn
     * @param waveNumber The current wave number the enemy is spawned in
     */
    public spawnEnemy(enemyType : Raccoon | Wasp | Frog, waveNumber : number) : Raccoon | Wasp | Frog {
        // Stores the created enemy
        let enemy;

        /** Checks the enemy type
         *  Constructs and sets enemy position to the enemy spawn
         */
        if (enemyType instanceof Raccoon) {
            enemy = new Raccoon(this.view, waveNumber);
        } else if (enemyType instanceof Wasp) {
            enemy = new Wasp(this.view, waveNumber);
        } else {
            enemy = new Frog(this.view, waveNumber);
        }

        enemyType.setPosition(0, 0);
        return enemy;
    }

    /**
     * Special spawner to spawn a random number of ants in a cluster
     * Spawns 3-8 ants at the enemy spawn
     * Has a small chance to spawn an extra waveNumber amount of ants up to a maximum of 10 extra ants
     * @param waveNumber 
     * @param x 
     * @param y 
     */
    public spawnAntCluster(waveNumber : number) : Ant[] {
        // Stores ants as a cluster
        let ant : Ant[] = [];

        // Chance to spawn a special ant cluster
        const SPAWN_SPECIAL_CLUSTER = Math.random();

        // Gets number of waveNumber and 10 as number of ants to spawn
        let cluster : number = Math.min(waveNumber, 10);

        // Random number of ants to spawn from 3-8
        let randomAnts : number = Math.floor(Math.random() * 6 + 3);

        // Tracks the number of ants to spawn
        let count : number;

        /**
         * 10% chance to spawn a special ant cluster
         * Special cluster spawns 'cluster' number of extra ants, otherwise spawns 3-8 ants
         */
        if (SPAWN_SPECIAL_CLUSTER <= 0.1) {
            count = cluster + randomAnts;
        } else {
            count = randomAnts;
        }

        // Creates 'count' number of ants and sets position to enemy spawn
        for (let i = 0; i < count; i++) {
            const NEW_ANT = new Ant(this.view, waveNumber);

            NEW_ANT.setPosition(0,0);
            ant.push(NEW_ANT);
        }

        return ant;
    }
}