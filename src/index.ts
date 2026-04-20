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
		name: "strawberry",
		source: "assets/strawberry.png",

		crop: undefined,

		animation: {
			duration: 750,
			offset: undefined,
			frames: [
				{ source: undefined, crop:{ x:160*0,	y:0,	w:160,	h:204 } },
				{ source: undefined, crop:{ x:160*1,	y:0,	w:160,	h:204 } },
				{ source: undefined, crop:{ x:160*2,	y:0,	w:160,	h:204 } },
				{ source: undefined, crop:{ x:160*3,	y:0,	w:160,	h:204 } },
				{ source: undefined, crop:{ x:160*4,	y:0,	w:160,	h:204 } },
				{ source: undefined, crop:{ x:160*5,	y:0,	w:160,	h:204 } },
				{ source: undefined, crop:{ x:160*6,	y:0,	w:160,	h:204 } },
			]
		}
	})

	menuView.addElement(
		new ViewSprite("strawberry")
		.setAnchor( Engine.anchor.centerCenter )
		.setOrigin(0.5, 0.5)
		.setSize(160, 204)
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