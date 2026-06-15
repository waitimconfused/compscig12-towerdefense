import Engine from "../../engine.js";
import { Entity } from "../../entity/entity.js";
import { Wave } from "../../wave.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { View } from "../view.js";

export const view = new View;
Engine.createView("game-over", view);

view.addEventListener("show", () => {
	Entity.entities.clear();
});

let picnic = new Image;
picnic.src = "/assets/picnic.svg";

picnic.addEventListener("load", () => {
	view.background.source = picnic;
});

view.addElement(
	new ViewSprite("paper-big")
	.setAnchor( Engine.anchorPresets.centerCenter )
	.setOrigin(0.5, 0.5)
	.setRotation(7, "deg")
);

view.addElement(
	new ViewText("Game Over!")
	.setAnchor( Engine.anchorPresets.centerCenter )
	.setTranslation(0, -120)
	.setAlignment("center", "bottom")
	.setFont("Preahvihear", 90)
	.setFill("black")
	.setStroke("none")
);

view.addElement(
	new ViewText("☞ you got to wave ⓪ ☜")
	.setAnchor( Engine.anchorPresets.centerCenter )
	.setTranslation(0, -70)
	.setAlignment("center", "bottom")
	.setFont("Gamja Flower", 60)
	.setFill("black")
	.setStroke("none")
	.addEventListener("pre-render", (element) => {

		element.content = `☞ you got to wave #${Wave.getWave()} ☜`
	})
);

view.addElement(
	new ViewSprite("sandwich-one")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setOrigin(0.5, 0.5)
	.setRotation(-3, "deg")
)

view.addElement(
	new ViewText("> main menu <")
	.setAnchor( Engine.anchorPresets.centerCenter )
	.setTranslation(0, 200)
	.setAlignment("center", "top")
	.setFont("Gamja Flower")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("main-menu/start")
	})
);