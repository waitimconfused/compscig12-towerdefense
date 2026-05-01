import { Position2D, RenderingContext } from "./types.js";
import { View, ViewObjectLayout } from "./view.js";


type EngineStats = {
	delta: number,
	fps: number,
	lastRenderCall: number
};

type EngineTimer = {
	start: number;
	duration: number;
	complete: ()=>void
};

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

	private static _stats:EngineStats = { delta:0, fps:0, lastRenderCall:0 }

	private static _currentView:string;
	public static get currentView() { return this._currentView; }

	private static views:ViewObjectLayout = {};

	public static windowVisible:boolean = true;

	public static anchor = {
		topLeft:		Symbol("Anchor:tl"),
		topCenter:		Symbol("Anchor:tl"),
		topRight:		Symbol("Anchor:tr"),

		centerLeft:		Symbol("Anchor:cl"),
		centerCenter:	Symbol("Anchor:cl"),
		centerRight:	Symbol("Anchor:cr"),

		bottomLeft:		Symbol("Anchor:bl"),
		bottomCenter:	Symbol("Anchor:bl"),
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

		if (name in this.views) throw new Error(`Cannot create duplicate view of "${name}".`);

		this.views[name] = view;

		if (!this._currentView) this._currentView = name;

	}

	public static showView(name:string):View|null {

		if (name in this.views == false) {
			console.error(`Cannot show unset view of "${name}".`);
		
		} else {
			this._currentView = name;
		}

		return this.views[name] ?? null;
		
	}

	private static render() {

		this.cursor = "default";

		if (Engine.windowVisible == false) {
			console.log("PAUSED");
			Engine.waitForVisible()
				.then(() => {
					console.log("PLAY");
					this.render();
				});
			return;
		}

		let currentTime = performance.now();
		
		this._stats.delta = currentTime - this._stats.lastRenderCall;
		this._stats.fps = 1000 / this._stats.delta;

		for (let i = 0; i < Engine.timers.length; i ++) {
			let timer:EngineTimer = Engine.timers[i] as EngineTimer;

			if (currentTime < timer.start + timer.duration) continue;
			
			timer.complete();

			Engine.timers.splice(i, 1);
		}

		if (this.canvas.width != window.innerWidth)		this.canvas.width = window.innerWidth;
		if (this.canvas.height != window.innerHeight)	this.canvas.height = window.innerHeight;

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this._currentView in this.views) {
			let view:View = this.views[this._currentView] as View;
			view.render( this.canvas, this.context );
		}

		this.canvas.style.cursor = this.cursor;

		this._stats.lastRenderCall = currentTime;
		window.requestAnimationFrame(() => this.render());
	}

	public static async waitForVisible():Promise<true> {
		return new Promise((resolve) => {

			let anonymous = () => {
				document.removeEventListener("visibilitychange", anonymous);
				resolve(true);
			};

			document.addEventListener("visibilitychange", anonymous);

		});
	}

	public static resolveAnchor(anchor:symbol):Position2D|null {

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
				return null;
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

document.addEventListener("visibilitychange", (event) => {

	if (document.visibilityState == "visible") {
		Engine.windowVisible = true;
	} else {
		Engine.windowVisible = false;
	}

});