import Engine from "../../../engine.js";
import Inventory from "../../../inventory.js";
import { ViewText } from "../../elements/text.js";
import { book, tab_playerStats } from "../inventory.js";
import { ViewElementCollection } from "../../view-element-collection.js";
import { View } from "../../view.js";

const view = new View;

view.addEventListener("show", () => {
	tab_playerStats.reference = "tab-stats-active";
});

view.addEventListener("hide", () => {
	tab_playerStats.reference = "tab-stats";
});

view.addElement(
	new ViewText("Stats")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setTranslation( -book.size[0]/2+100, -book.size[1]/2+100 )
	.setRotation(3, "deg")
	.setAlignment("left", "top")
	.setFont("Preahvihear", 65)
	.setStroke("none")
	.setFill("black")
);

Inventory.give("honey", 30);
Inventory.give("jar", 30);

const itemText = new ViewText("")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setTranslation(-600, -200)
	.setFont("Gamja Flower", 48)
	.setStroke("none")
	.setFill("black");

view.addElement(itemText);

view.addEventListener("show", () => {

	let items = Inventory.items.entries();

	let content = "";

	let y = 0;
	for ( let [item, count] of items ) {
		
		if (item == "coin") continue;
		if (item == "point") continue;

		content += `- ${item}    x${count}\n`;

		y += 1;

	}

	itemText.content = content;

});

export default view;