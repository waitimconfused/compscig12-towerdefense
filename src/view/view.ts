import Engine from "../engine.js";
import { Canvas, Position2D, RenderingContext } from "../types.js";
import { ViewElement } from "./view-element.js";

type ViewElementEventType = "click";
type ViewElementEventListener = { type: ViewElementEventType, callback: ()=> void };

type ViewListenerType = "show" | "hide";
type ViewListenerCallback = ()=>void;

type ViewListenerGroup = {
	[type in ViewListenerType]: ViewListenerCallback[];
};

type ViewBackground = {
	source: null | string | HTMLImageElement;
	repetition: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
	scale: Position2D;
};

export class View {

	public children:ViewElement[] = [];

	public background:ViewBackground = {
		source: null,
		repetition: "repeat",
		scale: [1, 1]
	};

	private _canvasPattern:CanvasPattern | null = null;

	protected listeners:ViewListenerGroup = {
		show: [],
		hide: []
	}
	
	/**
	 * Add `ViewElement`s to the view, to will be rendered onscreen
	 * 
	 * @param elements	`ViewElement` instances
	 */
	public addElement( ...elements:ViewElement[] ):this {
		this.children.push(...elements);
		return this;
	}

	public removeElement( element?:ViewElement ):this {

		if (!element) return this;
		
		let index = this.children.indexOf(element);

		this.children.splice(index, 1);

		return this;
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
	 * Render the `View` onto a provided canvas and context
	 * 
	 * ***INTERNAL USE ONLY***. Used inside `Engine.render().`
	 * 
	 * @param canvas	Specifies what canvas the view will be rendered onto
	 * @param context	Specify what `RenderingContext` to use to draw
	 */
	public render( canvas:Canvas, context:RenderingContext ) {

		// If the background is a CSS colour string
		if (typeof this.background.source == "string") {
			// Set the context's fillStyle
			context.fillStyle = this.background.source;
			
			// Make sure no "canvas pattern" has been set
			this._canvasPattern = null;

			// Fill the background rectangle (covering the canvas)
			context.fillRect(0, 0, canvas.width, canvas.height);

		// If the background is an image
		} else if (this.background.source instanceof HTMLImageElement) {

			// If a pattern has not been created, make one
			if (!this._canvasPattern) {
				// Create a CanvasPattern, using the image and repetition mode
				this._canvasPattern = context.createPattern(
					this.background.source as HTMLImageElement,
					this.background.repetition
				);

				// Create a Matrix Transform, for the pattern
				let transform = new DOMMatrix;

				// Scale the transform
				transform = transform.scale(this.background.scale[0], this.background.scale[1]);

				// Set the pattern's transform to be the transform we just created
				this._canvasPattern?.setTransform(transform);
			}

			// Set the fillStyle to be the pattern
			context.fillStyle = this._canvasPattern as CanvasPattern;

			// Fill the background rectangle (covering the canvas)
			context.fillRect(0, 0, canvas.width, canvas.height);

		}

		// Loop through each child ViewElement, and render it
		for (let i = 0; i < this.children.length; i ++) {

			// Get the ViewElement child
			let element:ViewElement = this.children[i] as ViewElement;

			// Render the child, given the canvas and context
			element.render(canvas, context);
		}

	}
	
}
