import Engine from "../../engine.js";
import Inventory from "../../inventory.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { View, ViewCollection } from "../view.js";

var inventoryView = new ViewCollection;
Engine.createView("inventory", inventoryView);

var page1 = new View;
inventoryView.createView("page-1", page1);

Inventory.give("honey", 30);

page1.addEventListener("show", () => {

	while ( page1.children.length > 0 ) page1.removeElement(page1.children[0]);
	
	page1.addElement(
		new ViewText("Page 1")
		.moveTo( 100, 100 )
	);

	let stopButton = new ViewSprite("close");
	stopButton.setSize(50, 50);
	stopButton.moveTo(50, 50);
	page1.addElement(stopButton);
	
	stopButton.addEventListener("click", () => {
		Engine.showView("gameplay");
	});

	let items = Inventory.items.entries();

	let y = 0;
	for ( let [item, count] of items ) {
		
		if (item == "coin") continue;
		if (item == "point") continue;


		page1.addElement(
			new ViewText(`${item}: ${count}`)
			.setAnchor(Engine.anchor.centerCenter)
			.moveTo(100, 100 + y * 50)
		);

		y += 1;

	}

});

inventoryView.showView("page-1");

var page2 = new View;
inventoryView.createView("page-2", page2);

page2.addElement(
	new ViewText("Page 2")
	.moveTo( 100, 100 )
);
