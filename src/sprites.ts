/**
 *! Sprite Manager
 * The creation and rendering of sprites onto a `RenderingContext`
 */

import { Position2D, RenderingContext } from "./types.js";

/**
 * Used in `sprite.RegisterData()` to create a sprite that can be
 * referenced through `Sprite.name`.
 */
export type SpriteData = {

	/**
	 * The name of the sprite. The value of the string is how sprites
	 * reference the `SpriteData` object.
	 */
	name: string;

	/**
	 * When passing the `SpriteData` object to `sprite.registerData()`,
	 * if the property is a `string`, it is turned into an `HTMLImageElement`.
	 */
	source: HTMLImageElement | string;

	/**
	 * If `undefined`, the entire image will be drawn.
	 * 
	 * The `crop` property is **overwritten if the sprite has animations**, even
	 * if a frame does not have the `crop` property.
	 */
	crop: {
		x: number, y: number
		w: number, h: number
	} | undefined;

	animation: {

		/**
		 * Duration of the entire `SpriteData`'s animation, **not on a per-frame
		 * basis**.
		 * 
		 * Measured in *milliseconds*.
		 */
		duration: number,

		/**
		 * Time offset of animation.
		 * 
		 * Measured in *milliseconds*.
		 */
		offset: number | undefined,

		/**
		 * The list of frames that compose the `SpriteData`'s animation.
		 */
		frames: {
			
			/**
			 * If `undefined`, the source will be inherited from
			 * the `SpriteData.source`.
			 * 
			 * When passing the `SpriteData` object to `sprite.registerData()`,
			 * if the property is a `string`, it is turned into an `HTMLImageElement`.
			 */
			source: HTMLImageElement | string | undefined;

			/**
			 * If `undefined`, the entire image will be drawn.
			 * 
			 * The frame's `crop` property is **not inherited** from the
			 * main `SpriteData?.crop`.
			 */
			crop: {
				x:number, y:number
				w:number, h:number
			} | undefined
		}[]

	} | undefined;

};

export type Sprite = {

	/**
	 * Reference to `SpriteData.name`,
	 * then (after being added to an Engine), it is set to
	 * the **index** of the `SpriteData`.
	 */
	name: string | number;

	/**
	 * `Sprite.position[0]:number`: ***X**-coordinate*
	 * 
	 * `Sprite.position[1]:number`: ***Y**-coordinate*
	 */
	position: Position2D;

	/**
	 * `Sprite.size[0]:number`: ***Width** of drawn sprite*
	 * 
	 * `Sprite.size[1]:number`: ***Height** of drawn sprite*
	 */
	size: Position2D;

}


export class SpriteRenderer {

	/**
	 * An object to store a list of **registered** `SpriteData` objects.
	 */
	private static registeredSprites:{ [x:string]: SpriteData } = {};

	constructor() {
		throw new TypeError("SpriteRenderer is not a constructor");
	}


	/**
	 * Register a `SpriteData` object that can be referenced
	 * when calling `sprite.drawSprite()`
	 * 
	 * @param data The `SpriteData` object to register as a sprite
	 */
	public static registerData(data:SpriteData) {

		// If a sprite with the same name has already been
		// registered, log an error and stop
		if (data.name in this.registeredSprites) {
			console.error(`Cannot have multiple sprites of the same name "${data.name}".`);
			return;
		}
		
		// Convert all image-paths to images
		if (typeof data.source == "string") {
			let src = data.source;
			data.source = new Image;
			data.source.src = src;
		}

		// Convert all animation frame image-paths to images (if possible)
		if ( data?.animation != null ) {

			// Because the `Sprite` has an animation, loop through
			// each frame, and (conditionally) turn the sources into `HTMLImageElement`s 
			for (let i = 0; i < data.animation.frames.length; i ++) {

				// Get a **reference** to the current frame
				let frame = data.animation.frames[i];

				// If the frame's source has not been set, it will be inherited.
				// Continue onto the next frame
				if ( !frame?.source ) continue;
				
				// If the frame's source is already an image, continue onto the
				// next frame 
				if ( frame?.source instanceof HTMLImageElement) continue; 

				// Store the path to the source (frame.source will be replaced)
				let src = frame.source;

				// Set the frames source to an image, and the image's
				// source (src) to the path
				frame.source = new Image;
				frame.source.src = src;

				// Because `frame` is a **reference**, we don't need to
				// update anything in `data.animation.frames`

			}

		}

		// Add the data to the spriteData list
		this.registeredSprites[data.name] = data;

		// Log a message into the console
		console.log(`Registered SpriteData with name "${data.name}"`);


	}

	/**
	 * Draw a sprite (through referencing a registered `SpriteData` object) onto a specific `RenderingContext`.
	 * @param ref		Determines the `SpriteData` to use, as well as
	 * 					the size of the `OffscreenCanvas`. (`ref.position` is ignored)
	 * 
	 * @param context	What `RenderingContext` the sprite should
	 * 					be rendered onto.
	 */
	public static drawSprite(ref:Sprite, context:RenderingContext):void {

		// If the sprite could not be found, log it in the console as an error, and stop.
		if (ref.name in this.registeredSprites == false) {
			console.error(`Failed to find SpriteData with name "${ref.name}".`);
			return;
		}

		// Find the referenced `SpriteData` object from the list of `SpriteData` objects.
		// Safe to assume that it's a `SpriteData` object, as we checked above
		let data:SpriteData = this.registeredSprites[ref.name] as SpriteData;


		// If (for some reason) the `SpriteData.source` is **not** an image, log it and stop.
		if ( data.source instanceof HTMLImageElement == false ) {
			console.error(`Sprite "${data.name}"'s source was loaded incorrectly.`);
			return;
		}

		// Create a variable to store the `SpriteData` image.
		// Can be overwritten if an animation frame specifies a different source
		let image:HTMLImageElement = data.source as HTMLImageElement;

		// If the image has not been fully loaded,
		// don't even attempt to render it
		if (image.complete == false) return;

		// Store the `SpriteData` crop data, defaulting to show the entire image
		// Can be overwritten if an animation frame specifies an different crop region
		let crop = data?.crop ?? { x:0, y:0, w:image.width, h:image.height };

		// If the sprite has an animation
		if (data?.animation) {
			
			// Calculate the speed of the animation
			let speed:number = data.animation.duration / data.animation.frames.length;
			
			// Store the animation offset, defaulting to 0ms
			let offset:number = data.animation?.offset ?? 0;
			
			// Calculate what frame should be shown, based on the time,
			// animation offset, animation speed, and how many frames the
			// animation has
			let frameIndex = (performance.now() - offset) / speed;
			frameIndex = Math.floor(frameIndex);
			frameIndex = frameIndex % data.animation.frames.length;

			// Store a reference to the correct animation frame
			let frame = data.animation.frames[frameIndex];

			// If the frame has a specific source (not inherited), set used image to it.
			if (frame?.source) image = frame.source as HTMLImageElement;
			
			// Update the crop data, defaulting to show the entire (possibly new) source image.
			crop = frame?.crop ?? { x:0, y:0, w:image.width, h:image.height };

		}
		
		// Draw an image on the passed `RenderingContext`
		context.drawImage(

			// The image to be drawn
			image,

			// The position/size of where to crop (inside the image)
			crop.x, crop.y,
			crop.w, crop.h,

			// The position/size of where to put the (cropped) image on the given canvas
			ref.position[0], ref.position[1],
			ref.size[0], ref.size[1]
		);

	}

	/**
	 * Render the sprite onto an `OffscreenCanvas`
	 * @param ref	Determines the `SpriteData` to use, as well as the size of the `OffscreenCanvas`. (`ref.position` is ignored)
	 */
	public static getSpriteAsOffscreenCanvas(ref:Sprite):OffscreenCanvas {
		
		// Create a new OffscreenCanvas, as well as a 2D context for it.
		// The OffscreenCanvas is the same size a the `ref.size` values.
		let offscreenCanvas:OffscreenCanvas = new OffscreenCanvas( ref.size[0], ref.size[1] );
		let context:OffscreenCanvasRenderingContext2D = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

		// Save the reference position, and reference position it to (0,0).
		let position:Position2D = [ ref.position[0], ref.position[1] ];
		ref.position = [0, 0];

		// Draw the referenced sprite (at [0,0]) onto the OffscreenCanvas's context
		this.drawSprite(ref, context);

		// Reset the reference position, to the saved value(s).
		ref.position = position;

		// Return the OffscreenCanvas, which holds the drawn sprite image
		return offscreenCanvas;

	}

};
