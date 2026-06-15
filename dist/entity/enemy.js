import Inventory from "../inventory.js";
import { Wave } from "../wave.js";
import { Entity } from "./entity.js";
;
export class EnemyEntity extends Entity {
    spawnLocation = [0, 0];
    static path = "M0 50.0634C311.161 43.5073 285.567 549.586 561.679 457.548C837.79 365.511 1133.82 328.192 1160.05 573.793C1186.27 819.393 693.305 992.373 577.06 751.311C460.816 510.249 486.752 130.908 881.377 115.526C1276 100.145 1478.86 273.376 1553.5 492.5C1613.21 667.8 1797.04 726.431 1900 700.88";
    static baseStats;
    reloadStats() {
        super.reloadStats();
        let waveNumber = Wave.getWave();
        let scale = Math.pow(1.10, waveNumber - 1);
        this.stats.health = Math.floor(this.stats.health * scale);
    }
    onDeath() {
        this.state = 'dead';
        this.dropItems();
    }
    dropItems() {
        Inventory.give("coin", this.drops.coins);
        Inventory.give("point", this.drops.points);
        for (let drop of this.drops.materials) {
            if (Math.random() <= drop.chance) {
                Inventory.give(drop.type, drop.amount);
            }
        }
    }
}
//# sourceMappingURL=enemy.js.map