import { Canvas, RenderingContext } from "../types.js";
import { View } from "./view.js";
import { ViewElement } from "./view-element.js";

export type ViewCallbackFunction = ( ()=>void );
export type ViewElementStroke = {
	colour: string | CanvasGradient | CanvasPattern,
	size: number,
	lineCap: "butt" | "round" | "square",
	lineJoin: "round" | "bevel" | "miter",
	dash: number[] | null,
	dashOffset:number
};

export class ViewCollection extends View {

	/**
	 * The current view that is being shown inside the collection.
	 * 
	 * This is the **key** inside `this.views`
	 * 
	 */
	private _currentView:string;

	/**
	 * The current view that is being shown inside the collection.
	 * 
	 * 
	 * *The view with this name does not necessarily get rendered onto the Engine.*
	 */
	public get currentView() { return this._currentView; }

	/**
	 * A map of name-view pairs
	 */
	private views:Map<string, View> = new Map<string, View>();

	/**
	 * ***`ViewElement` instances cannot be added to a `ViewCollection`.***
	 * @param element
	 */
	public override addElement(...element: ViewElement[]): this {

		// Log an error
		console.error(`"ViewElement" instances cannot be added to "ViewCollection".`);

		return this;
	}

	/**
	 * Attach a `View` to the collection
	 * 
	 * @param name	The name/identifier of the view (See `this.currentView`)
	 * @param view	The view instance to be rendered when visible (See `this.currentView`)
	 */
	public createView(name:string, view:View):this {

		// If there is already a view with the same name, throw an error
		if ( this.views.has(name) ) throw new Error(`Cannot create duplicate view of "${name}".`);

		// Set the name/view pair
		this.views.set(name, view);

		// If the currentView has not been set yet, show the newly-made view
		if (!this._currentView) this.showView(name);

		return this;

	}

	/**
	 * Show a view inside the collection
	 * 
	 * *The view with this name does not necessarily get rendered onto the Engine.*
	 * 
	 * @param name	The name of the view to be shown
	 * 
	 * @returns		The view that will be shown. `null` means
	 * 				that the view could not be found.
	 */
	public showView(name:string):View|null {

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
		if (this.views.has(viewName) == false) {

			// Log an error
			if (subViewNames) {
				console.error(`Cannot show unset view of "${name}". Could not resolve "${viewName}".`);

			} else {
				console.error(`Cannot show unset view of "${name}".`);
			}

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
	 * Render the view onto a provided canvas and context
	 * 
	 * @param canvas	Specifies what canvas the view will be rendered onto
	 * @param context	Specify what `RenderingContext` to use to draw
	 */
	public override render(canvas:Canvas, context:RenderingContext) {

		// If the current view does not exist, stop
		if (this.views.has(this._currentView) == false) return;

		// Get the current view
		let view:View = this.views.get(this._currentView) as View;

		// Render the view
		view.render( canvas, context );

	}

}