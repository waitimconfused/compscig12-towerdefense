import { ViewElement } from "../view.js";
import Engine from "../../engine.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { MouseManager } from "../../mouse.js";

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
		this.setGeneralStyles(context);

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