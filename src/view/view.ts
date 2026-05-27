import Engine from "../engine.js";
import { Canvas, Position2D, RenderingContext } from "../types.js";

type ViewElementEventType = "click";
type ViewElementEventListener = { type: ViewElementEventType, callback: ()=> void };

type ViewListenerType = "show" | "hide";
type ViewListenerCallback = ()=>void;

type ViewListenerGroup = {
	[type in ViewListenerType]: ViewListenerCallback[];
}

export class View {

	public children:ViewElement[] = [];

	protected listeners:ViewListenerGroup = {
		show: [],
		hide: []
	}
	
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

	public addEventListener(type:ViewListenerType, callback:ViewListenerCallback):this {
		this.listeners[type].push(callback);
		return this;
	}

	public dispatchEvent(type:ViewListenerType) {

		for (let i = 0; i < this.listeners[type].length; i ++) {
			let callback = this.listeners[type][i] as ViewListenerCallback;
			callback();
		}

	}
	
	public render( canvas:Canvas, context:RenderingContext ) {

		for (let i = 0; i < this.children.length; i ++) {
			let element:ViewElement = this.children[i] as ViewElement;
			element.render(canvas, context);
		}

	}
	
}

export class ViewCollection extends View {

	private _currentView:string;
	public get currentView() { return this._currentView; }

	private views:Map<string, View> = new Map<string, View>();

	public override addElement(...element: ViewElement[]): this {
		console.error(`"ViewElement" instances cannot be added to "ViewCollection".`);
		return this;
	}

	public createView(name:string, view:View):this {

		if ( this.views.has(name) ) throw new Error(`Cannot create duplicate view of "${name}".`);

		this.views.set(name, view);

		if (!this._currentView) this.showView(name);
		return this;

	}

	public showView(name:string):View|null {

		
		let viewNames = name.split("/");
		
		let viewName = viewNames.shift() as string;
		let subViewNames = viewNames.join("/");
		
		if (this.views.has(name) == false) {
			console.error(`Cannot show unset view of "${name}".`);
			return null;
		}

		let view:View = this.views.get(viewName) as View;
		
		
		if (subViewNames && view instanceof ViewCollection) {
			view.showView(subViewNames);
		}
		
		for (let i = 1; i < viewNames.length; i ++) {
			
			let name = viewNames[i] as string;
			
			if (view instanceof ViewCollection == false) continue;
			
			view.showView(name);
			
		}
		
		let currentView:View|undefined = this.views.get(this._currentView);
		if (currentView) currentView.dispatchEvent("hide");

		view.dispatchEvent("show");
		this._currentView = viewName;
		
		return view ?? null;

	}

	public override render(canvas:Canvas, context:RenderingContext) {

		if (this.views.has(this._currentView)) {
			let view:View = this.views.get(this._currentView) as View;
			view.render( canvas, context );
		}

	}

}

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

	protected _anchor:symbol = Engine.anchor.topLeft;
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
	public setAnchor(anchor?:symbol):this {

		if (!anchor) anchor = Engine.anchor.topLeft;

		if ( Object.values(Engine.anchor).includes(anchor) == false ) {
			console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.description}".`);
			return this;
		}
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
		this._position = [ x, y ];
		return this;
	}

	public setFill(fill:string | CanvasGradient | CanvasPattern):this {
		this.fill = fill;
		return this;
	}

	public setStroke(
		colour: string | CanvasGradient | CanvasPattern,
		size: number,
		lineCap?: "square" | "butt" | "round",
		lineJoin?: "round" | "miter" | "bevel"
	): this {
		this.stroke.colour = colour;
		this.stroke.size = size;
		if (lineCap) this.stroke.lineCap = lineCap;
		if (lineJoin) this.stroke.lineJoin = lineJoin;
		return this;
	}
	
	public addEventListener(type:ViewElementEventType, callback: ViewCallbackFunction ): this {
		
		this.eventListeners.push({ type, callback });

		return this;
	}

	public dispatchEvent(type:ViewElementEventType) {
		
		for (let i = 0; i < this.eventListeners.length; i ++) {

			let listener = this.eventListeners[i] as ViewElementEventListener;

			if (listener.type != type) continue;

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
		
		if (mode == "deg") angle *= Math.PI / 180;

		this.rotation = angle;
		return this;
	}

	protected setGeneralStyles( context:RenderingContext ): void {

		context.translate( this.position[0], this.position[1] );
		context.rotate(this.rotation);

		if (
			this.stroke.colour != "none" &&
			this.stroke.colour != "transparent" &&
			this.stroke.size > 0
		) {
			context.strokeStyle = this.stroke.colour;
		
			context.setLineDash( this.stroke.dash ?? [0] );
			context.lineDashOffset = this.stroke.dashOffset;
			
			context.lineCap = this.stroke.lineCap;
			context.lineJoin = this.stroke.lineJoin;
			context.lineWidth = this.stroke.size;
		} else {
			context.strokeStyle = "transparent";
			context.lineWidth = 0;
		}

		context.fillStyle = this.fill;
	}

	protected abstract isMouseHovering(context:RenderingContext): boolean;

	public abstract render( canvas:Canvas, context:RenderingContext ):void;

}