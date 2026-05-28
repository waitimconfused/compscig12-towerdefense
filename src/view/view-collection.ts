import { Canvas, RenderingContext } from "../types.js";
import { View } from "./view.js";
import { ViewElement } from "./view-element.js";

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