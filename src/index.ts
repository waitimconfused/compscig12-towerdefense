import Engine from "./engine.js";
import { MouseManager } from "./mouse.js";
import { SpriteRenderer } from "./sprites.js";
import viewFiles from "./view/files.json" with { type: "json" };



// Set which view to show once all the loading is done
const defaultView = "main-menu";

// Turn off comments
SpriteRenderer.verbose = false;

// Disable all the mouse events we don't want
MouseManager.preventContextMenu = true;
MouseManager.preventScroll = true;
MouseManager.preventZoom = true;



// Get a reference to the canvas we are going to render onto
const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

// Load all sprites (files listed in /assets/sprites.json -> .assets)
SpriteRenderer.loadDefaults();

// Initialize the Engine, using the defined canvas
Engine.initialize(canvas);

for (let i = 0; i < viewFiles.views.length; i ++) {

	// Get the current path to the file
	let path = viewFiles.views[i] as string;

	// Replace __.ts with __.js
	path = path.replace(/\.ts$/, ".js");

	// Turn the path into an absolute path
	let absolutePath = new URL( path, location.origin+"/dist/view/" ).pathname;
	
	// Import the file
	// Even though it doesn't export anything, the code gets ran
	// This makes it so that the views each file creates get loaded
	await import(absolutePath);

}

// Show the default view
Engine.showView(defaultView);