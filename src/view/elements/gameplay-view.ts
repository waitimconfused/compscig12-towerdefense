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


	/**
	 * The width and height of where entities should be positioned
	 * 
	 * Also used with rendering the gameplay-background
	 */
	public static playSpaceSize:Position2D = [1000, 750];

	/**
	 * The amount of padding around the gameplay content & background
	 * 
	 * Used to calculate the scale of the content
	 */
	public static playSpacePadding:Position2D = [100, 100];

	/**
	 * Specify what background should be shown to visually represent the play-space
	 */
	public gameplayBackground:ViewBackground = {
		source: null,
		repetition: "repeat",
		scale: [1, 1]
	};

	/**
	 * The generated `CanvasPattern` to be used for `context.fillStyle`.
	 * 
	 * If `this.gameplayBackground.source` is not an image, it will be `null`.
	 */
	private _gameplayPattern:CanvasPattern | null = null;

	constructor() {
		super();
	}
		
	public override render( canvas:Canvas, context:RenderingContext ) {
		
		// Determine what scale the entities (and background) should be displayed as
		// Figure out by finding the smallest horizontal and vertical ratios (with padding)
		let appropriateScale = Math.min(
			canvas.width / (GameplayView.playSpaceSize[0] + GameplayView.playSpacePadding[0]),
			canvas.height / (GameplayView.playSpaceSize[1] + GameplayView.playSpacePadding[1])
		);
		
		// Save the canvas transforms
		context.save();

		// Move the transform to be the centre of the screen
		context.translate(canvas.width/2, canvas.height/2);

		// Apply the calculated scale
		context.scale(appropriateScale, appropriateScale);

		// Move where the entities and gameplayBackground will be rendered
		context.translate(-GameplayView.playSpaceSize[0]/2, -GameplayView.playSpaceSize[1]/2);
		
		// Draw a rounded rectangle with a shadow
		context.beginPath();
		context.shadowColor = "#0000000F";
		context.shadowBlur = 10;
		context.shadowOffsetY = 4;
		context.roundRect(0, 0, GameplayView.playSpaceSize[0], GameplayView.playSpaceSize[1], 8);
		context.closePath();
		context.fill();

		// Draw the gameplay background
		this.renderGameplayBackground(canvas, context);

		// Draw the entities
		this.renderEntities(canvas, context);
		
		// Reset the context's transformation
		context.restore();

		// Render the ViewElement children
		super.render(canvas, context, false, true);

		// Render the view background BEHIND all the rendered content
		context.globalCompositeOperation = "destination-over"; // New content goes BEHIND old
		super.render(canvas, context, true, false);
		context.globalCompositeOperation = "source-over"; // New content goes IN FRONT of old

	}

	/**
	 * Render the gameplay background onto the canvas (at `[ 0, 0 ]`),
	 * with a size of `GameplayView.playSpaceSize
	 * `
	 * @param canvas	Canvas to be rendered onto
	 * @param context	The `RenderingContext` of the canvas
	 */
	protected renderGameplayBackground(canvas:Canvas, context:RenderingContext) {

		// If the gameplayBackground has no value, do not attempt to render anything
		if (!this.gameplayBackground.source) return;

		// Get the source of the background
		let source:string|HTMLImageElement = this.gameplayBackground.source;

		// If the source is a colour (string)
		// Make sure the pattern is unset
		if (typeof source == "string") {
			this._gameplayPattern = null;
		}

		// If the source is an image, and the pattern has not made
		if (source instanceof HTMLImageElement && !this._gameplayPattern) {

			// Create a CanvasPattern, using the image and repetition mode
			this._gameplayPattern = context.createPattern(
				this.gameplayBackground.source as HTMLImageElement,
				this.gameplayBackground.repetition
			);

			// Create a Matrix Transform, for the pattern
			// This is used to apply transformations to the pattern (scale/translation/rotation)
			let transform = new DOMMatrix;

			// Scale the transform
			transform = transform.scale(this.gameplayBackground.scale[0], this.gameplayBackground.scale[1]);

			// Set the pattern's transform to be the transform we just created
			this._gameplayPattern!.setTransform(transform);
		}

		// Set the fillStyle to be the CanvasPattern or the source
		// The source will be a colour (string) if the CanvasPattern is non-existent
		context.fillStyle = this._gameplayPattern ?? (source as string);

		// Fill a rectangle with the fillStyle with the playSpaceSize dimensions
		context.fillRect(0, 0, GameplayView.playSpaceSize[0], GameplayView.playSpaceSize[1]);

	}

	/**
	 * Update and update all entities onto the screen
	 * `
	 * @param canvas	Canvas to be rendered onto
	 * @param context	The `RenderingContext` of the canvas
	 */
	protected renderEntities( canvas:Canvas, context:RenderingContext ) {

		// Get a list of entities to render
		let entities = [ ...Entity.entities.values() ];

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


		// Loop through each entity, updating it and rendering
		for (let i = 0; i < entities.length; i ++) {

			// Get the current entity
			let entity:Entity = entities[i] as Entity;

			// Take note of which state the entity is in before updating it
			// Used to reset animation states if a change has been detected
			let previousState = entity.state;

			// Update the entity
			entity.tick(Engine.stats.delta);

			// Take note of which state the entity is in after updating it
			let newState = entity.state;
			
			// If there has been a change in state, reset the sprite's animation offset
			if (newState != previousState) entity.animationOffset = performance.now();

			// Render the entity onto the canvas
			this.renderEntity(entity, canvas, context);

		}
	}

	/**
	 * Render an `Entity` instance onto a canvas
	 * 
	 * @param entity	The `Entity` instance to be rendered
	 * @param canvas	Canvas to be rendered onto
	 * @param context	The `RenderingContext` of the canvas
	 */
	protected renderEntity(entity:Entity, canvas:Canvas, context:RenderingContext) {

		// Retrieve the entity sprite display logic function
		let spriteRuleset = entityRenderingLookup[entity.entityType];

		// If the display logic function does not exist, don't render
		if (!spriteRuleset) return;

		// Get a list of sprites along with their positions and origins
		let layers = spriteRuleset(entity);
		
		// If there weren't any layers provided, don't render
		if (!layers) return;

		// Loop through each layer, and render it
		for (let i = 0; i < layers.length; i ++) {

			// Get the layer data
			let reference = layers[i];

			// If there isn't a reference, don't render the layer
			if (!reference) continue;

			// Render the reference onto an OffscreenCanvas
			let offscreenSprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
				name: reference.sprite,
				position: [ 0, 0 ],
				size: [ 0, 0 ],
				animation_offset: entity.animationOffset
			});

			// Decide wether or not to visually flip the
			// entity horizontally or vertically
			let flipX = entity.direction > Math.PI / 2;
			let flipY = false;

			// Save the context's transformations
			context.save();

			// Move the context to the entities positio 
			context.translate( entity.position[0], entity.position[1] );

			// Move the context to be the origin of the sprite
			context.translate(
				( reference.origin[0] / 100) * offscreenSprite.width * (flipX ? 1 : -1),
				( reference.origin[1] / -100) * offscreenSprite.height
			);

			// If there is an offset applied, apply it
			if (reference?.offset) context.translate(
				reference.offset[0],
				reference.offset[1]
			);

			// Flip the context horizontally or vertically
			context.scale(
				flipX ? -1 : 1,
				flipY ? -1 : 1
			);
			
			// Draw the OffscreenCanvas onto the canvas
			context.drawImage(offscreenSprite, 0, 0);

			// Restore the canvas's transformation
			context.restore();
		}
	}

}


// Loop through each logic file path, and turn it into a display-logic function
for (let i = 0; i < spriteAssets.logic.length; i ++) {

	// Get the current file path
	let path:string = spriteAssets.logic[i] as string;

	// Make path relative to the ./assets/ folder
	path = new URL( path, location.origin+"/assets/" ).href;

	// Import the JSON file
	let {default: data} = await import(path, { with: { type: "json" } });

	// Generate the display-logic function
	let generatedRule = rulesToFunction(data);

	// Save the function to the lookup
	entityRenderingLookup[data.type] = generatedRule;
}