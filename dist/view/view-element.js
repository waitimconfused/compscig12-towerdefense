import Engine from "../engine.js";
import { MouseManager } from "../mouse.js";
export class ViewElement {
    _anchor = Engine.anchorPresets.topLeft;
    _position = [0, 0];
    eventListeners = {
        "click": [],
        "pre-render": [],
        "post-render": []
    };
    get position() {
        let anchorPosition = Engine.resolveAnchor(this._anchor);
        return {
            raw: [this._position[0], this._position[1]],
            anchor: [this._position[0], this._position[1]],
            final: [anchorPosition[0] + this._position[0], anchorPosition[1] + this._position[1]]
        };
    }
    stroke = {
        colour: "black",
        size: 5,
        lineCap: "square",
        lineJoin: "miter",
        dash: null,
        dashOffset: 0
    };
    fill = "purple";
    rotation = 0;
    size = [0, 0];
    setAnchor(anchor) {
        if (!anchor)
            anchor = Engine.anchorPresets.topLeft;
        if (Object.values(Engine.anchorPresets).includes(anchor) == false) {
            console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.resolver.toString()}".`);
            return this;
        }
        this._anchor = anchor;
        return this;
    }
    setTranslation(x, y) {
        this._position = [x, y];
        return this;
    }
    setFill(fill) {
        this.fill = fill;
        return this;
    }
    setStroke(colour, size, lineCap, lineJoin) {
        this.stroke.colour = colour;
        if (size != undefined)
            this.stroke.size = size;
        if (lineCap != undefined)
            this.stroke.lineCap = lineCap;
        if (lineJoin != undefined)
            this.stroke.lineJoin = lineJoin;
        return this;
    }
    addEventListener(type, callback) {
        this.eventListeners[type].push(callback);
        return this;
    }
    dispatchEvent(type, canvas) {
        for (let i = 0; i < this.eventListeners[type].length; i++) {
            let callback = this.eventListeners[type][i];
            callback(this, canvas);
        }
    }
    setRotation(angle, mode = "deg") {
        if (mode == "deg")
            angle *= Math.PI / 180;
        this.rotation = angle;
        return this;
    }
    setGeneralStyles(context) {
        context.translate(this.position.final[0], this.position.final[1]);
        context.rotate(this.rotation);
        if (this.stroke.colour != "none" &&
            this.stroke.colour != "transparent" &&
            this.stroke.size > 0) {
            context.strokeStyle = this.stroke.colour;
            context.setLineDash(this.stroke.dash ?? [0]);
            context.lineDashOffset = this.stroke.dashOffset;
            context.lineCap = this.stroke.lineCap;
            context.lineJoin = this.stroke.lineJoin;
            context.lineWidth = this.stroke.size;
        }
        else {
            context.strokeStyle = "transparent";
            context.lineWidth = 0;
        }
        let fill = this.fill;
        if (fill instanceof HTMLImageElement) {
            if (fill.complete == false)
                return;
            let pattern = context.createPattern(fill, "repeat");
            this.fill = pattern;
        }
        context.fillStyle = fill;
    }
    checkForUpdates(canvas, context) {
        let hasClickEvent = (this.eventListeners.click.length > 0);
        let isHovering = false;
        if (hasClickEvent)
            isHovering = this.isMouseHovering(context);
        if (isHovering) {
            Engine.cursor = "pointer";
            if (MouseManager.buttons.left) {
                this.dispatchEvent("click", canvas);
                MouseManager.buttons.left = false;
            }
        }
    }
}
//# sourceMappingURL=view-element.js.map