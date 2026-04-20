import Engine, { wait } from "./engine.js";
import { View, ViewCollection, ViewSprite, ViewText } from "./view.js";

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const engine = new Engine( canvas );

// Main Menu
(async () => {

	var menuView = new View();
	engine.createView("main-menu", menuView);

	menuView.addElement(
		new ViewText("MAIN MENU")
	);

	let strawberry = new ViewSprite("defender/strawberry:fly")
	strawberry.setAnchor( Engine.anchor.centerCenter );
	strawberry.setOrigin(0.5, 0.5);
	strawberry.setSize(160, 204);
	menuView.addElement(strawberry);

	await wait(1000);
	strawberry.setReference("defender/strawberry:idle");


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