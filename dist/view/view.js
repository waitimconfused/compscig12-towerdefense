import { ViewElementCollection } from "./view-element-collection.js";
export class View extends ViewElementCollection {
    background = {
        source: null,
        repetition: "repeat",
        scale: [1, 1]
    };
    _canvasPattern = null;
    listeners = {
        show: [],
        hide: [],
        resize: []
    };
    addEventListener(type, callback) {
        this.listeners[type].push(callback);
        return this;
    }
    dispatchEvent(type) {
        let listeners = this.listeners[type];
        for (let i = 0; i < listeners.length; i++) {
            let callback = listeners[i];
            callback();
        }
    }
    renderBackground(canvas, context) {
        if (!this.background.source)
            return;
        let source = this.background.source;
        if (typeof source == "string") {
            this._canvasPattern = null;
        }
        if (source instanceof HTMLImageElement && !this._canvasPattern) {
            this._canvasPattern = context.createPattern(this.background.source, this.background.repetition);
            let transform = new DOMMatrix;
            transform = transform.scale(this.background.scale[0], this.background.scale[1]);
            this._canvasPattern.setTransform(transform);
        }
        context.fillStyle = this._canvasPattern ?? source;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    render(canvas, context, showBackground = true, showElements = true) {
        if (showBackground)
            this.renderBackground(canvas, context);
        if (showElements)
            super.render(canvas, context);
    }
}
//# sourceMappingURL=view.js.map