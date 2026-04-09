const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

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

	window.requestAnimationFrame(render);
}

// Start the render loop
render();