import { Position2D, RenderingContext } from "./types.js";
import { View, ViewCollection } from "./view/view.js";


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
	 * Maximum amount of frames per second
	 * 
	 * Optional
	 */
	max_fps?: number;

	/**
	 * Process time of previous render tick
	 */
	lastRenderCall: number;
};

type EngineTimer = {
	start: number;
	duration: number;
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

export default class Engine {

	private static canvas:HTMLCanvasElement;
	private static context:RenderingContext;

	public static haltOnError:boolean = true;

	private static _stats:EngineStats = {
		delta: 0,
		fps: 0,
		max_fps: 60,
		lastRenderCall:0
	};
	public static get stats() { return {
		delta: this._stats.delta,
		fps: this._stats.fps,
	} }

	private static _currentView:string;
	public static get currentView() { return this._currentView; }

	private static views:Map<string, View> = new Map<string, View>();

	public static anchor = {
		topLeft:		Symbol("Anchor:tl"),
		topCenter:		Symbol("Anchor:tc"),
		topRight:		Symbol("Anchor:tr"),

		centerLeft:		Symbol("Anchor:cl"),
		centerCenter:	Symbol("Anchor:cc"),
		centerRight:	Symbol("Anchor:cr"),

		bottomLeft:		Symbol("Anchor:bl"),
		bottomCenter:	Symbol("Anchor:bc"),
		bottomRight:	Symbol("Anchor:br"),
	}

	public static cursor:CSSCursor = "default";

	public static timers:EngineTimer[] = [];

	constructor() {
		throw new TypeError("Engine is not a constructor");
	}

	public static initialize( canvas:HTMLCanvasElement ) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d") as RenderingContext;

		this.render();

	}

	public static createView(name:string, view:View) {

		if ( this.views.has(name) ) throw new Error(`Cannot create duplicate view of "${name}".`);

		this.views.set(name, view);

		if (!this._currentView) this.showView(name);

	}

	public static showView(name:string):View|null {

		
		let viewNames = name.split("/");
		
		let viewName = viewNames.shift() as string;
		let subViewNames = viewNames.join("/");
		
		if (this.views.has(viewName) == false) {
			console.error(`Cannot show unset view of "${name}".`);
			return null;
		}

		let view:View = this.views.get(viewName) as View;

		if (subViewNames && view instanceof ViewCollection) {
			view.showView(subViewNames);
		}

		let currentView:View|undefined = this.views.get(this._currentView);
		if (currentView) currentView.dispatchEvent("hide");

		view.dispatchEvent("show");
		this._currentView = viewName;
		
		return view ?? null;

	}

	private static render() {

		this.cursor = "default";

		let currentTime = performance.now();
		
		this._stats.delta = currentTime - this._stats.lastRenderCall;
		
		this._stats.fps = 1000 / this._stats.delta;
		this._stats.fps = Math.round(this._stats.fps * 100) / 100;

		if (this._stats.max_fps && this._stats.delta < 1000 / this._stats.max_fps) {
			window.requestAnimationFrame(() => this.render());
			return;
		}

		for (let i = 0; i < Engine.timers.length; i ++) {
			let timer:EngineTimer = Engine.timers[i] as EngineTimer;

			if (currentTime < timer.start + timer.duration) continue;
			
			timer.complete();

			Engine.timers.splice(i, 1);
		}

		if (this.canvas.width != window.innerWidth)		this.canvas.width = window.innerWidth;
		if (this.canvas.height != window.innerHeight)	this.canvas.height = window.innerHeight;

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.views.has(this._currentView)) {
			let view:View = this.views.get(this._currentView) as View;
			
			try {
				view.render( this.canvas, this.context );
			} catch(e) {

				// Reformat and log the error to the console
				logFormattedError(e as Error);
				
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

		this.canvas.style.cursor = this.cursor;

		this._stats.lastRenderCall = currentTime;
		window.requestAnimationFrame(() => this.render());
	}

	public static resolveAnchor(anchor:symbol):Position2D {

		switch (anchor) {
			case Engine.anchor.topLeft:
				return [ 0,						0 ];

			case Engine.anchor.topCenter:
				return [ window.innerWidth/2,	0 ];

			case Engine.anchor.topRight:
				return [ window.innerWidth,		0 ];


			case Engine.anchor.centerLeft:
				return [ 0,						window.innerHeight/2 ];

			case Engine.anchor.centerCenter:
				return [ window.innerWidth/2,	window.innerHeight/2 ];

			case Engine.anchor.centerRight:
				return [ window.innerWidth,		window.innerHeight/2 ];


			case Engine.anchor.bottomLeft:
				return [ 0,						window.innerHeight ];

			case Engine.anchor.bottomCenter:
				return [ window.innerWidth/2,	window.innerHeight ];

			case Engine.anchor.bottomRight:
				return [ window.innerWidth,		window.innerHeight ];

				
			default:
				console.error(`Unknown anchor "${anchor.description}".`);
				return [ 0, 0 ];
		}
	}
}

export function wait(time:number):Promise<void> {

	return new Promise((complete) => {
		Engine.timers.push({
			start: performance.now(),
			duration: time,
			complete: complete
		});
  })

}

function logFormattedError(error:Error) {
				
	// Get the errors type/name, message, and files/stack
	let name:string = error.name as string;
	let message:string = error.message as string;
	let stack:string = error.stack as string;

	type StackParts = [string, string];
	type LineParts = [ string, string ];

	// Remove all files after "FrameRequestCallback"
	let regex:RegExp = /^([\s\S]*?)FrameRequestCallback/g;
	let stackStart:StackParts = stack.match(regex) as StackParts;
	stack = stackStart[0].replace("\nFrameRequestCallback", "");

	// Get a list of all lines inside the stack
	let lines:string[] = stack.split("\n");

	// Keep track of how long the max pre-link string is
	let maxPreLinkLength:number = 0;

	// Loop through each line, and get the max length of the pre-link part
	for (let i = 0; i < lines.length; i ++) {
		let line:string = lines[i] as string;

		let lineParts:LineParts = line.split("@") as LineParts;

		let preLink:string = lineParts[0];
		
		maxPreLinkLength = Math.max(maxPreLinkLength, preLink.length);
	}

	// Loop through each line, reformatting the line to have
	// a consistent separation between pre-links and links
	for (let i = 0; i < lines.length; i ++) {
		let line:string = lines[i] as string;
		let lineParts:LineParts = line.split("@") as LineParts;

		// Get the pre-link and link
		let preLink:string = lineParts[0];
		let link:string = lineParts[1];

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
	console.error(`${name}: ${message}\n${stack}`);
}