import Engine from "./engine.js";
import { MouseManager } from "./mouse.js";
import { SpriteRenderer } from "./sprites.js";
export class View {
    elements = [];
    listeners = {
        show: [],
        hide: []
    };
    addElement(...elements) {
        this.elements.push(...elements);
        return this;
    }
    addEventListener(type, callback) {
        this.listeners[type].push(callback);
        return this;
    }
    dispatchEvent(type) {
        for (let i = 0; i < this.listeners[type].length; i++) {
            let callback = this.listeners[type][i];
            callback();
        }
    }
    render(canvas, context) {
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];
            element.render(canvas, context);
        }
    }
}
export class ViewCollection extends View {
    _currentView;
    get currentView() { return this._currentView; }
    views = {};
    addElement(...element) {
        console.error(`"ViewElement" instances cannot be added to "ViewCollection".`);
        return this;
    }
    createView(name, view) {
        if (name in this.views)
            throw new Error(`Cannot create duplicate view of "${name}".`);
        this.views[name] = view;
        if (!this._currentView)
            this.showView(name);
        return this;
    }
    showView(name) {
        if (name in this.views == false) {
            console.error(`Cannot show unset view of "${name}".`);
            return null;
        }
        this.views[this._currentView]?.dispatchEvent("hide");
        this._currentView = name;
        this.views[name]?.dispatchEvent("show");
        return this.views[name] ?? null;
    }
    render(canvas, context) {
        if (this._currentView in this.views) {
            let view = this.views[this._currentView];
            view.render(canvas, context);
        }
    }
}
class ViewElement {
    _position = [0, 0];
    get position() {
        if (typeof this._position == "symbol") {
            return Engine.resolveAnchor(this._position) ?? [0, 0];
        }
        else {
            return this._position;
        }
    }
    click = null;
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
        if (Object.values(Engine.anchor).includes(anchor) == false) {
            console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.description}".`);
            return this;
        }
        this._position = anchor;
        return this;
    }
    moveTo(x, y) {
        this._position = [x, y];
        return this;
    }
    setClickEvent(callback) {
        this.click = callback;
        return this;
    }
    dispatchEvent(type) {
        if (this.click)
            this.click();
    }
    setRotation(degrees) {
        this.rotation = degrees * Math.PI / 180;
        return this;
    }
}
export class ViewText extends ViewElement {
    content = "";
    font = {
        family: "serif",
        size: 100,
        style: "regular"
    };
    alignment = {
        x: "left",
        y: "top"
    };
    constructor(content) {
        super();
        this.content = content;
    }
    isMouseHovering(context) {
        let inverseTransform = context.getTransform().inverse();
        let mouseAsPoint = new DOMPoint(MouseManager.x, MouseManager.y);
        let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);
        let internalMouse = [internalMousePoint.x, internalMousePoint.y];
        context.font = `bold ${this.font.size}px ${this.font.family}`;
        context.textAlign = this.alignment.x;
        context.textBaseline = this.alignment.y;
        let rawSize = context.measureText(this.content);
        let size = [rawSize.width, rawSize.fontBoundingBoxDescent + rawSize.fontBoundingBoxAscent];
        this.size = size;
        let offset = [0, 0];
        switch (this.alignment.y) {
            case "alphabetic":
                offset[1] -= size[1] * 0.75;
                break;
            case "bottom":
                offset[1] -= size[1];
                break;
            case "hanging":
                offset[1] -= size[1] * 0.25;
                break;
            case "ideographic":
                offset[1] -= size[1];
                break;
            case "middle":
                offset[1] -= size[1] * 0.5;
                break;
            case "top":
                offset[1] -= size[1] * 0.125;
                break;
        }
        switch (this.alignment.x) {
            case "center":
                offset[0] -= size[0] * 0.5;
                break;
            case "end":
                offset[0] -= size[0];
                break;
            case "left":
                break;
            case "right":
                offset[0] -= size[0];
                break;
            case "start":
                break;
        }
        if (internalMouse[0] < offset[0])
            return false;
        if (internalMouse[1] < offset[1])
            return false;
        if (internalMouse[0] > offset[0] + size[0])
            return false;
        if (internalMouse[1] > offset[1] + size[1])
            return false;
        return true;
    }
    render(canvas, context) {
        context.save();
        setGeneralStyles(context, this);
        let isHovering = this.isMouseHovering(context);
        if (isHovering)
            Engine.cursor = "pointer";
        if (isHovering && MouseManager.buttons.left) {
            this.dispatchEvent("click");
        }
        context.font = `bold ${this.font.size}px ${this.font.family}`;
        context.textAlign = this.alignment.x;
        context.textBaseline = this.alignment.y;
        context.fillText(this.content, 0, 0);
        context.strokeText(this.content, 0, 0);
        context.restore();
    }
}
export class ViewRect extends ViewElement {
    size = [0, 0];
    render(canvas, context) {
        context.save();
        setGeneralStyles(context, this);
        context.beginPath();
        context.fillRect(0, 0, this.size[0], this.size[1]);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
    setSize(width, height) {
        this.size[0] = width;
        this.size[1] = height;
        return this;
    }
}
export class ViewSprite extends ViewElement {
    reference;
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
    setOrigin(x, y) {
        this.origin = [x, y];
        return this;
    }
    setSize(width, height) {
        this.size[0] = width;
        this.size[1] = height;
        return this;
    }
    setReference(reference) {
        this.reference = reference;
        return this;
    }
    render(canvas, context) {
        if (SpriteRenderer.isRegistered(this.reference) == false)
            return;
        context.save();
        setGeneralStyles(context, this);
        context.translate(-this.origin[0] * this.size[0], -this.origin[1] * this.size[1]);
        SpriteRenderer.drawSprite({
            name: this.reference,
            position: [0, 0],
            size: this.size
        }, context);
        context.restore();
    }
}
function setGeneralStyles(context, viewElement) {
    context.translate(viewElement.position[0], viewElement.position[1]);
    context.rotate(viewElement.rotation);
    if (viewElement.stroke.colour != "none" &&
        viewElement.stroke.colour != "transparent" &&
        viewElement.stroke.size > 0) {
        context.strokeStyle = viewElement.stroke.colour;
        context.setLineDash(viewElement.stroke.dash ?? [0]);
        context.lineDashOffset = viewElement.stroke.dashOffset;
        context.lineCap = viewElement.stroke.lineCap;
        context.lineJoin = viewElement.stroke.lineJoin;
        context.lineWidth = viewElement.stroke.size;
    }
    else {
        context.strokeStyle = "transparent";
    }
    context.fillStyle = viewElement.fill;
}
//# sourceMappingURL=view.js.map