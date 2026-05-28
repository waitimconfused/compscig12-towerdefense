import { Canvas, RenderingContext } from "../types.js";
import { ViewElement } from "./view-element.js";

export class ViewElementCollection {

	/**
	 * List of `ViewElement` instances to be rendered
	 */
	public children:(ViewElement|ViewElementCollection)[] = [];

	/**
	 * Add `ViewElement`s to the collection, to will be rendered onscreen
	 * 
	 * @param elements	`ViewElement` instances to be added
	 */
	public addElement( ...elements:(ViewElement|ViewElementCollection)[] ):this {
		this.children.push(...elements);
		return this;
	}

	/**
	 * Remove a `ViewElement` from the collection
	 * @param element	`ViewElement` instance to be removed
	 */
	public removeElement( element?:ViewElement|ViewElementCollection ):this {

		if (!element) return this;
		
		let index = this.children.indexOf(element);

		this.children.splice(index, 1);

		return this;
	}

	/**
	 * Render the `ViewElement`s onto a provided canvas and context
	 * 
	 * @param canvas	Specifies what canvas the view will be rendered onto
	 * @param context	Specify what `RenderingContext` to use to draw
	 */
	public render( canvas:Canvas, context:RenderingContext ) {

		// Loop through each child ViewElement, and render it
		for (let i = 0; i < this.children.length; i ++) {

			// Get the ViewElement child
			let element:ViewElement = this.children[i] as ViewElement;

			// Render the child, given the canvas and context
			element.render(canvas, context);
		}

	}

}