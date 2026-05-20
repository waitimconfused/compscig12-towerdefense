import Engine from "../engine.js";
import { MouseManager } from "../mouse.js";
import { SpriteRenderer } from "../sprites.js";
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

	private views:ViewObjectLayout = {};

	public override addElement(...element: ViewElement[]): this {
		console.error(`"ViewElement" instances cannot be added to "ViewCollection".`);
		return this;
	}

	public createView(name:string, view:View):this {

		if (name in this.views) throw new Error(`Cannot create duplicate view of "${name}".`);

		this.views[name] = view;

		if (!this._currentView) this.showView(name);
		return this;

	}

	public showView(name:string):View|null {

		
		let viewNames = name.split("/");
		
		let viewName = viewNames.shift() as string;
		let subViewNames = viewNames.join("/");
		
		if (viewName in this.views == false) {
			console.error(`Cannot show unset view of "${name}".`);
			return null;
		}

		let view:View = this.views[viewName] as View;
		
		
		if (subViewNames && view instanceof ViewCollection) {
			view.showView(subViewNames);
		}
		
		for (let i = 1; i < viewNames.length; i ++) {
			
			let name = viewNames[i] as string;
			
			if (view instanceof ViewCollection == false) continue;
			
			view.showView(name);
			
		}
		
		this.views[this._currentView]?.dispatchEvent("hide");
		view.dispatchEvent("show");
		this._currentView = viewName;
		
		return view ?? null;

	}

	public override render(canvas:Canvas, context:RenderingContext) {

		if (this._currentView in this.views) {
			let view:View = this.views[this._currentView] as View;
			view.render( canvas, context );
		}

	}

}

export type ViewObjectLayout = { [name:string]: View|undefined };
export type ViewCallbackFunction = ( ()=>void );
export type ViewElementStroke = {
	colour: string,
	size: number,
	lineCap: "butt" | "round" | "square",
	lineJoin: "round" | "bevel" | "miter",
	dash: number[] | null,
	dashOffset:number
};

abstract class ViewElement {

	private _anchor:symbol = Engine.anchor.topLeft;
	private _position:Position2D = [ 0, 0 ];

	protected eventListeners:ViewElementEventListener[] = [];

	/**
	 * The real position of the `ViewElement`.
	 * 
	 * Uses the set anchor to calculate
	 */
	public get position():Position2D {
		
		// Get the real position of the anchor
		let anchorPosition:Position2D = Engine.resolveAnchor(this._anchor);

		// Calculate the real position of self (anchor + position)
		let totalPosition:Position2D = [
			anchorPosition[0] + this._position[0],
			anchorPosition[1] + this._position[1]
		];

		return totalPosition;

	}
	
	private click:ViewCallbackFunction|null = null;

	public stroke: ViewElementStroke = {
		colour: "black",
		size: 5,
		lineCap: "square",
		lineJoin: "miter",
		dash: null,
		dashOffset: 0
	}

	public fill:string = "purple";

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
	public moveTo(x:number, y:number):this {
		this._position = [ x, y ];
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

	public setRotation(degrees:number):this {
		// Convert degrees to radians
		this.rotation = degrees * Math.PI / 180;
		return this;
	}

	protected abstract isMouseHovering(context:RenderingContext): boolean;

	public abstract render( canvas:Canvas, context:RenderingContext ):void;

}

type ViewTextAlignment = {
	y: CanvasTextBaseline;
	x: CanvasTextAlign;
};

type ViewTextFont = {
	family: string;
	size: number | string;
	style: string;
}

export class ViewText extends ViewElement {

	public content = "";

	public font:ViewTextFont = {
		family: "serif",
		size: 100,
		style: "regular"
	};

	public alignment:ViewTextAlignment = {
		x: "left",
		y: "top"
	};

	constructor(content:string) {
		super();
		this.content = content;
	}

	protected override isMouseHovering(context:RenderingContext):boolean {

		let inverseTransform = context.getTransform().inverse();

		let mouseAsPoint:DOMPointInit = new DOMPoint(MouseManager.x, MouseManager.y);

		let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);

		let internalMouse:Position2D = [ internalMousePoint.x, internalMousePoint.y ];
		
		context.font = `bold ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;
		
		let rawSize = context.measureText(this.content);
		let size:Position2D = [rawSize.width, rawSize.fontBoundingBoxDescent + rawSize.fontBoundingBoxAscent];
		this.size = size;
		
		
		let offset:Position2D = [ 0, 0 ];
		
		switch (this.alignment.y) {
			case "alphabetic":
				offset[1] -= size[1] * 0.75;
				break;
			case "bottom":
				offset[1] -= size[1];
				break;
			case "hanging":
				offset[1] -= size[1] * 0.25;
				break;
			case "ideographic":
				offset[1] -= size[1];
				break;
			case "middle":
				offset[1] -= size[1] * 0.5;
				break;
			case "top":
				offset[1] -= size[1] * 0.125;
				break;
		}

		switch (this.alignment.x) {
			case "center":
				offset[0] -= size[0] * 0.5;
				break;
			case "end":
				offset[0] -= size[0];
				break;
			case "left":
				// Do nothing
				break;
			case "right":
				offset[0] -= size[0];
				break;
			case "start":
				// Do nothing
				break;
		}
			
		if (internalMouse[0] < offset[0]) return false;
		if (internalMouse[1] < offset[1]) return false;
		if (internalMouse[0] > offset[0] + size[0]) return false;
		if (internalMouse[1] > offset[1] + size[1]) return false;

		return true;

	}

	public override render(canvas:Canvas, context:RenderingContext) {

		context.save();
		setGeneralStyles(context, this);

		let isHovering = this.isMouseHovering(context);

		if (isHovering && this.eventListeners.find(e=>e.type=="click")) {
			Engine.cursor = "pointer";
		}

		if (isHovering && MouseManager.buttons.left) {
			this.dispatchEvent("click");
			MouseManager.buttons.left = false;
		}

		context.font = `bold ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;

		context.fillText( this.content, 0, 0 );
		context.strokeText( this.content, 0, 0 );

		context.restore();
	}

}


export class ViewRect extends ViewElement {
	public override size:Position2D = [ 0, 0 ];

	public setSize(width:number, height:number): this {
		this.size[0] = width;
		this.size[1] = height;

		return this;
	}

	protected override isMouseHovering(context: RenderingContext): boolean {
		
		let inverseTransform = context.getTransform().inverse();

		let mouseAsPoint:DOMPointInit = new DOMPoint(MouseManager.x, MouseManager.y);

		let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);

		let internalMouse:Position2D = [ internalMousePoint.x, internalMousePoint.y ];

		if (internalMouse[0] < 0) return false;
		if (internalMouse[1] < 0) return false;
		if (internalMouse[0] > this.size[0]) return false;
		if (internalMouse[1] > this.size[1]) return false;

		return true;

	}

	public override render(canvas: Canvas, context: RenderingContext): void {
		context.save();
		setGeneralStyles(context, this);

		let isHovering = this.isMouseHovering(context);

		if (isHovering && this.eventListeners.find(e=>e.type=="click")) {
			Engine.cursor = "pointer";
		}

		if (isHovering && MouseManager.buttons.left) {
			this.dispatchEvent("click");
			MouseManager.buttons.left = false;
		}
		
		context.beginPath();
		context.fillRect(0, 0, this.size[0], this.size[1]);
		context.closePath();

		context.fill();
		context.stroke();
		context.restore();

	}
}

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

	public setOrigin(x:number, y:number):this {
		this.origin = [ x, y ];
		return this;
	}

	public setSize(width:number, height:number):this {
		this.size[0] = width;
		this.size[1] = height;

		return this;
	}

	public setReference(reference:string):this {
		this.reference = reference;

		return this;
	}

	public override render(canvas: Canvas, context: RenderingContext): void {

		if (SpriteRenderer.isRegistered(this.reference) == false) return;

		context.save();

		setGeneralStyles(context, this);

		let isHovering = this.isMouseHovering(context);

		if (isHovering && this.eventListeners.find(e=>e.type=="click")) {
			Engine.cursor = "pointer";
		}

		if (isHovering && MouseManager.buttons.left) {
			this.dispatchEvent("click");
			MouseManager.buttons.left = false;
		}

		SpriteRenderer.drawSprite({
			name: this.reference,
			position: [ 0, 0 ],
			size: this.size
		}, context);

		context.restore();


	}

	protected override isMouseHovering(context: RenderingContext): boolean {
		let inverseTransform = context.getTransform().inverse();

		let mouseAsPoint:DOMPointInit = new DOMPoint(MouseManager.x, MouseManager.y);

		let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);

		let internalMouse:Position2D = [ internalMousePoint.x, internalMousePoint.y ];

		if (internalMouse[0] < 0) return false;
		if (internalMouse[1] < 0) return false;
		if (internalMouse[0] > this.size[0]) return false;
		if (internalMouse[1] > this.size[1]) return false;

		return true;
	}
}


function setGeneralStyles( context:RenderingContext, viewElement:ViewElement ): void {

	context.translate( viewElement.position[0], viewElement.position[1] );
	context.rotate(viewElement.rotation);

	if (
		viewElement.stroke.colour != "none" &&
		viewElement.stroke.colour != "transparent" &&
		viewElement.stroke.size > 0
	) {
		context.strokeStyle = viewElement.stroke.colour;
	
		context.setLineDash( viewElement.stroke.dash ?? [0] );
		context.lineDashOffset = viewElement.stroke.dashOffset;
		
		context.lineCap = viewElement.stroke.lineCap;
		context.lineJoin = viewElement.stroke.lineJoin;
		context.lineWidth = viewElement.stroke.size;
	} else {
		context.strokeStyle = "transparent";
	}

	context.fillStyle = viewElement.fill;
}