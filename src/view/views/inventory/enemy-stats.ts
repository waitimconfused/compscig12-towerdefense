import Engine, { EngineAnchor } from "../../../engine.js";
import { EnemyEntity } from "../../../entity/enemy.js";
import { Entity } from "../../../entity/entity.js";
import { SpriteRenderer } from "../../../sprites.js";
import { Canvas, Position2D, RenderingContext } from "../../../types.js";
import { ViewSprite } from "../../elements/sprite.js";
import { ViewText } from "../../elements/text.js";
import { ViewElementCollection } from "../../view-element-collection.js";
import { ViewElement } from "../../view-element.js";
import { View } from "../../view.js";
import { book, button_close, tab_defenderStats, tab_enemyStats, tab_playerStats, tab_recipe } from "../inventory.js";

const view = new View;

view.addElement(book);
view.addElement(button_close);
view.addElement(tab_playerStats);
view.addElement(tab_defenderStats);
view.addElement(tab_enemyStats);
view.addElement(tab_recipe);

view.addElement(
	new ViewText("Enemy Stats")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setTranslation( -book.size[0]/2+100, -book.size[1]/2+100 )
	.setRotation(3, "deg")
	.setAlignment("left", "top")
	.setFont("Preahvihear", 65)
	.setStroke("none")
	.setFill("black")
);

view.addEventListener("show", () => {
	tab_enemyStats.reference = "tab-enemy-active";
});

view.addEventListener("hide", () => {
	tab_enemyStats.reference = "tab-enemy";
});

class Section extends ViewElementCollection {

	protected _anchor:EngineAnchor = Engine.anchorPresets.topLeft;
	protected _position:Position2D = [ 0, 0 ];

	/**
	 * The real position of the `ViewElement`.
	 * 
	 * Uses the set anchor to calculate
	 */
	public get position():Position2D&{ raw:Position2D, anchor:Position2D } {

		type PositionBundle = Position2D & { raw:Position2D, anchor:Position2D };

		// Get the real position of the anchor
		let anchorPosition:Position2D = Engine.resolveAnchor(this._anchor);

		// Calculate the real position of self (anchor + position)
		let totalPosition:PositionBundle = [
			anchorPosition[0] + this._position[0],
			anchorPosition[1] + this._position[1]
		] as PositionBundle;

		totalPosition.raw = [ this._position[0], this._position[1] ];
		totalPosition.anchor = [ anchorPosition[0], anchorPosition[1] ];

		return totalPosition;

	}

	/**
	 * Set the position of the `ViewElement`, relative to the set anchor
	 * 
	 * @param x	`X`-coordinate of offset to anchor
	 * @param y	`Y`-coordinate of offset to anchor
	 */
	public setTranslation(x:number, y:number):this {

		// Update the internal position
		this._position = [ x, y ];

		return this;
	}

	/**
	 * @param anchor	See `Engine.anchor`
	 * 					Defaults to `Engine.anchor.topLeft`
	 */
	public setAnchor(anchor?: EngineAnchor):this {

		// If there wasn't an anchor passed, set it to be the top-left of the screen
		if (!anchor) anchor = Engine.anchorPresets.topLeft;

		// If the anchor is not one of the Engine's anchors,
		// log an error and do not update the anchor
		if ( Object.values(Engine.anchorPresets).includes(anchor) == false ) {
			console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.resolver.toString()}".`);
			return this;
		}

		// Update the anchor
		this._anchor = anchor;

		return this;
	}

	public override render(canvas: Canvas, context: RenderingContext): void {
		
		context.save();
		context.translate(this.position[0], this.position[1]);

		SpriteRenderer.drawSprite({
			name: "paper",
			position: [ 0, 0 ],
			size: [ 0, 0 ]
		}, context);

		super.render(canvas, context);
		context.restore();

	}

}

const enemyCards = new ViewElementCollection;
view.addElement(enemyCards);

view.addEventListener("show", () => {

	while (enemyCards.children.length) enemyCards.removeElement( enemyCards.children[0] as ViewElement );

	let enemyTypes = [ ...Entity.derived.keys() ];

	let positions:Position2D[] = [
		[ -550, -200 ],
		[ -300, -200 ],
		[ -550, 50 ],
		[ -300, 50 ]
	];

	let positionIndex = 0;

	for (let i = 0; i < enemyTypes.length; i ++) {

		let type:string = enemyTypes[i] as string;

		let constructor = Entity.derived.get(type) as typeof Entity;

		if (constructor.prototype instanceof EnemyEntity == false) continue;

		let card = new Section;
		enemyCards.addElement(card);
		card.setAnchor( Engine.anchorPresets.centerCenter );
		
		let position:Position2D = positions[ positionIndex ] as Position2D;
		positionIndex += 1;
		positionIndex %= positions.length;
		
		card.setTranslation(position[0], position[1]);

		card.addElement(
			new ViewText(type)
			.setTranslation(219/2, 231 - 32)
			.setRotation(-2, "deg")
			.setFont("Gamja Flower", 40)
			.setAlignment("center", "bottom")
			.setFill("black")
			.setStroke("none")
		);

		card.addElement(
			new ViewSprite(type)
			.setTranslation(219/2, 231 - 32)
			.setRotation(-2, "deg")
		);

	}


});

export default view;