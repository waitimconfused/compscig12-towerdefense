import { book, button_close, tab_defenderStats, tab_enemyStats, tab_playerStats, tab_recipe } from "../inventory.js";
import { View } from "../../view.js";
import { ViewText } from "../../elements/text.js";
import Engine from "../../../engine.js";

const view = new View;

view.addElement(book);
view.addElement(button_close);
view.addElement(tab_playerStats);
view.addElement(tab_defenderStats);
view.addElement(tab_enemyStats);
view.addElement(tab_recipe);

view.addElement(
	new ViewText("Recipe")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setTranslation( -book.size[0]/2+100, -book.size[1]/2+100 )
	.setRotation(3, "deg")
	.setAlignment("left", "top")
	.setFont("Preahvihear", 65)
	.setStroke("none")
	.setFill("black")
);

export default view;