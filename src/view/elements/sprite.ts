import Engine from "../../engine.js";
import { MouseManager } from "../../mouse.js";
import { SpriteRenderer } from "../../sprites.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { ViewElement } from "../view-element.js";

export class ViewSprite extends ViewElement {

	protected _reference:string;

	public set reference(string:string) {
		this._reference = string;

		let sprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
			name: string,
			position: [ 0, 0 ],
			size: [ 0, 0 ]
		});

		this.size = [ sprite.width, sprite.height ];

	}

	public get reference() { return this._reference; }

	public override size:Position2D = [ 100, 100 ];

	private _origin:Position2D = [ 0, 0 ];

	public get origin() { return this._origin };
	public set origin(position:Position2D) {
		
		// Clamp the coordinates to be in the range (0-1)
		this._origin[0] = Math.max( Math.min(position[0], 1), 0 );
		this._origin[1] = Math.max( Math.min(position[1], 1), 0 );
	}

	constructor( reference:string ) {
		super();
		this.reference = reference;
	}

	public override setFill(fill: string | CanvasGradient | CanvasPattern): this {
		console.warn("ViewSprite does not have any fill.");
		return this;
	}

	/**
	 * Set the colour/size/line styles to use when outlining the element.
	 * 
	 * ***`ViewSprite` does not have any stroke.***
	 * 
	 * @param colour	The colour of the outline
	 * @param size		The width of the outline
	 * @param lineCap	The style for how lines terminate
	 * @param lineJoin	The style for joining lines
	 */
	public override setStroke(colour: string | CanvasGradient | CanvasPattern, size?: number, lineCap?: "square" | "butt" | "round", lineJoin?: "round" | "miter" | "bevel"): this {
		
		// Put a warning in the console
		console.warn("ViewSprite does not have any stroke.");

		return this;
	}

	/**
	 * 
	 * @param x 
	 * @param y 
	 * @returns 
	 */
	public setOrigin(x:number, y:number):this {

		// Update the origin
		this.origin = [ x, y ];

		return this;
	}

	/**
	 * Set the dimensions of the sprite
	 * 
	 * @param width		The width of the sprite
	 * @param height	The height of the sprite
	 */
	public setSize(width:number, height:number):this {
		this.size = [width, height];

		return this;
	}

	/**
	 * Apply a scale the instance
	 * 
	 * @param scale	The scaling factor to be applied
	 */
	public scale(scale:number):this {
		this.size[0] *= scale;
		this.size[1] *= scale;

		return this
	}

	/**
	 * Set the sprite's reference
	 * 
	 * See: [Tower Defense // Asset Previewer](http://localhost:5500/assets/preview.html))
	 * 
	 * @param reference	The sprite's reference
	 */
	public setReference(reference:string):this {

		// Update the reference
		this.reference = reference;

		return this;
	}

	/**
	 * Render the sprite onto a provided canvas and context
	 * 
	 * @param canvas	Specifies what canvas the sprite will be rendered onto
	 * @param context	Specify what `RenderingContext` to use to draw
	 */
	public override render(canvas: Canvas, context: RenderingContext): void {

		this.dispatchEvent("pre-render", canvas);

		// If the referenced sprite has not been loaded yet, stop
		if (SpriteRenderer.isRegistered(this.reference) == false) return;

		// Save the context's transformations
		context.save();

		// Set the general styles
		// Only uses the transformations, not the fill/stroke
		this.setGeneralStyles(context);

		context.translate(
			-this.size[0] * this._origin[0],
			-this.size[1] * this._origin[1]
		)

		// Check for and dispatch events
		this.checkForUpdates(canvas, context);

		// Render the sprite onto the context
		SpriteRenderer.drawSprite({
			name: this.reference,
			position: [ 0, 0 ],
			size: this.size
		}, context);

		// Restore the canvas's initial transformations
		context.restore();

		this.dispatchEvent("post-render", canvas);

	}

	protected override isMouseHovering(context: RenderingContext): boolean {

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

		// If the mouse is outside of the sprite's bounding rectangle, return false
		if (internalMouse[0] < 0) return false;
		if (internalMouse[1] < 0) return false;
		if (internalMouse[0] > this.size[0]) return false;
		if (internalMouse[1] > this.size[1]) return false;

		// The mouse is inside the bounding rectangle. Return true
		return true;
	}
}