/**
 *! Sprite Manager
 The creation and rendering of sprites onto a `RenderingContext`
 */

/**
 * Array of length 2, filled with numbers representing a 2D coordinate system.
 * 
 * EG: `[ 10, 45 ]` (x=`10`, y=`45`), or `[ 16, 32 ]` (width=`16`, height=`32`)
 */
interface Position2D extends Array<number> {
    length: 2;

	/**
	 * `Position2D[0]:number`: ***X**-coordinate*
	 */
    0: number;

	/**
	 * `Position2D[1]:number`: ***Y**-coordinate*
	 */
    1: number;

}


export type SpriteData = {
	name: string;
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
		 * Duration of the entire `SpriteData`'s animation, **not on a per-frame basis**.
		 * 
		 * Measured in *milliseconds*.
		 */
		duration: number,

		/**
		 * Time offset of animation.
		 */
		offset: number | undefined,

		frames: {
			
			/**
			 * If `undefined`, the source will be inherited from the `SpriteData.source`
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
	 * then (after being added to an Engine), it is set to the **index** of the `SpriteData`.
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

/**
 * The 2D contexts of types of *Canvases* that can be rendered on (`Canvas` and `OffscreenCanvas`)
 */
type RenderingContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;


/**
 * An array/list to store a list of **registered** `SpriteData` objects.
 */
var spriteData:SpriteData[] = [];

export const sprite = {


	/**
	 * @param data The `SpriteData` object to register as a sprite
	 */
	registerData(data:SpriteData) {
		
		// Convert all image-paths to images
		if (typeof data.source == "string") {
			let src = data.source;
			data.source = new Image;
			data.source.src = src;
		}

		// Convert all animation frame image-paths to images (if possible)
		if ( data?.animation != null ) {

			for (let i = 0; i < data.animation.frames.length; i ++) {

				let frame = data.animation.frames[i];

				if ( !frame?.source ) continue; // Source will be inherited
				if ( typeof frame?.source != "string") continue; // Source is already an image

				let src = frame.source;
				frame.source = new Image;
				frame.source.src = src;

				data.animation.frames[i] = frame;

			}

		}

		spriteData.push(data);

		console.log(`Registered SpriteData with name "${data.name}"`);


	},

	drawSprite(ref:Sprite, context:RenderingContext):void {

		let data:SpriteData|undefined = spriteData.find( (d) => d.name == ref.name );

		if (data == undefined) {
			console.error(`Failed to find SpriteData with name "${ref.name}".`);
			return;
		}

		if ( data.source instanceof HTMLImageElement == false ) {
			console.error(`Sprite "${data.name}"'s source was loaded incorrectly.`);
		}

		let image:HTMLImageElement = data.source as HTMLImageElement;

		// If the image has not been fully loaded,
		// don't even attempt to render it
		if (image.complete == false) return;

		let position = ref.position;
		let size = ref.size;
		let crop = data?.crop ?? { x:0, y:0, w:image.width, h:image.height };

		if (data?.animation) {
			let speed = data.animation.duration / data.animation.frames.length;
			let offset = data.animation?.offset ?? 0;
			
			let frameIndex = (performance.now() - offset) / speed;
			frameIndex = Math.floor(frameIndex);
			frameIndex = frameIndex % data.animation.frames.length;

			let frame = data.animation.frames[frameIndex];

			if (frame?.source) image = frame.source as HTMLImageElement;
			if (frame?.crop) crop = frame.crop;

		}
		
		context.drawImage(
			image,

			crop.x, crop.y,
			crop.w, crop.h,

			position[0], position[1],
			size[0], size[1]
		);

	},

	getSpriteAsOffscreenCanvas(ref:Sprite):OffscreenCanvas {
		
		let offscreenCanvas:OffscreenCanvas = new OffscreenCanvas( ref.size[0], ref.size[1] );
		let context:OffscreenCanvasRenderingContext2D = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

		// Save the reference position, and reference position it to (0,0).
		let position:Position2D = [ ref.position[0], ref.position[1] ];
		ref.position = [0, 0];

		this.drawSprite(ref, context);

		// Reset the reference position, to the saved value(s).
		ref.position = position;

		return offscreenCanvas;

	}

};
