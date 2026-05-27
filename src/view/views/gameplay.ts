import GameplayView from "../gameplay-view.js";
import { Raccoon } from "../../entity/enemy.types/raccoon.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import Engine from "../../engine.js";
import { ViewText } from "../elements/text.js";
import { ViewSprite } from "../elements/sprite.js";
import { Ant } from "../../entity/enemy.types/ant.js";
import { Frog } from "../../entity/enemy.types/frog.js";
import { Wasp } from "../../entity/enemy.types/wasp.js";

var hasPlayed = false;

var gameplayView = new GameplayView;
Engine.createView("gameplay", gameplayView);

let stopButton = new ViewSprite("close");
stopButton.setSize(50, 50);
stopButton.moveTo(50, 50);
gameplayView.addElement(stopButton);

stopButton.addEventListener("click", () => {
	Engine.showView("main-menu");
});

let inventoryButton = new ViewSprite("close");
gameplayView.addElement(inventoryButton);
inventoryButton.setAnchor( Engine.anchor.topRight );
inventoryButton.moveTo(-100, 50);
inventoryButton.setSize(50, 50);

inventoryButton.addEventListener("click", () => {
	Engine.showView("inventory/page-1");
});

gameplayView.addEventListener("show", () => {

	if (hasPlayed) return;

	Raccoon.spawn(1, [0,0]);
	Ant.antSpawn([0,0]);
	console.log(Sandwich.level);
	Sandwich.spawn(1, [ window.innerWidth/2, window.innerHeight/2 ]);

	hasPlayed = true;
});


let image = new Image;
image.src = "/assets/picnic.svg";

image.addEventListener("load", () => {
	gameplayView.gameplayBackground.source = image;
});