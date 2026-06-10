import Engine from "../../engine.js";
import { MouseManager } from "../../mouse.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { ViewElement } from "../view-element.js";

export class ViewRect extends ViewElement {
	
	/**
	 * Set the dimensions of the rectangle
	 * 
	 * @param width		The width of the rectangle
	 * @param height	The height of the rectangle
	 */
	public setSize(width:number, height:number): this {

		// Update the size
		this.size = [ width, height ];

		return this;
	}

	protected override isMouseHovering(context: RenderingContext): boolean {

		// Get the inverse-transform of the context
		// Used to turn the mouse position from screen-space to "rectangle-space"
		let inverseTransform = context.getTransform().inverse();

		// Get the mouse position as a DOMPoint (screen-space)
		let mouseAsPoint:DOMPointInit = new DOMPoint(MouseManager.x, MouseManager.y);

		// Get the mouse in "rectangle-space"
		// Meaning that the mouse position is [0,0] when hovering
		// over the top-left corner
		let internalMousePoint = inverseTransform.transformPoint(mouseAsPoint);

		// Turn the mouse point into a Position2D array
		let internalMouse:Position2D = [ internalMousePoint.x, internalMousePoint.y ];

		// If the mouse is outside of the rectangle, return false
		if (internalMouse[0] < 0) return false;
		if (internalMouse[1] < 0) return false;
		if (internalMouse[0] > this.size[0]) return false;
		if (internalMouse[1] > this.size[1]) return false;

		// The mouse is inside the rectangle. Return true
		return true;

	}

	public override render(canvas: Canvas, context: RenderingContext): void {

		this.dispatchEvent("pre-render");

		// Save the context's transformations
		context.save();

		// Apply transformations and set fill/stroke styles
		this.setGeneralStyles(context);

		// Centre the rectangle
		context.translate(-this.size[0]/2, -this.size[1]/2);

		// Check for and dispatch events
		this.checkForUpdates(canvas, context);
		
		// Create a single rectangle path
		context.beginPath();
		context.rect(0, 0, this.size[0], this.size[1]);
		context.closePath();

		// Fill and outline the rectangle
		context.fill();
		context.stroke();

		// Restore the context's transformations
		context.restore();

		this.dispatchEvent("post-render");

	}
}
