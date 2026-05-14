import Engine from "./engine.js";
import GameplayView from "./gameplay-view.js";
import { MouseManager } from "./mouse.js";
import { SpriteRenderer } from "./sprites.js";
import { View, ViewCollection, ViewSprite, ViewText } from "./view.js";
import { Raccoon } from "./entity/enemy.types/raccoon.js";
import { Strawberry } from "./entity/defender.types/strawberry.js";
import { Entity } from "./entity/entity.js";
import { Sandwich } from "./entity/defender.types/sandwich.js";
import { Banana, BananaSpawner } from "./entity/defender.types/banana.js";
import { Frog } from "./entity/enemy.types/frog.js";
import { Ant } from "./entity/enemy.types/ant.js";

SpriteRenderer.verbose = false;
SpriteRenderer.loadDefaults();

MouseManager.preventContextMenu = true;
MouseManager.preventScroll = true;
MouseManager.preventZoom = true;

const canvas:HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

Engine.initialize(canvas);

// Main Menu
(async () => {

	var menuView = new View();
	Engine.createView("main-menu", menuView);

	let title = new ViewText("Tower Defense");
	title.alignment.x = "start";
	title.alignment.y = "top";
	title.setAnchor( Engine.anchor.centerCenter );
	title.stroke.colour = "none";
	title.stroke.size = 0;
	menuView.addElement(title);


	let playButton = new ViewText("Play");
	playButton.setClickEvent(() => {
		Engine.showView("gameplay");
	});
	playButton.setAnchor( Engine.anchor.bottomCenter );
	playButton.alignment.x = "center";
	playButton.alignment.y = "bottom";
	menuView.addElement(playButton);

	let asset = new ViewSprite("sandwich-3");
	menuView.addElement(asset);
	asset.setAnchor( Engine.anchor.centerCenter );
	asset.setSize(291, 224);

	// await wait(1000);
	// strawberry.setReference("defender/strawberry:idle");


})();

// Inventory View
(() => {

	var inventoryView = new ViewCollection;
	Engine.createView("inventory", inventoryView);

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

// Gameplay View
(() => {

	var gameplayView = new GameplayView;
	Engine.createView("gameplay", gameplayView);

	let stopButton = new ViewText("<");
	gameplayView.addElement(stopButton);

	stopButton.setClickEvent(() => {
		Engine.showView("main-menu");
	});

	gameplayView.addEventListener("show", () => {
		Raccoon.spawn(1, [ window.innerWidth/2,window.innerHeight/2 ]);
		Sandwich.spawn(1, [ window.innerWidth/2,window.innerHeight/2 ]);
	});

	// Strawberry.spawn(3, [ 100, 100 ], 100);
	// Raccoon.spawn(1, [ 100, 100 ], 100);
	// Sandwich.spawn(1, [ window.innerWidth/2, window.innerHeight/2 ]);

})();
