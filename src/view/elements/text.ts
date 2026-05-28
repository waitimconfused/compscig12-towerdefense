import { ViewElement } from "../view.js";
import Engine from "../../engine.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { MouseManager } from "../../mouse.js";

type ViewTextAlignment = {
	y: CanvasTextBaseline;
	x: CanvasTextAlign;
};

type ViewTextFont = {
	
	/**
	 * CSS `font-family` property value
	 * 
	 * To inject custom fonts, see `ViewText.addFont()`.
	 */
	family: string;

	/**
	 * CSS `font-size` property value
	 */
	size: number | string;

	/**
	 * CSS `font-style` property value
	 */
	style: "normal" | "italic" | "oblique";

	/**
	 * Amount of spacing between each line of text
	 */
	lineSpacing: number;
}

export class ViewText extends ViewElement {

	private _lines:string[] = [];

	public get content() {
		return this._lines.join("\n");
	}
	public set content(string:string) {
		this._lines = string.split("\n");
	}

	public font:ViewTextFont = {
		family: "serif",
		size: 100,
		style: "normal",
		lineSpacing: 10
	};

	public alignment:ViewTextAlignment = {
		x: "left",
		y: "top"
	};

	protected static injectedStylesheetLoaded:boolean = false;
	protected static injectedStylesheet:CSSStyleSheet = new CSSStyleSheet;

	constructor(content:string) {
		super();
		this.content = content;

		if (!ViewText.injectedStylesheetLoaded) {

			document.adoptedStyleSheets.push(ViewText.injectedStylesheet);

			ViewText.injectedStylesheetLoaded = true;
		}
	}

	/**
	 *
	 * @param name			CSS `font-family` property value
	 * @param absolutePath	Path (relative to `/index.html`) to font file.
	 * 						EG: `"/fonts/example.ttf"`
	 */
	public static addFont(name:string, absolutePath:string) {

		// Add a CSS @font-face rule to the injected style sheet
		this.injectedStylesheet.insertRule(`@font-face { font-family: "${name}"; src: url("${absolutePath}"); }`); 

	}

	public setFont(family:string, size?:number|string, style?:"normal" | "italic" | "oblique"):this {
		this.font.family = family;
		if (size) this.font.size = size;
		if (style) this.font.size = style;
		return this;
	}

	public setAlignment(horizontal:CanvasTextAlign, vertical:CanvasTextBaseline):this {
		this.alignment.x = horizontal;
		this.alignment.y = vertical;
		return this;
	}

	protected override isMouseHovering(context:RenderingContext):boolean {

		let inverseTransform = context.getTransform().inverse();

		let mouseAsPoint:DOMPointInit = new DOMPoint(MouseManager.x, MouseManager.y);

		let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);

		let internalMouse:Position2D = [ internalMousePoint.x, internalMousePoint.y ];
		
		context.font = `bold ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;
		
		let rawSize = context.measureText(this.content);
		let size:Position2D = [rawSize.width, rawSize.fontBoundingBoxDescent + rawSize.fontBoundingBoxAscent];
		this.size = size;
		
		
		let offset:Position2D = [ 0, 0 ];
		
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
				// Do nothing
				break;
			case "right":
				offset[0] -= size[0];
				break;
			case "start":
				// Do nothing
				break;
		}
			
		if (internalMouse[0] < offset[0]) return false;
		if (internalMouse[1] < offset[1]) return false;
		if (internalMouse[0] > offset[0] + size[0]) return false;
		if (internalMouse[1] > offset[1] + size[1]) return false;

		return true;

	}

	public override render(canvas:Canvas, context:RenderingContext) {

		context.save();
		this.setGeneralStyles(context);

		
		let hasClickEvent = this.eventListeners.find(e=>e.type=="click") != undefined;
		let isHovering = this.isMouseHovering(context);

		if (hasClickEvent && isHovering) {

			Engine.cursor = "pointer";

			if (MouseManager.buttons.left) {
				this.dispatchEvent("click");
				MouseManager.buttons.left = false;
			}
		}



		context.font = `bold ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;

		let verticalOffset = 0;

		for (let i = 0; i < this._lines.length; i ++) {

			let text:string = this._lines[i] as string;

			let textMetrics = context.measureText(text);
			let textHeight = textMetrics.fontBoundingBoxDescent + textMetrics.fontBoundingBoxAscent;

			context.strokeText( text, 0, verticalOffset );
			context.fillText( text, 0, verticalOffset );

			verticalOffset += textHeight + this.font.lineSpacing;
		}


		context.restore();
	}

}