import Engine, { EngineAnchor } from "../engine.js";
import { MouseManager } from "../mouse.js";
import { Canvas, Position2D, RenderingContext } from "../types.js";

type ViewElementEventType = "click";
type ViewElementEventListener = { type: ViewElementEventType, callback: ()=> void };

export type ViewCallbackFunction = ( ()=>void );
export type ViewElementStroke = {
	colour: string | CanvasGradient | CanvasPattern,
	size: number,
	lineCap: "butt" | "round" | "square",
	lineJoin: "round" | "bevel" | "miter",
	dash: number[] | null,
	dashOffset:number
};

export abstract class ViewElement {

	protected _anchor:EngineAnchor = Engine.anchorPresets.topLeft;
	protected _position:Position2D = [ 0, 0 ];

	protected eventListeners:ViewElementEventListener[] = [];

	/**
	 * The real position of the `ViewElement`.
	 * 
	 * Uses the set anchor to calculate
	 */
	public get position():Position2D&{ raw:Position2D, anchor:Position2D } {

		type PositionBundle = Position2D & { raw:Position2D, anchor:Position2D };

		// Get the real position of the anchor
		let anchorPosition:Position2D = Engine.resolveAnchor(this._anchor);

		// Calculate the real position of self (anchor + position)
		let totalPosition:PositionBundle = [
			anchorPosition[0] + this._position[0],
			anchorPosition[1] + this._position[1]
		] as PositionBundle;

		totalPosition.raw = [ this._position[0], this._position[1] ];
		totalPosition.anchor = [ anchorPosition[0], anchorPosition[1] ];

		return totalPosition;

	}

	public stroke: ViewElementStroke = {
		colour: "black",
		size: 5,
		lineCap: "square",
		lineJoin: "miter",
		dash: null,
		dashOffset: 0
	}

	public fill:string | CanvasGradient | CanvasPattern = "purple";

	/**
	 * Rotation of `ViewElement`, in radians
	 */
	public rotation:number = 0;

	public size:Position2D = [ 0, 0 ];

	/**
	 * @param anchor	See `Engine.anchor`
	 * 					Defaults to `Engine.anchor.topLeft`
	 */
	public setAnchor(anchor?: EngineAnchor):this {

		// If there wasn't an anchor passed, set it to be the top-left of the screen
		if (!anchor) anchor = Engine.anchorPresets.topLeft;

		// If the anchor is not one of the Engine's anchors,
		// log an error and do not update the anchor
		if ( Object.values(Engine.anchorPresets).includes(anchor) == false ) {
			console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.resolver.toString()}".`);
			return this;
		}

		// Update the anchor
		this._anchor = anchor;

		return this;
	}

	/**
	 * Set the position of the `ViewElement`, relative to the set anchor
	 * 
	 * @param x	`X`-coordinate of offset to anchor
	 * @param y	`Y`-coordinate of offset to anchor
	 */
	public setTranslation(x:number, y:number):this {

		// Update the internal position
		this._position = [ x, y ];

		return this;
	}

	/**
	 * Set the colour/pattern/gradient to use when filling the element
	 * 
	 * @param fill
	 */
	public setFill(fill:string | CanvasGradient | CanvasPattern):this {

		// Update the fill
		this.fill = fill;

		return this;
	}

	/**
	 * Set the colour/size/line styles to use when outlining the element
	 * 
	 * @param colour	The colour of the outline
	 * @param size		The width of the outline
	 * @param lineCap	The style for how lines terminate
	 * @param lineJoin	The style for joining lines
	 */
	public setStroke(
		colour: string | CanvasGradient | CanvasPattern,
		size?: number,
		lineCap?: "square" | "butt" | "round",
		lineJoin?: "round" | "miter" | "bevel"
	): this {

		// Update the colour
		this.stroke.colour = colour;

		// Optionally update the width of the line
		if (size != undefined) this.stroke.size = size;

		// Optionally update the line-ending
		if (lineCap != undefined) this.stroke.lineCap = lineCap;

		// Optionally update the join-style
		if (lineJoin != undefined) this.stroke.lineJoin = lineJoin;

		return this;
	}

	/**
	 * Add an event listener to the `ViewElement` instance
	 * 
	 * @param type		What kind of event should trigger the `callback` function
	 * @param callback	The callback function that gets triggered when the appropriate event is dispatched
	 */
	public addEventListener(type:ViewElementEventType, callback: ViewCallbackFunction ): this {

		// Add the event listener to the stack
		this.eventListeners.push({ type, callback });

		return this;
	}

	public dispatchEvent(type:ViewElementEventType) {

		// Loop through each event listener, calling their callbacks
		// if they are the correct event listener
		for (let i = 0; i < this.eventListeners.length; i ++) {

			// Get the listener
			let listener = this.eventListeners[i] as ViewElementEventListener;

			// If the listener's type is not the event being dispatched
			// don't do anything, just continue to the next listener
			if (listener.type != type) continue;

			// Call the listener's callback function
			listener.callback();
		}

	}

	/**
	 * Set the rotation angle of the element.
	 * 
	 * @param angle	Angle (default unit: *degrees*)
	 * 
	 * @param mode	Specifies wether to interpret the
	 * 				angle as in degrees or radians
	 */
	public setRotation(angle:number, mode:"deg"|"rad"="deg"):this {

		// If the mode is in degrees, turn it into radians
		if (mode == "deg") angle *= Math.PI / 180;

		// Save the angle (radians)
		this.rotation = angle;

		return this;
	}

	protected setGeneralStyles( context:RenderingContext ): void {

		// Move to the entities position
		context.translate( this.position[0], this.position[1] );

		// Rotate by the angle (radians)
		context.rotate(this.rotation);

		// If there is a stroke being applied, set the stroke
		if (
			this.stroke.colour != "none" &&
			this.stroke.colour != "transparent" &&
			this.stroke.size > 0
		) {
			// Set the strokeStyle
			context.strokeStyle = this.stroke.colour;

			// Set the dash sizes and offsets
			context.setLineDash( this.stroke.dash ?? [0] );
			context.lineDashOffset = this.stroke.dashOffset;

			// Set the line join/cap styles
			context.lineCap = this.stroke.lineCap;
			context.lineJoin = this.stroke.lineJoin;

			// Set the like width
			context.lineWidth = this.stroke.size;

		// If there is no stroke being applied, make sure that
		// the outline is invisible (if it was to be accidentally drawn)
		} else {
			context.strokeStyle = "transparent";
			context.lineWidth = 0;
		}

		// Set the fillStyle
		context.fillStyle = this.fill;
	}

	/**
	 * Check if events need to be triggered, and dispatch them
	 */
	protected checkForUpdates(canvas:Canvas, context:RenderingContext) {
		// If the sprite has any listeners
		// Used to determine wether or not to check for mouse movement & clicks
		// and swapping the cursor
		let isListeningForEvent = this.eventListeners.length != 0;
		

		// Keep track if the mouse is hovering over the element
		// Can only be true when there is at least one event listener
		let isHovering = false;

		// If there is an event listener, check if the mouse is hovering
		if (isListeningForEvent) isHovering = this.isMouseHovering(context);

		// If the mouse is hovering (and there is an event listener)
		// Swap the cursor and dispatch the click event if possible
		if (isHovering) {

			// Swap the cursor
			Engine.cursor = "pointer";

			// If the mouse is clicking, dispatch the click event
			if (MouseManager.buttons.left) {

				// Dispatch the click event
				this.dispatchEvent("click");

				// Unclick the mouse
				MouseManager.buttons.left = false;
			}
		}
	}

	protected abstract isMouseHovering(context:RenderingContext): boolean;

	public abstract render( canvas:Canvas, context:RenderingContext ):void;

}