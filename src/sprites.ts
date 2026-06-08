/**
 *! Sprite Manager
 * The creation and rendering of sprites onto a `RenderingContext`
 */

// Get basic types for positioning (`Position2D`) and canvas
// contexts (`RenderingContext`) that can be rendered on
import { Position2D, RenderingContext, StaticClass } from "./types.js";

// Get the list of path to `SpriteData`-related files (JSON)
import spriteAssets from "../assets/sprites.json" with { type: "json" };

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
		duration: number|undefined,

		/**
		 * Duration of each `SpriteData` frame, **on a per-frame basis**
		 * 
		 * Measured in *milliseconds*.
		 * 
		 * If not set, use `duration`. If neither are set, the default is `100ms/frame`. If both are set, the default is to use `duration`.
		 */
		frame_duration: number|undefined,

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

	/**
	 * An *optional* **amount of milliseconds** to offset the animation
	 */
	animation_offset?: number;

	/**
	 * An *optional* list of frame indexes to use from an animation
	 */
	animation_frames?: number[]

};

type RenderableSpriteData = {
	image: HTMLImageElement;
	crop: {
		x: number,
		y: number,
		w: number,
		h: number
	}
}


export class SpriteRenderer extends StaticClass {

	public static verbose:boolean = true;

	/**
	 * An object to store a list of **registered** `SpriteData` objects.
	 */
	private static registeredSprites:{ [x:string]: SpriteData|undefined } = {};

	/**
	 * An object containing the source urls and images that have
	 * been registered using `SpriteRenderer.registerData()`.
	 */
	private static images:{[x:string]:HTMLImageElement|undefined} = {};

	/**
	 * Get whether or not a sprite has been registered, via a given name
	 * 
	 * @param reference	The string-name of the `SpriteData.name` value
	 * @returns			Whether or not the referenced sprite has been registered
	 */
	public static isRegistered(reference:string|number):boolean {
		// Return `true` if the key (`reference`) exists inside
		// the `registeredSprites` object `false` if not
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
		if (this.verbose) console.groupCollapsed(`Creating sprite: "${data.name}"`);

		// If a sprite with the same name has already been
		// registered, log an error and stop
		if (data.name in this.registeredSprites) {
			if (this.verbose) console.error(`Cannot have multiple sprites of the same name "${data.name}".`);
			if (this.verbose) console.groupEnd();
			return;
		}
		
		// Convert all image-paths to images
		if (typeof data.source == "string") {
			let src:string = data.source;

			if (src in this.images == false) {
				this.images[src] = new Image;
				this.images[src].src = src;
				if (this.verbose) console.log(`Loading image from "${src}".`);
			} else {
				if (this.verbose) console.log(`Using preloaded image "${src}".`);
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
				if (this.verbose) console.warn(
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
				if (this.verbose) console.warn(
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
				if ( frame?.source instanceof HTMLImageElement) continue;

				// Store the path to the source (frame.source will be replaced)
				let src:string = frame.source as string;

				if (src in this.images == false) {
					this.images[src] = new Image;
					this.images[src].src = src;
					if (this.verbose) console.log(`Loading image from "${src} for frame #${i+1}".`);
				} else {
					if (this.verbose) console.log(`Using preloaded image "${src}" for frame #${i+1}".`);
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
		if (this.verbose) console.log("Sprite has been registered.");
		if (this.verbose) console.groupEnd();


	}

	/**
	 * Get the realtime `HTMLImageElement` and crop-regions of a sprite
	 * 
	 * @param reference		The string-name of the `SpriteData.name` value
	 * 
	 * @param forced_time	The time used for determining the animation frame,
	 * 						measured in *milliseconds*.
	 * 
	 * @returns				A `RenderableSpriteData` object, or null (sprite
	 * 						does not exist, or fatal error)
	 */
	private static getData(reference:Sprite, forced_time?:number):RenderableSpriteData|null {

		// If the sprite could not be found, log it in the console as an
		// error, and return null.
		if (reference.name in this.registeredSprites == false) {
			console.error(`Failed to find SpriteData with name "${reference.name}".`);
			return null;
		}

		// Find the referenced `SpriteData` object from the list of `SpriteData` objects.
		// Safe to assume that it's a `SpriteData` object, as we checked above
		let data:SpriteData = this.registeredSprites[reference.name] as SpriteData;

		// If (for some reason) the `SpriteData.source` is **not** an
		// image, log it and return null.
		if ( data.source instanceof HTMLImageElement == false ) {
			console.error(`Sprite "${data.name}"'s source was loaded incorrectly.`);
			return null;
		}

		// Create a variable to store the `SpriteData` image.
		// Can be overwritten if an animation frame specifies a different source
		let image:HTMLImageElement = data.source as HTMLImageElement;

		// Store the `SpriteData` crop data, defaulting to show the entire
		// image. Can be overwritten if an animation frame specifies an
		// different crop region
		let crop = data?.crop ?? { x:0, y:0, w:image.width, h:image.height };

		// If the sprite has no animation, return the image and cropping
		// data, without applying any animation logic
		if (!data?.animation) return { image, crop };

		// Get the number of frames
		let frameCount = reference?.animation_frames?.length ?? data.animation.frames.length;

		// The duration of the entire animation
		let duration:number = (

			// Total animation duration
			data.animation?.duration

			// Convert frame durations to animation duration (fallback)
			|| (
				// Duration of each frame
				data.animation?.frame_duration
				// Fallback duration of each frame
				|| 100
			) * frameCount
		);

		// Calculate the speed of the animation
		let speed:number = duration / frameCount;
		
		// Store the animation offset, defaulting to 0ms
		let offset:number = data.animation?.offset ?? 0;
		offset += reference.animation_offset ?? 0;

		let currentTime = forced_time ?? performance.now();

		// Calculate what frame should be shown, based on the time,
		// animation offset, animation speed, and how many frames the
		// animation has
		let frameIndex = (currentTime - offset) / speed;
		frameIndex = Math.floor(frameIndex);
		frameIndex = frameIndex % frameCount;

		// Store a reference to the correct animation frame
		let frame = data.animation.frames[frameIndex];

		if (reference.animation_frames) {
			let realFrameIndex = reference.animation_frames[frameIndex] as number;
			frame = data.animation.frames[ realFrameIndex ];
		}

		// If the frame has a specific source (not inherited), set
		// used image to it.
		if (frame?.source) image = frame.source as HTMLImageElement;
		
		// Update the crop data, defaulting to show the entire
		// (possibly new) source image.
		crop = frame?.crop ?? { x:0, y:0, w:image.width, h:image.height };

		return { image, crop };
	}

	/**
	 * Draw a sprite (through referencing a registered `SpriteData` object) onto a specific `RenderingContext`.
	 * 
	 * @param reference	Determines the `SpriteData` to use, as well as
	 * 					the size of the `OffscreenCanvas`. (`ref.position` is ignored)
	 * 
	 * @param context	What `RenderingContext` the sprite should
	 * 					be rendered onto.
	 * 
	 * @param forced_time	The time used for determining the animation frame,
	 * 						measured in *milliseconds*.
	 */
	public static drawSprite(reference:Sprite, context:RenderingContext, forced_time?:number):void {

		// Get a `RenderableSpriteData` object
		let data = this.getData(reference, forced_time);

		// If the data cannot be rendered, don't do anything
		// if (!data) return;
		
		// Try rendering the image onto the canvas
		try {
			// Draw an image on the passed `RenderingContext`
			context.drawImage(

				// The image to be drawn
				data!.image,

				// The position/size of where to crop (inside the image)
				data!.crop.x, data!.crop.y,
				data!.crop.w, data!.crop.h,

				// The position/size of where to put the (cropped) image on the given canvas
				reference.position[0], reference.position[1],
				reference.size[0] || data!.crop.w, reference.size[1] || data!.crop.h
			);
		} catch (e) {
			// The image cannot be rendered.
			// Will show a black-white

			let halfWidth = (reference.size[0] || (data?.crop.w ?? 100))  / 2;
			let halfHeight = (reference.size[1] || (data?.crop.h ?? 100)) / 2;

			context.fillStyle = "#000000";
			context.fillRect(
				reference.position[0],
				reference.position[1],
				halfWidth,
				halfHeight
			);
			context.fillRect(
				reference.position[0] + halfWidth,
				reference.position[1] + halfHeight,
				halfWidth,
				halfHeight
			);

			context.fillStyle = "#FF00FF";
			context.fillRect(
				reference.position[0] + halfWidth,
				reference.position[1],
				halfWidth,
				halfHeight
			);
			context.fillRect(
				reference.position[0],
				reference.position[1] + halfHeight,
				halfWidth,
				halfHeight
			);
		}

	}

	/**
	 * Render the sprite onto an `OffscreenCanvas`
	 * 
	 * @param reference	Determines the `SpriteData` to use, as
	 * 					well as the size of the `OffscreenCanvas`.
	 * 					(`ref.position` is ignored)
	 * 
	 * @param forced_time	The time used for determining the animation frame,
	 * 						measured in *milliseconds*.
	 */
	public static getSpriteAsOffscreenCanvas(reference:Sprite, forced_time?:number):OffscreenCanvas {

		// Get a `RenderableSpriteData` object
		let data = this.getData(reference, forced_time);

		// If the referenced sprite does not exist, return the (empty) `OffscreenCanvas`
		// if (!data) return new OffscreenCanvas(reference.size[0], reference.size[1]);

		// Create a new OffscreenCanvas, as well as a 2D context for it.
		// The OffscreenCanvas is the same size a the `ref.size` values.
		let offscreenCanvas:OffscreenCanvas = new OffscreenCanvas( reference.size[0] || (data?.crop.w ?? 100), reference.size[1] || (data?.crop.h ?? 100) );
		let context:OffscreenCanvasRenderingContext2D = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

		// Try rendering the image onto the canvas
		try {
			// Draw an image on the passed `RenderingContext`
			context.drawImage(

				// The image to be drawn
				data!.image,

				// The position/size of where to crop (inside the image)
				data!.crop.x, data!.crop.y,
				data!.crop.w, data!.crop.h,

				// The position/size of where to put the (cropped) image on the given canvas
				reference.position[0], reference.position[1],
				reference.size[0] || data!.crop.w, reference.size[1] || data!.crop.h
			);
		} catch (e) {
			// The image cannot be rendered.
			// Will show a black-white

			let halfWidth = (reference.size[0] || (data?.crop.w ?? 100))/2;
			let halfHeight = (reference.size[1] || (data?.crop.h ?? 100))/2;

			context.fillStyle = "#000000";
			context.fillRect(
				reference.position[0],
				reference.position[1],
				halfWidth,
				halfHeight
			);
			context.fillRect(
				reference.position[0] + halfWidth,
				reference.position[1] + halfHeight,
				halfWidth,
				halfHeight
			);

			context.fillStyle = "#FF00FF";
			context.fillRect(
				reference.position[0] + halfWidth,
				reference.position[1],
				halfWidth,
				halfHeight
			);
			context.fillRect(
				reference.position[0],
				reference.position[1] + halfHeight,
				halfWidth,
				halfHeight
			);
		}

		// Return the OffscreenCanvas, which holds the drawn sprite image
		return offscreenCanvas;

	}

	/**
	 * Get a list of all registered `SpriteData` string-references (`SpriteData.name`)
	 * @returns A list of all sprite reference strings
	 */
	public static getAllSprites() {
		return Object.keys(this.registeredSprites);
	}

	/**
	 * Automatically register all `SpriteData` JSON files listed in `assets/sprites.json`
	 * @returns A list of `SpriteData.name` values
	 */
	public static async loadDefaults():Promise<string[]> {

		let references:string[] = [];

		// Loop through each path, and load the `SpriteData` object(s)
		for (let i = 0; i < spriteAssets.assets.length; i ++) {
			let path:string = spriteAssets.assets[i] as string;

			// Make path relative to the ./assets/ folder
			path = new URL( path, location.origin+"/assets/" ).href;

			// Import the JSON file, using promises
			let spriteData = await import(path, { with: { type: "json" } });
			
			// The data is stored as the default export (`.default`)
			let imported:SpriteData|SpriteData[] = spriteData?.default;

			// The JSON file can be a list of `SpriteData` objects
			if (Array.isArray(imported)) {
				
				// Loop through each `SpriteData` object, and register it.
				for (let i = 0; i < imported.length; i ++) {
					let data = imported[i] as SpriteData;

					// Make the source relative to the current JSON file 
					data.source = new URL( data.source as string, path ).href

					// Register the sprite
					SpriteRenderer.registerData( data );
					
					// Add the `SpriteData.name` to the list of registered sprites
					references.push(data.name);
				}

			// If the JSON file is only one `SpriteData` object, register it
			} else {
				// Make the source relative to the current JSON file 
				imported.source = new URL( imported.source as string, path ).href;

				// Register the sprite
				SpriteRenderer.registerData( imported as SpriteData );

				// Add the `SpriteData.name` to the list of registered sprites
				references.push(imported.name);
			}

		}

		return references;

	}

};