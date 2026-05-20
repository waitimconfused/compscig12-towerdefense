import GameplayView from "../gameplay-view.js";
import { View, ViewCollection, ViewRect, ViewSprite, ViewText } from "../view.js";
import { Raccoon } from "../../entity/enemy.types/raccoon.js";
import { Strawberry } from "../../entity/defender.types/strawberry.js";
import { Entity } from "../../entity/entity.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import { Banana, BananaSpawner } from "../../entity/defender.types/banana.js";
import { Frog } from "../../entity/enemy.types/frog.js";
import { Ant } from "../../entity/enemy.types/ant.js";
import Inventory from "../../inventory.js";
import Engine from "../../engine.js";

var hasPlayed = false;

var gameplayView = new GameplayView;
Engine.createView("gameplay", gameplayView);

let stopButton = new ViewText("<");
gameplayView.addElement(stopButton);

stopButton.addEventListener("click", () => {
	Engine.showView("main-menu");
});

let inventoryButton = new ViewSprite("sandwich-three");
gameplayView.addElement(inventoryButton);
inventoryButton.setAnchor( Engine.anchor.topRight );
inventoryButton.moveTo(-100, 100);
inventoryButton.setSize(50, 50);

inventoryButton.addEventListener("click", () => {
	Engine.showView("inventory/page-1");
});

gameplayView.addEventListener("show", () => {

	if (hasPlayed) return;

	Raccoon.spawn(1, [ 0, 0 ]);
	Sandwich.spawn(1, [ window.innerWidth/2, window.innerHeight/2 ]);

	hasPlayed = true;
});
