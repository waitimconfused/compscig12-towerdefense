import { MouseManager } from "../../mouse.js";
import { ViewElement } from "../view-element.js";
export class ViewRect extends ViewElement {
    origin = [0.5, 0.5];
    setSize(width, height) {
        this.size = [width, height];
        return this;
    }
    setOrigin(x, y) {
        this.origin = [x, y];
        return this;
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
    render(canvas, context) {
        this.dispatchEvent("pre-render", canvas);
        context.save();
        this.setGeneralStyles(context);
        context.translate(-this.size[0] * this.origin[0], -this.size[1] * this.origin[1]);
        this.checkForUpdates(canvas, context);
        context.beginPath();
        context.rect(0, 0, this.size[0], this.size[1]);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
        this.dispatchEvent("post-render", canvas);
    }
}
//# sourceMappingURL=rect.js.map