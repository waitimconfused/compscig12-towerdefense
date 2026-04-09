// Import the sprite-based functions/methods
import { sprite } from "./sprites.js";

// Get the canvas that will be drawn on, as well as
// it's 2D context. The context is what is actually
// used to draw onto the canvas
const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;


// Register a sprite with a name "example-sprite"
sprite.registerData({

	// The name of the sprite
	name: "example-sprite",

	// The path to the image that will be displayed
	source: "./assets/smile-spritesheet.png",

	// Describes where the image should be cropped ( x, y, width, height )
	// Because the sprite has an `animation`, it would be overwritten by each
	// frame, so it's left as `undefined`.
	//
	// If it is left as `undefined`, and there is no `animation`, the entire
	// image is drawn
	crop: undefined,

	// Where to put animation-related data/info
	// This is optional, not all sprites will have an animation
	animation: {

		// The duration of the entire animation (in ms)
		duration: 1000,

		// The (optional) time offset for the animation (in ms)
		// Not used, so it's left as `undefined`
		offset: undefined,

		// A list of frames for the sprite's animation
		frames: [
			// Composed of objects that have a source, and image crop data
			// 
			// If the source is `undefined`, the sprite's base source is used
			//
			// The crop property follows the same flow as the base crop
			// property. If `undefined`, it results in the entire image being drawn.
			// Unlike the source, it is *not* inherited from the base crop.
			{ source: undefined, crop: { x:0,   y:0, w:100, h:100 } },
			{ source: undefined, crop: { x:100, y:0, w:100, h:100 } },
			{ source: undefined, crop: { x:200, y:0, w:100, h:100 } },
			{ source: undefined, crop: { x:300, y:0, w:100, h:100 } }
		]
	}
});

/**
 * Main render loop
 * 
 * All rendering actions start inside here.
 */
function render() {

	// Update the canvas's width if it isn't the same as the windows
	if (canvas.width != window.innerWidth) {
		canvas.width = window.innerWidth;
	}

	// Update the canvas's height if it isn't the same as the windows
	if (canvas.height != window.innerHeight) {
		canvas.height = window.innerHeight;
	}

	// Clear the screen
	context.clearRect(
		// Position (x, y) of the rectangle to be cleared.
		// The top-left of the canvas is (0, 0)
		0, 0,
		
		// Size (width, height) of the rectangle to be cleared.
		// Clearing the entire canvas, so use the canvas's width and height
		canvas.width, canvas.height
	);

	// Draw a sprite with reference to "example-sprite" (declared above)	
	sprite.drawSprite(
		{
			name: "example-sprite",

			// Where on the canvas to draw the image [x, y]
			// Drawing it at the top-left, so [ 0, 0 ]
			position: [ 0, 0 ],

			// The size of the image [ width, height ]
			size: [ 100, 100 ]

		},

		// The `RenderingContext` to draw the image onto
		context
	);

	// When the document/window redraws the screen, call
	// the `render()` function
	window.requestAnimationFrame(render);
}

// Start the render loop
render();