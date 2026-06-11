import Engine from "./engine.js";
import Inventory from "./inventory.js";
import { MouseManager } from "./mouse.js";
import { SpriteRenderer } from "./sprites.js";
import { ViewText } from "./view/elements/text.js";
import viewFiles from "./view/files.json" with { type: "json" };



// Set which view to show once all the loading is done
const defaultView = "main-menu/start";

// Turn off comments
SpriteRenderer.verbose = false;

// Disable all the mouse events we don't want
MouseManager.preventContextMenu = true;
MouseManager.preventScroll = true;
MouseManager.preventZoom = true;

ViewText.addFont("Preahvihear", "/fonts/preahvihear.ttf");
ViewText.addFont("Gamja Flower", "/fonts/gamja-flower.ttf");

Inventory.load();

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

// Load all sprites (files listed in /assets/sprites.json -> .assets)
await SpriteRenderer.loadDefaults();


for (let i = 0; i < viewFiles.views.length; i ++) {
	
	// Get the current path to the file
	let path = viewFiles.views[i] as string;
	
	// Replace __.ts with __.js
	path = path.replace(/\.ts$/, ".js");
	
	// Turn the path into an absolute path
	let absolutePath = new URL( path, location.origin+"/dist/view/" ).pathname;
	
	console.info(`Importing view from "${absolutePath}".`);

	// Import the file
	// Even though it doesn't export anything, the code gets ran
	// This makes it so that the views each file creates get loaded
	await import(absolutePath);

	console.info(`Successfully imported view from "${absolutePath}".`);
	
}

// Show the default view
console.info(`Showing default view of "${defaultView}"`);
Engine.showView(defaultView);

// Initialize the Engine, using the defined canvas
console.info(`Initialing Engine via <canvas id="${canvas.id}">`);
Engine.initialize(canvas);

let loader:HTMLDivElement = document.getElementById("loading") as HTMLDivElement;
loader.remove();