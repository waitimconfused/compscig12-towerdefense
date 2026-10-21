export class StaticClass {
    constructor() {
        let constructor = this.constructor;
        let className = constructor.name;
        throw new TypeError(`${className} is not a constructor`);
    }
}
//# sourceMappingURL=types.js.map