import Engine from "./engine.js";
import { View, ViewCollection, ViewText } from "./view.js";

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const engine = new Engine( canvas );

// Inventory View
(() => {

	var inventoryView = new ViewCollection;
	engine.createView("inventory", inventoryView);

	var stats = new View;
	inventoryView.createView("stats", stats);

	stats.addElement(
		new ViewText("Hello, world!")
		.moveTo( 100, 100 )
	);


})();