export class Entity {
    _id;
    get id() { return this._id; }
    stunned = false;
    currentRegenerationStacks = 0;
    slowed = false;
    slowStacks = 0;
    invulnerable = false;
    static displayName;
    static getDisplayName() {
        return this.displayName ?? this.name;
    }
    static showInInventory = true;
    static idLength = 3;
    _state = "idle";
    updateRenderCache = false;
    set state(state) {
        if (this._state != state) {
            this.updateRenderCache = true;
        }
        this._state = state;
    }
    get state() { return this._state; }
    position = [0, 0];
    stats;
    static level = 0;
    static baseStats;
    static statIncreaseMultiplier = 1;
    static maxLevel = 0;
    _targetPosition = null;
    _targetPositionRange = 0;
    _targetPath = null;
    _targetPathLength = 0;
    _targetPathMaxLength = 0;
    internalTimers = [];
    brainActive = false;
    isDead = false;
    static entities = new Map();
    static derived = new Map();
    constructor(position) {
        let constructor = this.constructor;
        let displayName = constructor?.displayName ?? constructor.name;
        Entity.derived.set(displayName, constructor);
        if (!constructor.baseStats)
            throw new Error(`Entity ${constructor.name} does not have baseStats.`);
        this.position = position;
        this.reloadStats();
        this._id = "";
        while (this._id == "" || Entity.entities.has(this._id)) {
            this._id = Math.floor(Math.random() * 999999)
                .toString(16)
                .padStart(6, "0");
        }
        Entity.entities.set(this._id, this);
    }
    _direction = 0;
    get direction() {
        return this._direction;
    }
    set direction(rad) {
        this._direction = rad;
        this.updateRenderCache = true;
    }
    wait(milliseconds, ticker) {
        return new Promise((resolve, reject) => {
            this.internalTimers.push({
                type: "wait",
                trigger_time: performance.now() + milliseconds,
                complete: resolve,
                fail: reject,
                tick: ticker,
            });
        });
    }
    dealDamage(dealtDamage, attacker, damageType = 'melee') {
        return new Promise((resolve) => {
            if (this.invulnerable) {
                resolve(undefined);
                return;
            }
            let finalDamage = dealtDamage;
            this.stats.health -= finalDamage;
            this.updateRenderCache = true;
            this.interruptTimers(null, {
                triggered_by: attacker,
                interrupt_type: "attacked"
            });
            resolve(undefined);
        });
    }
    attackEntity(entity) {
        return new Promise((resolve) => {
            if (this.stunned) {
                resolve({ interrupt_type: "stunned" });
            }
            entity.dealDamage(this.stats.damage, this);
            resolve(undefined);
        });
    }
    walkTo(x, y, ticker) {
        return new Promise((resolve, reject) => {
            if (this.stunned) {
                resolve({ interrupt_type: "stunned" });
                return;
            }
            x = Math.round(x * 100) / 100;
            y = Math.round(y * 100) / 100;
            if (this.position[0] == x && this.position[1] == y) {
                resolve(undefined);
                return;
            }
            this._targetPosition = [x, y];
            this._targetPositionRange = 0;
            this._targetPath = null;
            this._targetPathLength = 0;
            this._targetPathMaxLength = 0;
            this.state = "walk";
            this.internalTimers.push({
                type: "walk",
                complete: resolve,
                fail: reject,
                tick: ticker
            });
        });
    }
    walkToEntity(entity, distance = 50, ticker) {
        return new Promise((resolve, reject) => {
            if (this.stunned) {
                resolve({ interrupt_type: "stunned" });
                return;
            }
            if (this.position[0] == entity.position[0] && this.position[1] == entity.position[1]) {
                resolve(undefined);
                return;
            }
            this._targetPosition = entity.position;
            this._targetPositionRange = distance;
            this.state = "walk";
            this.internalTimers.push({
                type: "walk",
                complete: resolve,
                fail: resolve,
                tick: ticker
            });
        });
    }
    followPath(path, ticker) {
        return new Promise(async (resolve, reject) => {
            let svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
            svg.setAttributeNS(null, "d", path);
            let startingPoint = svg.getPointAtLength(0);
            await this.walkTo(startingPoint.x, startingPoint.y);
            this._targetPath = svg;
            this._targetPathLength = 0;
            this._targetPathMaxLength = svg.getTotalLength();
            this._targetPosition = null;
            if (this.stunned) {
                resolve({ interrupt_type: "stunned" });
                return;
            }
            this.state = "walk";
            this.internalTimers.push({
                type: "walk",
                complete: resolve,
                fail: resolve,
                tick: ticker
            });
        });
    }
    reloadStats() {
        let constructor = this.constructor;
        let upgrade = constructor.baseStats;
        let level = constructor.level;
        let statIncreaseMultiplier = constructor.statIncreaseMultiplier;
        let storeUpgrades = Object.keys(upgrade);
        if (!constructor.baseStats) {
            throw new Error(`Entity ${constructor.name} must specify baseStats.`);
        }
        if (!this.stats)
            this.stats = {};
        for (let i = 0; i < storeUpgrades.length; i++) {
            let statType = storeUpgrades[i];
            let statValue = upgrade[statType];
            this.stats[statType] = statValue * (1 + level * statIncreaseMultiplier);
        }
    }
    static spawn(count = 1, position, spreadAmount) {
        let entities = [];
        if (count < 1)
            count = 1;
        for (let i = 0; i < count; i++) {
            let location = [position[0], position[1]];
            if (spreadAmount) {
                let angle = Math.random() * 2 * Math.PI;
                let magnitude = Math.random() * spreadAmount;
                magnitude = Math.round(magnitude * 100) / 100;
                location[0] += Math.cos(angle) * magnitude;
                location[1] += Math.sin(angle) * magnitude;
                location[0] = Math.round(location[0] * 100) / 100;
                location[1] = Math.round(location[1] * 100) / 100;
            }
            console.log("Spawned", this.name);
            let instance = new this(location);
            entities.push(instance);
        }
        return entities;
    }
    static upgrade() {
        if (this.level < this.maxLevel)
            return;
        this.level += 1;
        let entities = [...Entity.entities.values()];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity instanceof this == false)
                continue;
            entity.reloadStats();
        }
    }
    interruptTimers(selector, reason) {
        for (let i = 0; i < this.internalTimers.length; i++) {
            let timer = this.internalTimers[i];
            if (selector && timer.type != selector)
                continue;
            if (reason && reason.interrupt_type != "success")
                timer.fail(reason);
            else
                timer.complete(reason);
            this.internalTimers.splice(i, 1);
        }
    }
    movementTick(targetPosition, deltaTime) {
        let direction = Math.atan((targetPosition[1] - this.position[1]) /
            (targetPosition[0] - this.position[0])) || 0;
        if (targetPosition[0] < this.position[0])
            direction += Math.PI;
        this.direction = direction;
        let totalDistance = Math.hypot(targetPosition[0] - this.position[0], targetPosition[1] - this.position[1]);
        let currentSpeed = this.stats.speed * deltaTime;
        if (totalDistance <= this._targetPositionRange) {
            this.position[0] += (totalDistance - this._targetPositionRange) * Math.cos(direction);
            this.position[1] += (totalDistance - this._targetPositionRange) * Math.sin(direction);
            return;
        }
        if (totalDistance < currentSpeed) {
            this.position[0] = targetPosition[0];
            this.position[1] = targetPosition[1];
            return;
        }
        if (currentSpeed == 0)
            return;
        this.position[0] += currentSpeed * Math.cos(direction);
        this.position[1] += currentSpeed * Math.sin(direction);
        this.position[0] = Math.round(this.position[0] * 100) / 100;
        this.position[1] = Math.round(this.position[1] * 100) / 100;
    }
    tick(deltaTime) {
        if (this.stats.health <= 0 && this.isDead == false) {
            this.isDead = true;
            let deathReturnValue = this.onDeath();
            if (deathReturnValue instanceof Promise) {
                deathReturnValue.then(() => {
                    Entity.entities.delete(this._id);
                });
            }
            else {
                Entity.entities.delete(this._id);
            }
        }
        if (!this.brainActive && this.state != "dead") {
            this.brainActive = true;
            this.brain().then(() => {
                this.state = "idle";
                this.brainActive = false;
            });
        }
        for (let i = 0; i < this.internalTimers.length; i++) {
            let timer = this.internalTimers[i];
            if (timer.type != "wait")
                continue;
            let triggerTime = timer.trigger_time;
            if (timer.tick)
                timer.tick(() => {
                    this.internalTimers.splice(i, 1);
                    i -= 1;
                });
            if (triggerTime > performance.now())
                continue;
            timer.complete(undefined);
            this.internalTimers.splice(i, 1);
            i -= 1;
        }
        if (this._targetPosition && !this.stunned) {
            this.movementTick(this._targetPosition, deltaTime);
            for (let i = 0; i < this.internalTimers.length; i++) {
                let timer = this.internalTimers[i];
                if (timer.type != "walk")
                    continue;
                if (timer.tick)
                    timer.tick(() => {
                        this.internalTimers.splice(i, 1);
                        i -= 1;
                    });
            }
            let totalDistance = Math.hypot(this._targetPosition[0] - this.position[0], this._targetPosition[1] - this.position[1]);
            if (totalDistance <= this._targetPositionRange) {
                this._targetPosition = null;
                this._targetPositionRange = 0;
                this._targetPath = null;
                this._targetPathLength = 0;
                this._targetPathMaxLength = 0;
                this.state = "idle";
                this.interruptTimers("walk");
            }
        }
        else if (this._targetPath && !this.stunned) {
            let rawPosition = this._targetPath.getPointAtLength(this._targetPathLength);
            let newPosition = [rawPosition.x, rawPosition.y];
            this._targetPathLength += this.stats.speed * deltaTime;
            let direction = Math.atan((newPosition[1] - this.position[1]) /
                (newPosition[0] - this.position[0])) || 0;
            if (newPosition[0] < this.position[0])
                direction += Math.PI;
            this.direction = direction;
            this.position[0] = newPosition[0];
            this.position[1] = newPosition[1];
            for (let i = 0; i < this.internalTimers.length; i++) {
                let timer = this.internalTimers[i];
                if (timer.type != "walk")
                    continue;
                if (timer.tick)
                    timer.tick(() => {
                        this.internalTimers.splice(i, 1);
                        i -= 1;
                    });
            }
            if (this._targetPathLength >= this._targetPathMaxLength) {
                this._targetPath = null;
                this._targetPositionRange = 0;
                this._targetPathLength = 0;
                this._targetPathMaxLength = 0;
                this._targetPosition = null;
                this.state = "idle";
                this.interruptTimers("walk");
            }
        }
    }
    static nearestEntity(origin, selector) {
        let nearest = undefined;
        let nearestDistance = Infinity;
        let entityIds = [...Entity.entities.keys()];
        for (let i = 0; i < entityIds.length; i++) {
            let id = entityIds[i];
            let entity = Entity.entities.get(id);
            if (selector && entity instanceof selector == false)
                continue;
            let distance = this.getDistance(origin, entity);
            if (distance < nearestDistance) {
                nearest = entity;
                nearestDistance = distance;
            }
        }
        return nearest;
    }
    static totalEntitiesInRange(origin, range, selector) {
        let entitiesInRange = [];
        let entities = [...Entity.entities.values()];
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (selector && entity instanceof selector == false)
                continue;
            let distance = this.getDistance(origin, entity);
            if (distance <= range) {
                entitiesInRange.push(entity);
            }
        }
        return entitiesInRange;
    }
    static getDistance(origin, target) {
        return Math.hypot(target.position[0] - origin.position[0], target.position[1] - origin.position[1]);
    }
}
//# sourceMappingURL=entity.js.map