import GameplayView from "../elements/gameplay-view.js";
import { Raccoon } from "../../entity/enemy.types/raccoon.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import Engine from "../../engine.js";
import { ViewSprite } from "../elements/sprite.js";
import { Ant } from "../../entity/enemy.types/ant.js";
import { Wave } from "../../wave.js";
import { IceCube } from "../../entity/tools/glassoflemonade.js";

var hasPlayed = false;

// Aspect ratio of 1.333:1
GameplayView.playSpaceSize[0] = 1270;
GameplayView.playSpaceSize[1] = Math.round( GameplayView.playSpaceSize[0] * (2/3) );

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
inventoryButton.setAnchor( Engine.anchorPresets.topRight );
inventoryButton.setTranslation(-100, 50);
inventoryButton.setSize(50, 50);

inventoryButton.addEventListener("click", () => {
	Engine.showView("inventory/player-stats");
});

gameplayView.addEventListener("show", () => {

	if (hasPlayed) return;

	Wave.newWave();
	Sandwich.spawn(1, [
		GameplayView.playSpaceSize[0]/2,
		GameplayView.playSpaceSize[1]/2
	]);

	IceCube.spawn(1, [100, 100]);

	hasPlayed = true;
});


let grass = new Image;
grass.src = "/assets/grass.svg";

grass.addEventListener("load", () => {
	gameplayView.background.source = grass;
});

let picnic = new Image;
picnic.src = "/assets/picnic.svg";

picnic.addEventListener("load", () => {
	gameplayView.gameplayBackground.source = picnic;
});