import Engine from "../../engine.js";
import { MouseManager } from "../../mouse.js";
import { SpriteRenderer } from "../../sprites.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import { ViewElement } from "../view-element.js";

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

		this.setGeneralStyles(context);

		let hasClickEvent = this.eventListeners.find(e=>e.type=="click") != undefined;
		let isHovering = this.isMouseHovering(context);

		if (hasClickEvent && isHovering) {

			Engine.cursor = "pointer";

			if (MouseManager.buttons.left) {
				this.dispatchEvent("click");
				MouseManager.buttons.left = false;
			}
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