import { MouseManager } from "../../mouse.js";
import { SpriteRenderer } from "../../sprites.js";
import { ViewElement } from "../view-element.js";
export class ViewSprite extends ViewElement {
    _reference;
    set reference(string) {
        this._reference = string;
        let sprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
            name: string,
            position: [0, 0],
            size: [0, 0]
        });
        this.size = [sprite.width, sprite.height];
    }
    get reference() { return this._reference; }
    size = [100, 100];
    _origin = [0, 0];
    get origin() { return this._origin; }
    ;
    set origin(position) {
        this._origin[0] = Math.max(Math.min(position[0], 1), 0);
        this._origin[1] = Math.max(Math.min(position[1], 1), 0);
    }
    constructor(reference) {
        super();
        this.reference = reference;
    }
    setFill(fill) {
        console.warn("ViewSprite does not have any fill.");
        return this;
    }
    setStroke(colour, size, lineCap, lineJoin) {
        console.warn("ViewSprite does not have any stroke.");
        return this;
    }
    setOrigin(x, y) {
        this.origin = [x, y];
        return this;
    }
    setSize(width, height) {
        this.size = [width, height];
        return this;
    }
    scale(x, y) {
        if (y == undefined)
            y = x;
        this.size[0] *= x;
        this.size[1] *= y;
        return this;
    }
    setReference(reference) {
        this.reference = reference;
        return this;
    }
    render(canvas, context) {
        this.dispatchEvent("pre-render", canvas);
        if (SpriteRenderer.isRegistered(this.reference) == false)
            return;
        context.save();
        this.setGeneralStyles(context);
        context.translate(-this.size[0] * this._origin[0], -this.size[1] * this._origin[1]);
        this.checkForUpdates(canvas, context);
        SpriteRenderer.drawSprite({
            name: this.reference,
            position: [0, 0],
            size: this.size
        }, context);
        context.restore();
        this.dispatchEvent("post-render", canvas);
    }
    isMouseHovering(context) {
        let inverseTransform = context.getTransform().inverse();
        let mouseAsPoint = new DOMPoint(MouseManager.x, MouseManager.y);
        let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);
        let internalMouse = [internalMousePoint.x, internalMousePoint.y];
        if (internalMouse[0] < 0)
            return false;
        if (internalMouse[1] < 0)
            return false;
        if (internalMouse[0] > this.size[0])
            return false;
        if (internalMouse[1] > this.size[1])
            return false;
        return true;
    }
}
//# sourceMappingURL=sprite.js.map