import { View, ViewBackground } from "../view.js";
import { Entity } from "../../entity/entity.js";
import { SpriteRenderer } from "../../sprites.js";
import { Canvas, Position2D, RenderingContext } from "../../types.js";
import Engine from "../../engine.js"

import spriteAssets from "../../../assets/sprites.json" with { type: "json" };
import { BasicSprite, RawSpriteLogic, rulesToFunction } from "../../entity/logic-flow.js";
import { Strawberry } from "../../entity/defender.types/strawberry.js";

type SpriteRenderingRuleset = { [entityType:string]: (entity:Entity)=>BasicSprite[] };

// To be filled in later in the code
var entityRenderingLookup:SpriteRenderingRuleset = {};

export default class GameplayView extends View {

	private gameplayCanvas:OffscreenCanvas = new OffscreenCanvas(1920, 1080);
	private gameplayContext:OffscreenCanvasRenderingContext2D;

	public static playSpaceWidth:number = 1000;
	public static playSpaceHeight:number = 750;

	public gameplayBackground:ViewBackground = {
		source: null,
		repetition: "repeat",
		scale: [1, 1]
	};

	private _gameplayPattern:CanvasPattern | null = null;

	constructor() {
		super();
		this.gameplayContext = this.gameplayCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
	}
		
	public override render( canvas:Canvas, context:RenderingContext ) {

		this.gameplayCanvas.width = GameplayView.playSpaceWidth;
		this.gameplayCanvas.height = GameplayView.playSpaceHeight;
		
		// If the background is a CSS colour string
		if (typeof this.gameplayBackground.source == "string") {
			// Set the context's fillStyle
			this.gameplayContext.fillStyle = this.gameplayBackground.source;
			
			// Make sure no "canvas pattern" has been set
			this._gameplayPattern = null;
			
			// Fill the background rectangle (covering the canvas)
			this.gameplayContext.fillRect(0, 0, this.gameplayCanvas.width, this.gameplayCanvas.height);

		// If the background is an image
		} else if (this.gameplayBackground.source instanceof HTMLImageElement) {

			// If a pattern has not been created, make one
			if (!this._gameplayPattern) {
				// Create a CanvasPattern, using the image and repetition mode
				this._gameplayPattern = this.gameplayContext.createPattern(
					this.gameplayBackground.source as HTMLImageElement,
					this.gameplayBackground.repetition
				);

				// Create a Matrix Transform, for the pattern
				let transform = new DOMMatrix;

				// Scale the transform
				transform = transform.scale(this.gameplayBackground.scale[0], this.gameplayBackground.scale[1]);

				// Set the pattern's transform to be the transform we just created
				this._gameplayPattern?.setTransform(transform);
			}

			// Set the fillStyle to be the pattern
			this.gameplayContext.fillStyle = this._gameplayPattern as CanvasPattern;

			// Fill the background rectangle (covering the canvas)
			this.gameplayContext.fillRect(0, 0, this.gameplayCanvas.width, this.gameplayCanvas.height);

		}
		

		let entities = [ ...Entity.entities.values() ];
		// console.log(entities);

		// Sort the entities to be back-to front
		// Enemies closer to the top will be rendered
		// behind ones closer to the bottom of the screen
		// More info: [JavaScript Array.prototype.sort method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description)
		entities.sort((entity1, entity2) => {
			// POSITIVE: entity1 before entity2
			// NEGATIVE: entity2 before entity1
			// ZERO/NAN: no changes
			return entity1.position[1] - entity2.position[1];
		});


		for (let i = 0; i < entities.length; i ++) {
			let entity:Entity = entities[i] as Entity;

			let previousState = entity.state;

			entity.tick(Engine.stats.delta);

			let newState = entity.state;
			
			if (newState != previousState) entity.animationOffset = performance.now();

			let spriteRuleset = entityRenderingLookup[entity.entityType];
			if (!spriteRuleset) continue;

			let layers = spriteRuleset(entity);

			if (!layers) continue;

			for (let i = 0; i < layers.length; i ++) {
				let reference = layers[i];

				if (!reference) continue;

				let offscreenSprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
					name: reference.sprite,
					position: [ 0, 0 ],
					size: [ 0, 0 ],
					animation_offset: entity.animationOffset
				});

				let flipX = entity.direction > Math.PI / 2;
				let flipY = false;

				this.gameplayContext.save();
				this.gameplayContext.translate( entity.position[0], entity.position[1] );
				this.gameplayContext.translate(
					( reference.origin[0] / 100) * offscreenSprite.width * (flipX ? 1 : -1),
					( reference.origin[1] / -100) * offscreenSprite.height
				);
				if (reference?.offset) this.gameplayContext.translate(
					reference.offset[0],
					reference.offset[1]
				);
				this.gameplayContext.scale(
					flipX ? -1 : 1,
					flipY ? -1 : 1
				);
				
				this.gameplayContext.drawImage(offscreenSprite, 0, 0);

				this.gameplayContext.restore();
			}

		}

		// Draw the gameplayCanvas UNDER the UI layer
		// context.globalCompositeOperation = "destination-over";

		let appropriateScale = Math.min(
			canvas.height / (GameplayView.playSpaceHeight + 100),
			canvas.width / (GameplayView.playSpaceWidth + 100)
		);

		// appropriateScale = 2;

		context.save();
		context.translate(canvas.width/2, canvas.height/2);
		context.scale(appropriateScale, appropriateScale);
		context.translate(-GameplayView.playSpaceWidth/2, -GameplayView.playSpaceHeight/2);
		
		context.globalCompositeOperation = "source-over";
		context.drawImage(this.gameplayCanvas, 0, 0);

		context.globalCompositeOperation = "destination-in";
		context.beginPath();
		context.fillStyle = "black";
		context.roundRect(0, 0, GameplayView.playSpaceWidth, GameplayView.playSpaceHeight, 8);
		context.closePath();
		context.fill();
		
		context.globalCompositeOperation = "destination-over";
		context.beginPath();
		context.shadowColor = "#0000000F";
		context.shadowBlur = 10;
		context.shadowOffsetY = 4;
		context.roundRect(0, 0, GameplayView.playSpaceWidth, GameplayView.playSpaceHeight, 8);
		context.closePath();
		context.fill();

		context.restore();

		super.render(canvas, context, false, true);

		context.globalCompositeOperation = "destination-over";
		super.render(canvas, context, true, false);
		context.globalCompositeOperation = "source-over";

	}

}



for (let i = 0; i < spriteAssets.logic.length; i ++) {

	let path:string = spriteAssets.logic[i] as string;

	// Make path relative to the ./assets/ folder
	path = new URL( path, location.origin+"/assets/" ).href;

	let module = await import(path, { with: { type: "json" } });

	let data:RawSpriteLogic = module.default;

	let generatedRule = rulesToFunction(data.logic);

	entityRenderingLookup[data.type] = generatedRule;
}