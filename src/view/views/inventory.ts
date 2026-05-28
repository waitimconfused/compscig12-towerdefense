import Engine from "../../engine.js";
import Inventory from "../../inventory.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { ViewCollection } from "../view-collection.js";
import { ViewElementCollection } from "../view-element-collection.js";
import { View } from "../view.js";

var inventoryView = new ViewCollection;
Engine.createView("inventory", inventoryView);

var page1 = new View;
inventoryView.createView("page-1", page1);

page1.addElement(
	new ViewText("Page 1")
	.setTranslation( 100, 100 )
);

page1.addElement(
	new ViewSprite("close")
	.setSize(50, 50)
	.setTranslation(50, 50)
	.addEventListener("click", () => {
		Engine.showView("gameplay");
	})
)

Inventory.give("honey", 30);

var itemGroup = new ViewElementCollection;
page1.addElement(itemGroup);

page1.addEventListener("show", () => {

	while ( itemGroup.children.length > 0 ) itemGroup.removeElement(itemGroup.children[0]);

	let items = Inventory.items.entries();

	let y = 0;
	for ( let [item, count] of items ) {
		
		if (item == "coin") continue;
		if (item == "point") continue;


		itemGroup.addElement(
			new ViewText(`${item}: ${count}`)
			.setAnchor(Engine.anchor.centerCenter)
			.setTranslation(100, 100 + y * 50)
		);

		y += 1;

	}

});

inventoryView.showView("page-1");

var page2 = new View;
inventoryView.createView("page-2", page2);

page2.addElement(
	new ViewText("Page 2")
	.setTranslation( 100, 100 )
);
