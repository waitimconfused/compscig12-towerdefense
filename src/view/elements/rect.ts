import Engine from "../../engine.js";
import { MouseManager } from "../../mouse.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { ViewElement } from "../view.js";

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
		this.setGeneralStyles(context);

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
