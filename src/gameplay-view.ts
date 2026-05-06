import { View } from "./view.js";
import { Entity } from "./entity/entity.js";
import { SpriteRenderer } from "./sprites.js";
import { Canvas, Position2D, RenderingContext } from "./types.js";
import Engine from "./engine.js"

import spriteAssets from "../assets/sprites.json" with { type: "json" };

type SpriteStateMachine = {
	[ state: string ]: {

		/**
		 * The ID/reference to what sprite should be
		 * rendered.
		 */
		sprite: string,

		/**
		 * With the values in the range `0%`-`100%`, which
		 * corresponds to the percentage of where the
		 * image's origin should be put.
		 */
		origin:Position2D
	}
};

type SpriteRenderingRuleset = { [entityType:string]: SpriteStateMachine };

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

		for (let i = 0; i < Entity.entities.length; i ++) {
			let entity:Entity = Entity.entities[i] as Entity;

			let previousState = entity.state;

			entity.tick(Engine.stats.delta);

			let newState = entity.state;

			if (newState != previousState) entity.animationOffset = performance.now();

			let spriteRuleset = entityRenderingLookup[entity.entityType];
			if (!spriteRuleset) continue;
			
			let reference = spriteRuleset[entity.state];

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
			this.gameplayContext.scale(
				flipX ? -1 : 1,
				flipY ? -1 : 1
			);
			
			this.gameplayContext.drawImage(offscreenSprite, 0, 0);

			this.gameplayContext.restore();

		}

		// Draw the gameplayCanvas UNDER the UI layer
		context.globalCompositeOperation = "destination-over";
		context.drawImage(this.gameplayCanvas, 0, 0);

	}

}


type RawSpriteLogic = {

	/**
	 * Matches to `entity.entityType`
	 */
	type: string;

	states: SpriteStateMachine;
};

for (let i = 0; i < spriteAssets.logic.length; i ++) {

	let path:string = spriteAssets.logic[i] as string;

	// Make path relative to the ./assets/ folder
	path = new URL( path, location.origin+"/assets/" ).href;

	let module = await import(path, { with: { type: "json" } });

	let data:RawSpriteLogic = module.default;

	entityRenderingLookup[data.type] = data.states;

}