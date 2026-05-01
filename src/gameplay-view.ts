import { View } from "./view.js";
import { Entity, EntityState } from "./entity/entity.js";
import { SpriteRenderer } from "./sprites.js";
import { Canvas, Position2D, RenderingContext } from "./types.js";
import Engine from "./engine.js";

type EntitySpriteTable = { [state in EntityState]: { sprite:string, origin:Position2D } };
type EntitySpriteRuleset = { [entityType:string]: EntitySpriteTable };

const entityRenderingLookup:EntitySpriteRuleset = {
	"enemy/raccoon": {
		"idle": {
			sprite: "raccoon-idling",
			origin: [ 50, 50 ]
		},
		"attack": {
			sprite: "raccoon-attacking",
			origin: [ 50, 50 ]
		},
		"walk": {
			sprite: "raccoon-walking",
			origin: [ 50, 50 ]
		},
		"dead": {
			sprite: "sandwich-4",
			origin: [ 0, 0 ]
		}
	}
}

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

			entity.tick(Engine.stats.delta);

			let spriteRuleset = entityRenderingLookup[entity.entityType];
			if (!spriteRuleset) continue;
			
			let reference = spriteRuleset[entity.state];

			let offscreenSprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
				name: reference.sprite,
				position: [ 0, 0 ],
				size: [ 0, 0 ]
			});

			let flipX = entity.direction > Math.PI / 2;
			let flipY = false;

			context.save();
			context.translate( entity.position[0], entity.position[1] );
			context.translate(
				( reference.origin[0] / 100) * offscreenSprite.width * (flipX ? 1 : -1),
				( reference.origin[1] / -100) * offscreenSprite.height
			);
			context.scale(
				flipX ? -1 : 1,
				flipY ? -1 : 1
			);
			
			context.drawImage(offscreenSprite, 0, 0);

			context.restore();

		}

		// Draw the gameplayCanvas UNDER the UI layer
		context.globalCompositeOperation = "destination-over";
		context.drawImage(this.gameplayCanvas, 0, 0);

	}

}