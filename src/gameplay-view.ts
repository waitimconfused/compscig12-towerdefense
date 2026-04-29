import { View } from "./view.js";
import { Entity } from "./entity.js";
import { Sprite, SpriteRenderer } from "./sprites.js";
import { Canvas, RenderingContext } from "./types.js";

export default class GameplayView extends View {

	private gameplayElements:(Entity|Sprite)[] = [];
		
	public addGameplayElement( ...elements:(Entity|Sprite)[] ):this {
		this.gameplayElements.push(...elements);
		return this;
	}
	
	public override render( canvas:Canvas, context:RenderingContext ) {

		for (let i = 0; i < this.gameplayElements.length; i ++) {
			let element:Entity|Sprite = this.gameplayElements[i] as Entity|Sprite;

			if (element instanceof Entity) {
				element.render(canvas, context);
			
			} else {
				SpriteRenderer.drawSprite(element, context);
			}
			
		}

		super.render(canvas, context);

	}

}