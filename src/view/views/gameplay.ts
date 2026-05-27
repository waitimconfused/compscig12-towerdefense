import GameplayView from "../gameplay-view.js";
import { Raccoon } from "../../entity/enemy.types/raccoon.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import Engine from "../../engine.js";
import { ViewText } from "../elements/text.js";
import { ViewSprite } from "../elements/sprite.js";
import { Wave } from "../../wave.js";

var hasPlayed = false;

var gameplayView = new GameplayView;
Engine.createView("gameplay", gameplayView);

let stopButton = new ViewText("<");
gameplayView.addElement(stopButton);

stopButton.addEventListener("click", () => {
	Engine.showView("main-menu");
});

let inventoryButton = new ViewSprite("icon-close");
gameplayView.addElement(inventoryButton);
inventoryButton.setAnchor( Engine.anchor.topRight );
inventoryButton.moveTo(-100, 50);
inventoryButton.setSize(50, 50);

inventoryButton.addEventListener("click", () => {
	Engine.showView("inventory/page-1");
});

gameplayView.addEventListener("show", () => {

	if (hasPlayed) return;

	Wave.newWave();

	hasPlayed = true;
});


let image = new Image;
image.src = "/assets/picnic.svg";

image.addEventListener("load", () => {
	gameplayView.gameplayBackground.source = image;
});