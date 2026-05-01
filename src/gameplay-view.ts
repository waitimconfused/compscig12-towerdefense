import { View } from "./view.js";
import { Entity, EntityState } from "./entity/entity.js";
import { Sprite, SpriteRenderer } from "./sprites.js";
import { Canvas, RenderingContext } from "./types.js";

type EntitySpriteTable = { [state in EntityState]: string };
type EntitySpriteRuleset = { [entityType:string]: EntitySpriteTable };

const entityRenderingLookup:EntitySpriteRuleset = {
	"enemy/raccoon": {
		"idle": "raccoon-idling",
		"attack": "raccoon-attacking",
		"walk": "raccoon-walking",
		"dead": "sandwich-4"
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

			entity.tick();

			let spriteRuleset = entityRenderingLookup[entity.entityType];
			if (!spriteRuleset) continue;
			
			let reference = spriteRuleset[entity.state];

			SpriteRenderer.drawSprite({
				name: reference,
				position: [ 100, 100 ],
				size: [ 0, 0 ]
			}, context);

		}

		// Draw the gameplayCanvas UNDER the UI layer
		context.globalCompositeOperation = "destination-over";
		context.drawImage(this.gameplayCanvas, 0, 0);

	}

}