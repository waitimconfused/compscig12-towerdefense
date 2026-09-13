import { StaticClass } from "./types.js";
import { ViewCollection } from "./view/view-collection.js";
import { ViewElementCollection } from "./view/view-element-collection.js";
import { ViewText } from "./view/elements/text.js";
export class EngineAnchor {
    resolver;
    constructor(resolver) {
        this.resolver = resolver;
    }
}
export default class Engine extends StaticClass {
    static canvas;
    static context;
    static haltOnError = true;
    static showDebugInfo = false;
    static debugInfo;
    static _stats = {
        delta: 0,
        fps: 0,
        lastRenderCall: 0
    };
    static get size() {
        return [
            this.canvas.width,
            this.canvas.height
        ];
    }
    static get stats() {
        return structuredClone(this._stats);
    }
    static _currentView;
    static _currentViewFullPath;
    static get currentViewFullPath() { return this._currentViewFullPath; }
    static get currentView() { return this._currentView; }
    static views = new Map();
    static Anchor = EngineAnchor;
    static anchorPresets = {
        topLeft: new EngineAnchor((w, h) => [0, 0]),
        topCenter: new EngineAnchor((w, h) => [w / 2, 0]),
        topRight: new EngineAnchor((w, h) => [w, 0]),
        centerLeft: new EngineAnchor((w, h) => [0, h / 2]),
        centerCenter: new EngineAnchor((w, h) => [w / 2, h / 2]),
        centerRight: new EngineAnchor((w, h) => [w, h / 2]),
        bottomLeft: new EngineAnchor((w, h) => [0, h]),
        bottomCenter: new EngineAnchor((w, h) => [w / 2, h]),
        bottomRight: new EngineAnchor((w, h) => [w, h]),
    };
    static cursor = "default";
    static timers = [];
    static initialize(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        let fpsList = [];
        let deltaList = [];
        let listLength = 100;
        this.debugInfo = new ViewElementCollection(new ViewText("VIEW: undefined")
            .setTranslation(16, 16)
            .setFont("monospace", 16)
            .setFill("black")
            .setStroke("none")
            .addEventListener("pre-render", (element) => {
            element.content = `VIEW: ${Engine.currentViewFullPath}`;
        }), new ViewText("FPS: undefined")
            .setAnchor(this.anchorPresets.bottomLeft)
            .setTranslation(16, -16)
            .setFont("monospace", 16)
            .setAlignment("left", "bottom")
            .setFill("black")
            .setStroke("none")
            .addEventListener("pre-render", (element) => {
            fpsList.push(Engine.stats.fps);
            while (fpsList.length > listLength)
                fpsList.shift();
            let averageFps = 0;
            for (let i = 0; i < fpsList.length; i++) {
                averageFps += fpsList[i];
            }
            averageFps /= fpsList.length;
            deltaList.push(Engine.stats.delta);
            while (deltaList.length > listLength)
                deltaList.shift();
            let averageDelta = 0;
            for (let i = 0; i < deltaList.length; i++) {
                averageDelta += deltaList[i];
            }
            averageDelta /= deltaList.length;
            element.content = `FPS: ${averageFps.toFixed(2)} (${averageDelta.toFixed(2)} ms/frame)`;
        }));
        this.render();
    }
    static createView(name, view) {
        if (this.views.has(name))
            throw new Error(`Cannot create duplicate view of "${name}".`);
        this.views.set(name, view);
        if (!this._currentView)
            this.showView(name);
    }
    static showView(name) {
        let viewNames = name.split("/");
        let viewName = viewNames.shift();
        let subViewNames = viewNames.join("/");
        if (this.views.has(viewName) == false) {
            if (subViewNames) {
                console.error(`Cannot show unset view of "${name}". Could not resolve "${viewName}".`);
            }
            else {
                console.error(`Cannot show unset view of "${name}".`);
            }
            return null;
        }
        let view = this.views.get(viewName);
        if (subViewNames && view instanceof ViewCollection) {
            view.showView(subViewNames);
        }
        let currentView = this.views.get(this._currentView);
        if (currentView)
            currentView.dispatchEvent("hide");
        view.dispatchEvent("show");
        this._currentView = viewName;
        this._currentViewFullPath = name;
        return view;
    }
    static render() {
        this.cursor = "default";
        let currentTime = performance.now();
        this._stats.delta = currentTime - this._stats.lastRenderCall;
        this._stats.fps = 1000 / this._stats.delta;
        this._stats.fps = Math.round(this._stats.fps * 100) / 100;
        for (let i = 0; i < Engine.timers.length; i++) {
            let timer = Engine.timers[i];
            if (currentTime < timer.trigger_time)
                continue;
            timer.complete();
            Engine.timers.splice(i, 1);
            i -= 1;
        }
        if (this.canvas.width != window.innerWidth ||
            this.canvas.height != window.innerHeight) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            if (this.views.has(this._currentView)) {
                let view = this.views.get(this._currentView);
                view.dispatchEvent("resize");
            }
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.views.has(this._currentView)) {
            let view = this.views.get(this._currentView);
            try {
                view.render(this.canvas, this.context);
            }
            catch (e) {
                if (e instanceof Error)
                    logFormattedError(e);
                if (Engine.haltOnError == true) {
                    console.warn("Halting engine. (Prevent halting by setting %cEngine.haltOnError=false%c)", "font-style: italic", "font-style: normal");
                    return;
                }
            }
        }
        if (this.showDebugInfo)
            this.debugInfo.render(this.canvas, this.context);
        this.canvas.style.cursor = this.cursor;
        this._stats.lastRenderCall = currentTime;
        window.requestAnimationFrame(() => this.render());
    }
    static fpsList = [];
    static fpsListLength = 200;
    static resolveAnchor(anchor) {
        return anchor.resolver(this.canvas.width, this.canvas.height);
    }
    static wait(time) {
        return new Promise((complete) => {
            Engine.timers.push({
                trigger_time: performance.now() + time,
                complete: complete
            });
        });
    }
}
function logFormattedError(error) {
    let name = error.name;
    let message = error.message;
    let stack = error.stack;
    stack = stack.replace(/\nFrameRequestCallback[\s\S]*$/, "");
    let lines = stack.split("\n");
    let maxPreLinkLength = 0;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineParts = line.split("@");
        let preLink = lineParts[0];
        preLink = preLink.replace("/<", "");
        maxPreLinkLength = Math.max(maxPreLinkLength, preLink.length);
    }
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineParts = line.split("@");
        let preLink = lineParts[0] ?? "";
        let link = lineParts[1] ?? "";
        preLink = preLink.replace("/<", "");
        link = link.replace(/:(\d+):(\d+)/gm, " (line $1, char $2)");
        let separator = " ".repeat(maxPreLinkLength + 3 - preLink.length);
        line = preLink + separator + link;
        lines[i] = line;
    }
    stack = lines.join("\n");
    console.error(`${name}: ${message}\n\n${stack}`);
}
//# sourceMappingURL=engine.js.map