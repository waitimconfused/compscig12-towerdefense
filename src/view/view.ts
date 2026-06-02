import Engine from "../engine.js";
import { Canvas, Position2D, RenderingContext } from "../types.js";
import { ViewElementCollection } from "./view-element-collection.js";
import { ViewElement } from "./view-element.js";

type ViewElementEventType = "click";
type ViewElementEventListener = { type: ViewElementEventType, callback: ()=> void };

type ViewListenerType = "show" | "hide";
type ViewListenerCallback = ()=>void;

type ViewListenerGroup = {
	[type in ViewListenerType]: ViewListenerCallback[];
};

export type ViewBackground = {
	source: null | string | HTMLImageElement;
	repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
	scale: Position2D;
};

export class View extends ViewElementCollection {

	/**
	 * The background that will cover the screen behind
	 * the `ViewElement` children
	 */
	public background:ViewBackground = {
		source: null,
		repetition: "repeat",
		scale: [1, 1]
	};

	/**
	 * The generated `CanvasPattern` to be used for `context.fillStyle`.
	 * 
	 * If `this.background.source` is not an image, it will be `null`.
	 */
	private _canvasPattern:CanvasPattern | null = null;

	/**
	 * Keep track of the callback functions to use when dispatching (`this.dispatchEvent()`) events
	 */
	protected listeners:ViewListenerGroup = {
		show: [],
		hide: []
	}

	/**
	 * Add en event listener to the view
	 * 
	 * @param type		What kind of event should trigger the callback function
	 * @param callback	Called when the event is triggered
	 */
	public addEventListener(type:ViewListenerType, callback:ViewListenerCallback):this {
		this.listeners[type].push(callback);
		return this;
	}

	/**
	 * Trigger an event listener, based on the event type
	 * 
	 * @param type	Specifies what kind of event should be triggered
	 */
	public dispatchEvent(type:ViewListenerType) {

		// Get a list of callback functions that are for the same event type
		let listeners:ViewListenerCallback[] = this.listeners[type];
		
		// Loop through each listener, and call it
		for (let i = 0; i < listeners.length; i ++) {
			
			// Get the callback function from the list of listeners
			let callback:ViewListenerCallback = listeners[i] as ViewListenerCallback;
			
			// Call the function
			callback();
		}

	}

	/**
	 * Render the background onto a provided canvas and context
	 * 
	 * @param canvas	Specifies what canvas the background will be rendered onto
	 * @param context	Specify what `RenderingContext` to use to draw
	 */
	protected renderBackground(canvas:Canvas, context:RenderingContext) {

		// If the gameplayBackground has no value, do not attempt to render anything
		if (!this.background.source) return;

		// Get the source of the background
		let source:string|HTMLImageElement = this.background.source;

		// If the source is a colour (string)
		// Make sure the pattern is unset
		if (typeof source == "string") {
			this._canvasPattern = null;
		}

		// If the source is an image, and the pattern has not made
		if (source instanceof HTMLImageElement && !this._canvasPattern) {

			// Create a CanvasPattern, using the image and repetition mode
			this._canvasPattern = context.createPattern(
				this.background.source as HTMLImageElement,
				this.background.repetition
			);

			// Create a Matrix Transform, for the pattern
			// This is used to apply transformations to the pattern (scale/translation/rotation)
			let transform = new DOMMatrix;

			// Scale the transform
			transform = transform.scale(this.background.scale[0], this.background.scale[1]);

			// Set the pattern's transform to be the transform we just created
			this._canvasPattern!.setTransform(transform);
		}

		// Set the fillStyle to be the CanvasPattern or the source
		// The source will be a colour (string) if the CanvasPattern is non-existent
		context.fillStyle = this._canvasPattern ?? (source as string);

		// Fill a rectangle with the fillStyle with the playSpaceSize dimensions
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	/**
	 * Render the `View` onto a provided canvas and context
	 * 
	 * ***INTERNAL USE ONLY***. Used inside `Engine.render().`
	 * 
	 * @param canvas	Specifies what canvas the view will be rendered onto
	 * @param context	Specify what `RenderingContext` to use to draw
	 * 
	 * @param showBackground	Choose to render the background (`this.background`) or not
	 * @param showElements		Choose to render the child elements (`this.children`) or not
	 */
	public override render( canvas:Canvas, context:RenderingContext, showBackground=true, showElements=true ) {

		// Render the background
		if (showBackground) this.renderBackground(canvas, context);

		// Render the ViewElement children
		if (showElements) super.render(canvas, context);

	}
	
}
