import Engine from "./engine.js";
import Inventory from "./inventory.js";
import { MouseManager } from "./mouse.js";
import { SpriteRenderer } from "./sprites.js";
import viewFiles from "./view/files.json" with { type: "json" };

SpriteRenderer.verbose = false;
SpriteRenderer.loadDefaults();

MouseManager.preventContextMenu = true;
MouseManager.preventScroll = true;
MouseManager.preventZoom = true;

Inventory.load();

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

Engine.initialize(canvas);

for (let i = 0; i < viewFiles.files.length; i ++) {

	// Get the current path to the file
	let path = viewFiles.files[i] as string;

	// Replace __.ts with __.js
	path = path.replace(/\.ts$/, ".js");

	// Turn the path into an absolute path
	let absolutePath = new URL( path, location.origin+"/dist/view/" ).pathname;
	
	// Import the file
	// Even though it doesn't export anything, the code gets ran
	// This makes it so that the views each file creates get loaded
	await import(absolutePath);

}

// Show the main-menu view
Engine.showView("main-menu");