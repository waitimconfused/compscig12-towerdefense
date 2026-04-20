import Engine from "./engine.js";
import { SpriteData, SpriteRenderer } from "./sprites.js";
import { View, ViewCollection, ViewSprite, ViewText } from "./view.js";

import pathsToSpriteData from "../assets/sprites.json" with { type: "json" };

for (let i = 0; i < pathsToSpriteData.length; i ++) {
	let path:string = pathsToSpriteData[i] as string;
	path = path.replace(/^\.\//, "../assets/");

	import(path, {
		with: { type: "json" }
	})
	.then((spriteData:{default:SpriteData}) => {
		SpriteRenderer.registerData(spriteData.default);
	})
}

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

const engine = new Engine( canvas );

// Main Menu
(() => {

	var menuView = new View();
	engine.createView("main-menu", menuView);

	menuView.addElement(
		new ViewText("MAIN MENU")
	);

	menuView.addElement(
		new ViewSprite("defender/strawberry")
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