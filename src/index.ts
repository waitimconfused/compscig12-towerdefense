import { sprite } from "./sprites.js";

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

sprite.registerData({
	name: "example-sprite",
	source: "./assets/smile-spritesheet.png",

	crop: undefined,

	animation: {
		duration: 1000,
		offset: 0,

		frames: [
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
 * All rendering actions ***start** inside here.
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
	context.clearRect(0, 0, canvas.width, canvas.height);


	sprite.drawSprite({
		name: "example-sprite",

		position: [ 0, 0 ],

		size: [ 100, 100 ]
	}, context);


	window.requestAnimationFrame(render);
}

// Start the render loop
render();