import Engine from "./engine.js";
import { SpriteRenderer } from "./sprites.js";
import { View, ViewCollection, ViewSprite, ViewText } from "./view.js";

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const engine = new Engine( canvas );

// Main Menu
(() => {

	var menuView = new View();
	engine.createView("main-menu", menuView);

	menuView.addElement(
		new ViewText("MAIN MENU")
	);

	SpriteRenderer.registerData({
		name: "example",
		source: "assets/smile-spritesheet.png",

		crop: undefined,

		animation: {
			duration: 1000,
			offset: undefined,
			frames: [
				{ source:undefined, crop:{x:0,y:0,w:100,h:100} },
				{ source:undefined, crop:{x:100,y:0,w:100,h:100} },
				{ source:undefined, crop:{x:200,y:0,w:100,h:100} },
				{ source:undefined, crop:{x:100,y:0,w:100,h:100} },
			]
		}
	})

	menuView.addElement(
		new ViewSprite("example")
		.setAnchor( Engine.anchor.centerCenter )
		.setOrigin(0.5, 0.5)
	);


})();

// Inventory View
(() => {

	var inventoryView = new ViewCollection;
	engine.createView("inventory", inventoryView);

	var stats = new View;
	inventoryView.createView("page-1", stats);

	stats.addElement(
		new ViewText("STATS")
		.moveTo( 100, 100 )
	);

	var stats = new View;
	inventoryView.createView("page-2", stats);

	stats.addElement(
		new ViewText("STATS")
		.moveTo( 100, 100 )
	);


})();