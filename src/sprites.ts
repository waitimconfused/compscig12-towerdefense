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
		 * 
		 * If not set, use `frame_duration`. If neither are set, the default is `100ms/frame`
		 */
		duration: number|null,

		/**
		 * Duration of each `SpriteData` frame, **on a per-frame basis**
		 * 
		 * Measured in *milliseconds*.
		 * 
		 * If not set, use `duration`. If neither are set, the default is `100ms/frame`. If both are set, the default is to use `duration`.
		 */
		frame_duration: number|null,

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
	 * Reference to `SpriteData.name`
	 */
	name: string;

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
	private static registeredSprites:{ [x:string]: SpriteData|undefined } = {};

	private static images:{[x:string]:HTMLImageElement|undefined} = {};

	constructor() {
		throw new TypeError("SpriteRenderer is not a constructor");
	}

	public static isRegistered(reference:string|number) {
		return reference in this.registeredSprites;
	}

	/**
	 * Register a `SpriteData` object that can be referenced
	 * when calling `sprite.drawSprite()`
	 * 
	 * @param data The `SpriteData` object to register as a sprite
	 */
	public static registerData(data:SpriteData) {

		// Create a console.log group
		console.groupCollapsed(`Creating sprite: "${data.name}"`);

		// If a sprite with the same name has already been
		// registered, log an error and stop
		if (data.name in this.registeredSprites) {
			console.error(`Cannot have multiple sprites of the same name "${data.name}".`);
			console.groupEnd();
			return;
		}
		
		// Convert all image-paths to images
		if (typeof data.source == "string") {
			let src:string = data.source;

			if (src in this.images == false) {
				this.images[src] = new Image;
				this.images[src].src = src;
				console.log(`Loading image from "${src}".`);
			} else {
				console.log(`Using preloaded image "${src}".`);
			}
			
			data.source = this.images[src] as HTMLImageElement;
		}
		
		else if (data.source.src in this.images == false) {
			this.images[data.source.src] = data.source;
		}

		// Convert all animation frame image-paths to images (if possible)
		if ( data?.animation != null ) {

			// If neither `duration` or `frame_duration` are set, send a warning
			if (!data.animation?.duration && !data.animation?.frame_duration) {
				// Send a warning to the console, with styling!
				console.warn(
					"Animation%c duration%c and%c frame_duration%c unset. Will default to%c 100ms/frame%c.",
					"font-style: italic; font-weight: bold",
					"",
					"font-style: italic; font-weight: bold",
					"",
					"font-style: italic; font-weight: bold",
					"",
				);

			// If both `duration` and `frame_duration` are set, send a warning
			} else if (data.animation?.duration && data.animation?.frame_duration) {
				// Send a warning to the console, with styling!
				console.warn(
					"Animation%c duration%c and%c frame_duration%c are both set. Will default to%c duration%c.",
					"font-style: italic; font-weight: bold",
					"",
					"font-style: italic; font-weight: bold",
					"",
					"font-style: italic; font-weight: bold",
					"",
				);
			}

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
				if ( frame?.source instanceof HTMLImageElement) {
					continue;
				}

				// Store the path to the source (frame.source will be replaced)
				let src:string = frame.source as string;

				if (src in this.images == false) {
					this.images[src] = new Image;
					this.images[src].src = src;
					console.log(`Loading image from "${src} for frame #${i+1}".`);
				} else {
					console.log(`Using preloaded image "${src}" for frame #${i+1}".`);
				}
				
				// Update the source to be an image
				frame.source = this.images[src] as HTMLImageElement;

				// Because `frame` is a **reference**, we don't need to
				// update anything in `data.animation.frames`

			}

		}

		// Add the data to the spriteData list
		this.registeredSprites[data.name] = data;

		// Close the console group
		console.log("Sprite has been registered.");
		console.groupEnd();


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
			
			let duration:number = 0;

			if (data.animation.duration) {
				duration = data.animation.duration;
			
			} else if (data.animation.frame_duration) {
				duration = data.animation.frame_duration * data.animation.frames.length;

			} else {
				duration = 100 * data.animation.frames.length;
			}

			// Calculate the speed of the animation
			let speed:number = duration / data.animation.frames.length;
			
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


import pathsToSpriteData from "../assets/sprites.json" with { type: "json" };

for (let i = 0; i < pathsToSpriteData.length; i ++) {
	let path:string = pathsToSpriteData[i] as string;

	// Make path relative to the ./assets/ folder
	path = new URL( path, window.location.href+"/assets/" ).href;

	import(path, { with: { type: "json" } })
	.then((spriteData:{default:SpriteData|SpriteData[]}) => {
		let imported = spriteData.default;
		
		if (Array.isArray(imported)) {
			
			for (let i = 0; i < imported.length; i ++) {
				let data = imported[i] as SpriteData;

				// Make the source relative to the current JSON file 
				data.source = new URL( data.source as string, path ).href

				SpriteRenderer.registerData( data );
			}

		}
		else {
			// Make the source relative to the current JSON file 
			imported.source = new URL( imported.source as string, path ).href
			SpriteRenderer.registerData( imported as SpriteData );
		}
	})
}