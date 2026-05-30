import GameplayView from "../elements/gameplay-view.js";
import { Raccoon } from "../../entity/enemy.types/raccoon.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import Engine from "../../engine.js";
import { ViewSprite } from "../elements/sprite.js";
import { Ant } from "../../entity/enemy.types/ant.js";
import { Wave } from "../../wave.js";

var hasPlayed = false;

var gameplayView = new GameplayView;
Engine.createView("gameplay", gameplayView);

let stopButton = new ViewSprite("close");
stopButton.setSize(50, 50);
stopButton.setTranslation(50, 50);
gameplayView.addElement(stopButton);

stopButton.addEventListener("click", () => {
	Engine.showView("main-menu");
});

let inventoryButton = new ViewSprite("close");
gameplayView.addElement(inventoryButton);
inventoryButton.setAnchor( Engine.anchor.topRight );
inventoryButton.setTranslation(-100, 50);
inventoryButton.setSize(50, 50);

inventoryButton.addEventListener("click", () => {
	Engine.showView("inventory/page-1");
});

gameplayView.addEventListener("show", () => {

	if (hasPlayed) return;

	Wave.newWave();
	Sandwich.spawn(1, [ window.innerWidth/2, window.innerHeight/2 ]);

	hasPlayed = true;
});


let image = new Image;
image.src = "/assets/picnic.svg";

image.addEventListener("load", () => {
	gameplayView.background.source = image;
});