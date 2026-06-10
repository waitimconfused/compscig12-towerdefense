import Engine from "../../../engine.js";
import Inventory from "../../../inventory.js";
import { ViewText } from "../../elements/text.js";
import { book, tab_playerStats } from "../inventory.js";
import { ViewElementCollection } from "../../view-element-collection.js";
import { View } from "../../view.js";

const view = new View;

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

var itemGroup = new ViewElementCollection;
view.addElement(itemGroup);

view.addEventListener("show", () => {

	while ( itemGroup.children.length > 0 ) itemGroup.removeElement(itemGroup.children[0]!);

	let items = Inventory.items.entries();

	let y = 0;
	for ( let [item, count] of items ) {
		
		if (item == "coin") continue;
		if (item == "point") continue;

		itemGroup.addElement(
			new ViewText(`${item}\tx${count}`)
			.setAnchor(Engine.anchorPresets.centerCenter)
			.setTranslation(0, y * 150)
			.setFont("Gamja Flower", 48)
			.setStroke("none")
			.setFill("black")
		);

		y += 1;

	}

});

view.addEventListener("show", () => {
	tab_playerStats.reference = "tab-stats-active";
});

view.addEventListener("hide", () => {
	tab_playerStats.reference = "tab-stats";
});

export default view;