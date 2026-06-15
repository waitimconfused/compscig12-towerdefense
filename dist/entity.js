export class Entity {
    parentView;
    position = [0, 0];
    walkingTo = [0, 0];
    _health;
    get health() { return this._health; }
    ;
    _maxHealth;
    get maxHealth() { return this._maxHealth; }
    ;
    _stats;
    get stats() { return this._stats; }
    ;
    modifers;
    _currentUpgrade;
    get currentUpgrade() { return this._currentUpgrade; }
    ;
    _upgradeData;
    get upgradeData() { return this._upgradeData; }
    ;
    constructor(view, stats) {
        this.parentView = view;
        this._stats = stats;
        this._maxHealth = stats.health;
        this._health = stats.health;
    }
    walkToPosition(x, y) {
        this.walkingTo = [x, y];
    }
    getClosestEntity() {
        return null;
    }
    getClosestTargetableEntity() {
        return null;
    }
    setPosition(x, y) {
        this.position = [x, y];
    }
    setState(state) {
    }
    setHealth(value) {
        this._health = Math.max(0, Math.min(value, this._maxHealth));
        if (this._health == 0) {
            this.onDeath();
        }
    }
    takeDamage(damage) {
        if (!this.isAlive) {
            return;
        }
        this.setHealth(this._health - damage);
    }
    heal(amount) {
        this._health = Math.min(this._health + amount, this._maxHealth);
    }
    isAlive() {
        return this._health > 0;
    }
    onDeath() {
    }
}
//# sourceMappingURL=entity.js.map