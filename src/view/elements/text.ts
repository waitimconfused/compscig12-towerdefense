import { ViewElement } from "../view-element.js";
import Engine from "../../engine.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { MouseManager } from "../../mouse.js";

type ViewTextAlignment = {
	/**
	 * Vertical alignment of some text
	 */
	y: CanvasTextBaseline;
	/**
	 * Horizontal alignment of some text
	 */
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
	 * CSS `font-style` property value.
	 * 
	 * See [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font)
	 * 
	 * Can be any combination of:
	 * - `"normal"`
	 * - `"italic"`
	 * - `"bold"`
	 * - `"oblique <angle>"`; Example: `"oblique 10deg"`, or `"oblique 3rad"`
	 */
	style: string;

	/**
	 * Amount of spacing between each line of text
	 */
	lineSpacing: number;
}

export class ViewText extends ViewElement {

	/**
	 * Each line of content
	 */
	private _lines:string[] = [];

	/**
	 * The `ViewText`'s text content
	 */
	public get content() {
		// Join each line with line-breaks/newlines
		return this._lines.join("\n");
	}
	/**
	 * The `ViewText`'s text content
	 */
	public set content(string:string) {
		
		// Replace all tabs/indents with 4 spaces
		string = string.replaceAll("\t", "    ");

		// Store each line of the content
		this._lines = string.split("\n");
	}

	/**
	 * The visual style of the text
	 */
	public font:ViewTextFont = {
		family: "serif",
		size: 100,
		style: "normal",
		lineSpacing: 10
	};

	/**
	 * The horizontal and vertical alignment of the text.
	 */
	public alignment:ViewTextAlignment = {
		x: "left",
		y: "top"
	};

	/**
	 * Indicates wether or not the injected CSS stylesheet has been attached
	 * 
	 * The stylesheet is where `ViewText.addFont()` puts the fonts
	 */
	protected static injectedStylesheetLoaded:boolean = false;

	/**
	 * The actual CSS stylesheet that will be injected into the HTML document
	 * 
	 * This is where `ViewText.addFont()` puts the generated CSS `@font-face` rules
	 */
	protected static injectedStylesheet:CSSStyleSheet = new CSSStyleSheet;

	constructor(content:string) {
		super();

		// Set the text content
		this.content = content;

		// If the injected CSS has not been loaded, add it
		if (!ViewText.injectedStylesheetLoaded) {

			// Add the injected CSS into the DOM
			document.adoptedStyleSheets.push(ViewText.injectedStylesheet);

			// Set that the CSS stylesheet has been attached
			ViewText.injectedStylesheetLoaded = true;
		}
	}

	/**
	 * Load a font to use in `instance.font.family`
	 * 
	 * Injects a CSS `@font-face` rule that creates the font-family.
	 * See [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face) for more information
	 * 
	 * @param name			CSS `font-family` property value
	 * 
	 * @param absolutePath	Path (relative to `/index.html`) to font file.
	 * 						EG: `"/fonts/example.ttf"`
	 */
	public static addFont(name:string, absolutePath:string) {

		// Create a string to store the generated CSS rule
		let string:string = "";

		// Create a CSS font-face rule
		string += "@font-face {";
		string += `    font-family: "${name}";`;
		string += `    src: url("${absolutePath}");`;
		string += "}";

		// Add a CSS @font-face rule to the injected style sheet
		this.injectedStylesheet.insertRule(string); 

	}

	/**
	 * 
	 * @param family		
	 * @param size			The size of the font
	 * @param style			The variant of the font
	 * @param lineSpacing	The spacing between each line of text. This is unaffected by the font size
	 * @returns 
	 */
	public setFont(family:string, size?:number|string, style?:"normal" | "italic" | "oblique", lineSpacing?:number):this {
		this.font.family = family;
		if (size != undefined) this.font.size = size;
		if (style != undefined) this.font.style = style;
		if (lineSpacing != undefined) this.font.lineSpacing = lineSpacing;
		return this;
	}

	public setAlignment(horizontal:CanvasTextAlign, vertical:CanvasTextBaseline):this {
		this.alignment.x = horizontal;
		this.alignment.y = vertical;
		return this;
	}

	protected override isMouseHovering(context:RenderingContext):boolean {

		// Get the inverse-transform of the context
		// Used to turn the mouse position from screen-space to "rectangle-space"
		let inverseTransform = context.getTransform().inverse();

		// Get the mouse position as a DOMPoint (screen-space)
		let mouseAsPoint:DOMPointInit = new DOMPoint(MouseManager.x, MouseManager.y);

		// Get the mouse in "rectangle-space"
		// Meaning that the mouse position is [0,0] when hovering
		// over the top-left corner
		let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);

		// Turn the mouse point into a Position2D array
		let internalMouse:Position2D = [ internalMousePoint.x, internalMousePoint.y ];
		
		// Get the measurements of the first text
		let textMeasurements = context.measureText(this._lines[0] as string);

		// Get the size of the bounding box of the first line
		let singleLine:Position2D = [
			textMeasurements.width,
			textMeasurements.fontBoundingBoxDescent + textMeasurements.fontBoundingBoxAscent
		];

		// Create a variable to track the total bounding box of the content
		let size:Position2D = [ 0, 0 ];

		// Loop through each line and update the bounding box
		for (let i = 0; i < this._lines.length; i ++) {

			// Get the line
			let line = this._lines[i] as string;

			// Get the measurements of the line
			let textMeasurements = context.measureText(line);

			// Turn the measurements into a vertical and horizontal size
			// The width is just the largest width of each line
			// The height is the sum of each line's height, and the spacing between them
			size[0] = Math.max( size[0], textMeasurements.width );
			size[1] += textMeasurements.fontBoundingBoxDescent + textMeasurements.fontBoundingBoxAscent;
			if (i != this._lines.length-1) size[1] += this.font.lineSpacing;
		}

		// Set the size to be that of the measured width and height
		this.size = size;
		
		// Store the horizontal+vertical offsets of the bounding-rectangle
		let offset:Position2D = [ 0, 0 ];
		
		// Based on the vertical alignment, shift the bounding box up/down
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

		// Based on the horizontal alignment, shift the bounding box left/right
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
				// Either "left" or "start"
				// Do nothing
				break;
		}

		// If the mouse is outside of the text's bounding rectangle, return false
		if (internalMouse[0] < offset[0]) return false;
		if (internalMouse[1] < offset[1]) return false;
		if (internalMouse[0] > offset[0] + size[0]) return false;
		if (internalMouse[1] > offset[1] + size[1]) return false;

		// The mouse is inside the bounding rectangle. Return true
		return true;

	}

	public override render(canvas:Canvas, context:RenderingContext) {

		this.dispatchEvent("pre-render", canvas);

		// Save the context's transform
		context.save();

		// Apply the transformations and fill/stroke styles
		this.setGeneralStyles(context);

		// Set the font styles
		context.font = `${this.font.style} ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;
		
		// Check for and dispatch events
		this.checkForUpdates(canvas, context);

		// Keep track of the vertical offset
		let verticalOffset = 0;

		// Loop through each line, and render it
		for (let i = 0; i < this._lines.length; i ++) {

			// Get the line of text
			let line:string = this._lines[i] as string;

			// Measure the line
			let textMetrics = context.measureText(line);

			// Calculate the height of the line
			let textHeight = textMetrics.fontBoundingBoxDescent + textMetrics.fontBoundingBoxAscent;

			// Draw the text (outline behind the text)
			context.strokeText( line, 0, verticalOffset );
			context.fillText( line, 0, verticalOffset );

			// Increase the vertical offset
			verticalOffset += textHeight + this.font.lineSpacing;
		}

		// Restore the context's transform
		context.restore();

		this.dispatchEvent("post-render", canvas);
	}

}