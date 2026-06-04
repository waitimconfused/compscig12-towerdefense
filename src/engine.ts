import { Position2D, RenderingContext, StaticClass } from "./types.js";
import { View } from "./view/view.js";
import { ViewCollection } from "./view/view-collection.js";


type EngineStats = {
	/**
	 * Amount of time between previous render tick and the current render tick
	 * 
	 * Measured in milliseconds
	 */
	delta: number;

	/**
	 * Number of frames per second
	 */
	fps: number;

	/**
	 * Process time of previous render tick
	 */
	lastRenderCall: number;
};

type EngineTimer = {
	trigger_time: number;
	complete: ()=>void
};

/**
 * All values that can be used in CSS's `cursor` property
 * EG: `cursor: help`, `cursor: pointer`, `cursor: auto`
 */
type CSSCursor = (
	"auto" | "default" | "none" |
	"context-menu" | "help" | "pointer" | "progress" | "wait" |
	"cell" | "crosshair" | "text" | "vertical-text" |
	"alias" | "copy" | "move" | "no-drop" | "not-allowed" | "grab" | "grabbing" |
	"all-scroll" | "col-resize" | "row-resize" | "n-resize" | "e-resize" | "s-resize" | "w-resize" | "ne-resize" | "nw-resize" | "se-resize" | "sw-resize" | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" |
	"zoom-in" | "zoom-out"
);

export class EngineAnchor {

	public readonly resolver: (width:number, height:number) => Position2D;

	constructor( resolver: (width:number, height:number)=>Position2D ) {

		this.resolver = resolver;

	}
}

export default class Engine extends StaticClass {

	/**
	 * The canvas that represents the screen
	 */
	private static canvas:HTMLCanvasElement;

	/**
	 * The `RenderingContext` of `this.canvas`
	 */
	private static context:RenderingContext;

	/**
	 * An engine flag that stops the rendering loop when encountering an error
	 * 
	 * *Note*: `console.log` does not trigger this.
	 * Only when errors are **thrown** (Example: `throw new Error("message")`)
	 */
	public static haltOnError:boolean = true;

	/**
	 * The internal information about the render loop
	 */
	private static _stats:EngineStats = {
		delta: 0,
		fps: 0,
		lastRenderCall:0
	};

	/**
	 * Information about the render loop
	 */
	public static get stats(): EngineStats {
		// Create a cloned stats object
		// 
		// This prevents other people editing the actual
		// stats, as it is no longer passed by reference
		return structuredClone(this._stats);
	}

	/**
	 * The name/key of the currently displayed view
	 */
	private static _currentView:string;

	/**
	 * The name/key of the currently displayed view
	 */
	public static get currentView() { return this._currentView; }

	/**
	 * A map of view-names and the view attached to it
	 */
	private static views:Map<string, View> = new Map<string, View>();

	public static Anchor = EngineAnchor;

	/**
	 * A bunch or preset anchors for the canvas
	 */
	public static anchorPresets = {
		topLeft:		new EngineAnchor((w, h) => [ 0,   0   ]),
		topCenter:		new EngineAnchor((w, h) => [ w/2, 0   ]),
		topRight:		new EngineAnchor((w, h) => [ w,   0   ]),

		centerLeft:		new EngineAnchor((w, h) => [ 0,   h/2 ]),
		centerCenter:	new EngineAnchor((w, h) => [ w/2, h/2 ]),
		centerRight:	new EngineAnchor((w, h) => [ w,   h/2 ]),

		bottomLeft:		new EngineAnchor((w, h) => [ 0,   h   ]),
		bottomCenter:	new EngineAnchor((w, h) => [ w/2, h   ]),
		bottomRight:	new EngineAnchor((w, h) => [ w,   h   ]),
	}

	/**
	 * The web cursor that should be displayed using CSS
	 */
	public static cursor:CSSCursor = "default";

	/**
	 * A list of timers 
	 */
	public static timers:EngineTimer[] = [];

	/**
	 * Set up the `Engine`, and start the rendering loop
	 * 
	 * @param canvas The canvas that will represent the screen to render onto
	 */
	public static initialize( canvas:HTMLCanvasElement ) {

		// Update the internal canvas
		this.canvas = canvas;

		// Get the rendering-context of the canvas
		this.context = canvas.getContext("2d") as RenderingContext;

		// Start the rendering loop
		this.render();

	}

	/**
	 * Attach a `View` to the engine
	 * 
	 * @param name	The name/identifier of the view (See `this.currentView`)
	 * @param view	The view instance to be rendered when visible (See `this.currentView`)
	 */
	public static createView(name:string, view:View) {

		// If there is already a view with the same name, throw an error
		if ( this.views.has(name) ) throw new Error(`Cannot create duplicate view of "${name}".`);

		// Set the name/view pair
		this.views.set(name, view);

		// If the currentView has not been set yet, show the newly-made view
		if (!this._currentView) this.showView(name);

	}

	/**
	 * Show a view inside the engine
	 * 
	 * @param name	The name of the view to be shown
	 * 
	 * @returns		The view that will be shown. `null` means
	 * 				that the view could not be found.
	 */
	public static showView(name:string):View|null {

		// Split the view-name by slashes
		// Turns it into a list of view-collection/view paths
		// Example: "path/to/view"
		let viewNames = name.split("/");
		
		// Get the first view-name from the path
		// Example: "path"
		let viewName = viewNames.shift() as string;

		// Join the rest of the view names
		// Example: "to/view"
		let subViewNames = viewNames.join("/");
		
		// If the highest-view is not a child of this view, stop
		if (this.views.has(name) == false) {

			// Log an error
			console.error(`Cannot show unset view of "${name}".`);

			return null;
		}

		// Get the requested view
		let view:View = this.views.get(viewName) as View;
		
		// If there are more paths, and the gotten view
		// is a ViewCollection, give the paths to it to show
		if (subViewNames && view instanceof ViewCollection) {
			view.showView(subViewNames);
		}
		
		// Get the current view
		let currentView:View|undefined = this.views.get(this._currentView);

		// Dispatch the "hide" event on the current view
		if (currentView) currentView.dispatchEvent("hide");

		// Dispatch the "show" event on the new view
		view.dispatchEvent("show");

		// Update the current view
		this._currentView = viewName;
		
		return view;

	}

	/**
	 * Render engine into the screen (see `Engine.initialize(canvas)`)
	 */
	private static render() {

		// Set the cursor to be the default CSS cursor
		// 
		// Depending on if a rendered ViewElement overwrites
		// this, the web cursor will visually change
		this.cursor = "default";

		// Get the current time
		let currentTime = performance.now();

		// Calculate the delta-time
		this._stats.delta = currentTime - this._stats.lastRenderCall;

		// Turn the delta-time into frames-per-seconds (rounded to the nearest 0.01)
		this._stats.fps = 1000 / this._stats.delta;
		this._stats.fps = Math.round(this._stats.fps * 100) / 100;

		// Loop through each created timer, and trigger
		// it if its time is up
		for (let i = 0; i < Engine.timers.length; i ++) {

			// Get the current timer
			let timer:EngineTimer = Engine.timers[i] as EngineTimer;

			// If the timer's time is not up, continue onto the next timer
			if (currentTime < timer.trigger_time) continue;

			// Call the timer's completion function
			timer.complete();

			// Remove the timer from the list, and bump the current index back by 1
			// This prevents a timer from being skipped over
			Engine.timers.splice(i, 1);
			i -= 1;
		}

		// Update the canvas's size to match the window's size, if needed
		if (this.canvas.width != window.innerWidth)		this.canvas.width = window.innerWidth;
		if (this.canvas.height != window.innerHeight)	this.canvas.height = window.innerHeight;

		// Clear the canvas
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.views.has(this._currentView)) {
			let view:View = this.views.get(this._currentView) as View;

			try {
				view.render( this.canvas, this.context );
			} catch(e) {

				// Reformat and log the error to the console
				if (e instanceof Error) logFormattedError(e);

				// If the haltOnError flag is true, stop rendering
				if (Engine.haltOnError == true) {
					// Warn that the engine has been stopped, with styles!
					console.warn(
						"Halting engine. (Prevent halting by setting %cEngine.haltOnError=false%c)",
						"font-style: italic",
						"font-style: normal"
					);
					// Stop before the `window.requestAnimationFrame` can be called
					return;
				}

			}

		}

		// Update the actual CSS cursor 
		this.canvas.style.cursor = this.cursor;

		// Update the last-render-call time to be the current (ish) time
		this._stats.lastRenderCall = currentTime;

		// Schedule an animation frame call
		window.requestAnimationFrame(() => this.render());
	}

	/**
	 * Turn an anchor into a screen-space position
	 * 
	 * @param anchor	The anchor to resolve
	 * @returns			The screen-space position
	 */
	public static resolveAnchor(anchor:EngineAnchor):Position2D {

		// Get the screen-space position from the anchor, based on the canvas/screen size
		return anchor.resolver(this.canvas.width, this.canvas.height);

	}

	/**
	 * Return a promise that resolves after a set amount of time
	 * 
	 * *Note*: The precision of the timer depends on how fast the Engine can render
	 * 
	 * @param time	The duration of the timer (*measured in **milliseconds***)
	 * @returns 
	 */
	public static wait(time:number):Promise<void> {

		// Create & return a promise
		return new Promise((complete) => {

			// Create a new timer
			Engine.timers.push({
				
				// The timestamp that the timer should be triggered after
				// is equal to the current time plus the timer duration 
				trigger_time: performance.now() + time,

				// Pass the promise resolution function as the
				// function to call when the timer has completed
				complete: complete
			});
		})

	}
}

function logFormattedError(error:Error) {

	// Get the errors type/name, message, and files/stack
	let name:string = error.name as string;
	let message:string = error.message as string;
	let stack:string = error.stack as string;

	// Remove all the stack paths that are related to "window.requestAnimationFrame"
	stack = stack.replace(/\nFrameRequestCallback[\s\S]*$/, "");

	type LineParts = [ string, string ];

	// Get a list of all lines inside the stack
	let lines:string[] = stack.split("\n");

	// Keep track of how long the max pre-link string is
	let maxPreLinkLength:number = 0;

	// Loop through each line, and get the max length of the pre-link part
	for (let i = 0; i < lines.length; i ++) {
		let line:string = lines[i] as string;

		let lineParts:LineParts = line.split("@") as LineParts;

		let preLink:string = lineParts[0];
		preLink = preLink.replace("/<", "");

		maxPreLinkLength = Math.max(maxPreLinkLength, preLink.length);
	}

	// Loop through each line, reformatting the line to have
	// a consistent separation between pre-links and links
	for (let i = 0; i < lines.length; i ++) {
		let line:string = lines[i] as string;
		let lineParts:LineParts = line.split("@") as LineParts;

		// Get the pre-link and link
		let preLink:string = lineParts[0] ?? "";
		let link:string = lineParts[1] ?? "";

		preLink = preLink.replace("/<", "");

		// Reformat the links to have the locations in brackets					
		link = link.replace(/:(\d+):(\d+)/gm, " (line $1, char $2)");

		// Generate the number of spaces to go between the pre-link and the link+location
		let separator = " ".repeat(maxPreLinkLength + 3 - preLink.length);

		// Update the line string
		line = preLink + separator + link;

		// Put the updated line string back into the array
		lines[i] = line;
	}

	// Join all the lines with newlines
	stack = lines.join("\n");

	// Log the error
	console.error(`${name}: ${message}\n\n${stack}`);
}