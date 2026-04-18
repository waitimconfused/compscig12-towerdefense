import { RenderingContext } from "./types.js";
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
}

export default class Engine {

	private canvas:HTMLCanvasElement;
	private context:RenderingContext;

	private _stats:EngineStats = { delta:0, fps:0, lastRenderCall:0 }

	private _currentView:string;
	public get currentView() { return this._currentView; }

	private views:ViewObjectLayout = {};

	public static windowVisible:boolean = true;

	static timers:EngineTimer[] = [];

	constructor( canvas:HTMLCanvasElement ) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d") as RenderingContext;

		this.render();

	}

	public createView(name:string, view:View) {

		if (name in this.views) throw new Error(`Cannot create duplicate view of "${name}".`);

		this.views[name] = view;

		if (!this._currentView) this._currentView = name;

	}

	public showView(name:string):View|null {

		if (name in this.views) {
			console.error(`Cannot show unset view of "${name}".`);
		
		} else {
			this._currentView = name;
		}

		return this.views[name] ?? null;
		
	}

	
	private render() {

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

}

document.addEventListener("visibilitychange", (event) => {

	if (document.visibilityState == "visible") {
		Engine.windowVisible = true;
	} else {
		Engine.windowVisible = false;
	}

});


export function wait(time:number):Promise<void> {

	return new Promise((complete) => {
		Engine.timers.push({
			start: performance.now(),
			duration: time,
			complete: complete
		});
	})

}