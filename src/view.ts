import Engine from "./engine.js";
import { SpriteRenderer } from "./sprites.js";
import { Canvas, Position2D, RenderingContext } from "./types.js";

export class View {

	private elements:ViewElement[] = [];
	
	public addElement( ...elements:ViewElement[] ):this {
		this.elements.push(...elements);
		return this;
	}
	
	public render( canvas:Canvas, context:RenderingContext ) {

		for (let i = 0; i < this.elements.length; i ++) {
			let element:ViewElement = this.elements[i] as ViewElement;
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

		if (!this._currentView) this._currentView = name;
		return this;

	}

	public showView(name:string):View|null {

		if (name in this.views == false) {
			console.error(`Cannot show unset view of "${name}".`);
		
		} else {
			this._currentView = name;
		}

		return this.views[name] ?? null;
		
	}

	public override render(canvas:Canvas, context:RenderingContext) {

		if (this._currentView in this.views) {
			let view:View = this.views[this._currentView] as View;
			view.render( canvas, context );
		}

	}

}

export type ViewObjectLayout = { [name:string]: View|undefined };
export type ViewCallbackFunction = ( (e:KeyboardEvent)=>void );
export type ViewElementStroke = {
	colour: string,
	size: number,
	lineCap: "butt" | "round" | "square",
	lineJoin: "round" | "bevel" | "miter",
	dash: number[] | null,
	dashOffset:number
};

class ViewElement {

	private _position:Position2D|symbol = [ 0, 0 ];

	public get position() {
		if (typeof this._position == "symbol") {
			return Engine.resolveAnchor(this._position) ?? [ 0, 0 ];
		} else {
			return this._position;
		}
	}
	
	private clickEvent:ViewCallbackFunction|null = null;

	public stroke: ViewElementStroke = {
		colour: "black",
		size: 5,
		lineCap: "square",
		lineJoin: "miter",
		dash: null,
		dashOffset: 0
	}

	public fill:string = "purple";

	public rotation:number = 0;

	/**
	 * @param anchor See `View.anchor`
	 */
	public setAnchor(anchor:symbol):this {
		if ( Object.values(Engine.anchor).includes(anchor) == false ) {
			console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.description}".`);
			return this;
		}
		this._position = anchor;
		return this;
	}

	public moveTo(x:number, y:number):this {
		this._position = [ x, y ];
		return this;
	}
	
	public setClickEvent(event: ViewCallbackFunction|null ): this {
		this.clickEvent = event;
		return this;
	}

	public setRotation(degrees:number):this {
		// Convert degrees to radians
		this.rotation = degrees * Math.PI / 180;
		return this;
	}

	public render( canvas:Canvas, context:RenderingContext ) {

	}

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
	}

	public alignment:ViewTextAlignment = {
		x: "left",
		y: "top"
	};

	constructor(content:string) {
		super();
		this.content = content;
	}

	public override render(canvas:Canvas, context:RenderingContext) {

		setGeneralStyles(context, this);
		
		context.font = `bold ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;

		context.fillText( this.content, this.position[0], this.position[1] );
		context.strokeText( this.content, this.position[0], this.position[1] );
	}

}


export class ViewRect extends ViewElement {
	public size:Position2D = [ 0, 0 ];

	public override render(canvas: Canvas, context: RenderingContext): void {
		setGeneralStyles(context, this);
		
		context.beginPath();
		context.fillRect(this.position[0], this.position[1], this.size[0], this.size[1]);
		context.closePath();

		context.fill();
		context.stroke();

	}

	public setSize(width:number, height:number): this {
		this.size[0] = width;
		this.size[1] = height;

		return this;
	}
}

export class ViewSprite extends ViewElement {

	public reference:string;

	public size:Position2D = [ 100, 100 ];

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

		context.translate( this.position[0], this.position[1] );
		context.rotate(this.rotation);
		context.translate( -this.origin[0]*this.size[0], -this.origin[1]*this.size[1] );

		SpriteRenderer.drawSprite({
			name: this.reference,
			position: [ 0, 0 ],
			size: this.size
		}, context);

		context.restore();


	}
}


function setGeneralStyles( context:RenderingContext, viewElement:ViewElement ): void {
	context.strokeStyle = viewElement.stroke.colour;
	
	context.setLineDash( viewElement.stroke.dash ?? [0] );
	context.lineDashOffset = viewElement.stroke.dashOffset;
	
	context.lineCap = viewElement.stroke.lineCap;
	context.lineJoin = viewElement.stroke.lineJoin;
	context.lineWidth = viewElement.stroke.size;

	context.fillStyle = viewElement.fill;
}