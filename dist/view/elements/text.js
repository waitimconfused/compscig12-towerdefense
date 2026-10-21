import { ViewElement } from "../view-element.js";
import { MouseManager } from "../../mouse.js";
export class ViewText extends ViewElement {
    _lines = [];
    get content() {
        return this._lines.join("\n");
    }
    set content(string) {
        string = string.replaceAll("\t", "    ");
        this._lines = string.split("\n");
    }
    font = {
        family: "serif",
        size: 100,
        style: "normal",
        lineSpacing: 10
    };
    alignment = {
        x: "left",
        y: "top"
    };
    static injectedStylesheetLoaded = false;
    static injectedStylesheet = new CSSStyleSheet;
    constructor(content) {
        super();
        this.content = content;
        if (!ViewText.injectedStylesheetLoaded) {
            document.adoptedStyleSheets.push(ViewText.injectedStylesheet);
            ViewText.injectedStylesheetLoaded = true;
        }
    }
    static addFont(name, absolutePath) {
        let string = "";
        string += "@font-face {";
        string += `    font-family: "${name}";`;
        string += `    src: url("${absolutePath}");`;
        string += "}";
        this.injectedStylesheet.insertRule(string);
    }
    setFont(family, size, style, lineSpacing) {
        this.font.family = family;
        if (size != undefined)
            this.font.size = size;
        if (style != undefined)
            this.font.style = style;
        if (lineSpacing != undefined)
            this.font.lineSpacing = lineSpacing;
        return this;
    }
    setAlignment(horizontal, vertical) {
        this.alignment.x = horizontal;
        this.alignment.y = vertical;
        return this;
    }
    isMouseHovering(context) {
        let inverseTransform = context.getTransform().inverse();
        let mouseAsPoint = new DOMPoint(MouseManager.x, MouseManager.y);
        let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);
        let internalMouse = [internalMousePoint.x, internalMousePoint.y];
        let textMeasurements = context.measureText(this._lines[0]);
        let singleLine = [
            textMeasurements.width,
            textMeasurements.fontBoundingBoxDescent + textMeasurements.fontBoundingBoxAscent
        ];
        let size = [0, 0];
        for (let i = 0; i < this._lines.length; i++) {
            let line = this._lines[i];
            let textMeasurements = context.measureText(line);
            size[0] = Math.max(size[0], textMeasurements.width);
            size[1] += textMeasurements.fontBoundingBoxDescent + textMeasurements.fontBoundingBoxAscent;
            if (i != this._lines.length - 1)
                size[1] += this.font.lineSpacing;
        }
        this.size = size;
        let offset = [0, 0];
        switch (this.alignment.y) {
            case "alphabetic":
                offset[1] -= singleLine[1] * 0.75;
                break;
            case "bottom":
                offset[1] -= singleLine[1];
                break;
            case "hanging":
                offset[1] -= singleLine[1] * 0.25;
                break;
            case "ideographic":
                offset[1] -= singleLine[1];
                break;
            case "middle":
                offset[1] -= singleLine[1] * 0.5;
                break;
            case "top":
                offset[1] -= singleLine[1] * 0.125;
                break;
        }
        switch (this.alignment.x) {
            case "center":
                offset[0] -= size[0] * 0.5;
                break;
            case "end":
                offset[0] -= size[0];
                break;
            case "right":
                offset[0] -= size[0];
                break;
            default:
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
        this.dispatchEvent("pre-render", canvas);
        context.save();
        this.setGeneralStyles(context);
        context.font = `${this.font.style} ${this.font.size}px ${this.font.family}`;
        context.textAlign = this.alignment.x;
        context.textBaseline = this.alignment.y;
        this.checkForUpdates(canvas, context);
        let verticalOffset = 0;
        for (let i = 0; i < this._lines.length; i++) {
            let line = this._lines[i];
            let textMetrics = context.measureText(line);
            let textHeight = textMetrics.fontBoundingBoxDescent + textMetrics.fontBoundingBoxAscent;
            context.strokeText(line, 0, verticalOffset);
            context.fillText(line, 0, verticalOffset);
            verticalOffset += textHeight + this.font.lineSpacing;
        }
        context.restore();
        this.dispatchEvent("post-render", canvas);
    }
}
//# sourceMappingURL=text.js.map