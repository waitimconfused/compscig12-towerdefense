import GameplayView from "../gameplay-view.js";
import { Raccoon } from "../../entity/enemy.types/raccoon.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import Engine from "../../engine.js";
import { ViewText } from "../elements/text.js";
import { ViewSprite } from "../elements/sprite.js";

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
