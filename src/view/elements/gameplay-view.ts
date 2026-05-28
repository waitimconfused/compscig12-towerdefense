import { View } from "../view.js";
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

	constructor() {
		super();
		this.gameplayContext = this.gameplayCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
	}
		
	public override render( canvas:Canvas, context:RenderingContext ) {

		this.gameplayCanvas.width = canvas.width;
		this.gameplayCanvas.height = canvas.height;
		
		super.render(canvas, context);

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
		context.globalCompositeOperation = "destination-over";
		context.drawImage(this.gameplayCanvas, 0, 0);

		// Reset the composite operation to be the default ("source-over")
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