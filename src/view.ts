import { Canvas, Position2D, RenderingContext } from "./types.js";

export class View {

	private elements:ViewElement[] = [];
	
	public addElement( ...element:ViewElement[] ):this {
		this.elements.push(...element);
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

		if (name in this.views) {
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

export class ViewElement {

	public position:Position2D = [ 0, 0 ];
	
	private clickEvent:ViewCallbackFunction|null = null;

	public stroke: ViewElementStroke = {
		colour: "black",
		size: 10,
		lineCap: "square",
		lineJoin: "miter",
		dash: null,
		dashOffset: 0
	}

	public fill:string = "purple";

	public moveTo(x:number, y:number):this {
		this.position[0] = x;
		this.position[y] = y;
		return this;
	}
	
	public setClickEvent(event: ViewCallbackFunction|null ): this {
		this.clickEvent = event;
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
		
		context.font = `bold ${this.font.size}px ${this.font.family}`;
		context.textAlign = this.alignment.x;
		context.textBaseline = this.alignment.y;
		context.fillText( this.content, this.position[0], this.position[1] );
	}

}


export class ViewRect extends ViewElement {
	public size:Position2D = [ 0, 0 ];
}
