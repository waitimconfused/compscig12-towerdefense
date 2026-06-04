import Engine from "../../engine.js";
import Inventory from "../../inventory.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { ViewCollection } from "../view-collection.js";
import { ViewElementCollection } from "../view-element-collection.js";
import { View } from "../view.js";

const VIEW = new ViewCollection;
Engine.createView("inventory", VIEW);

const CLOSE_BUTTON = new ViewSprite("close")
	.setSize(50, 50)
	.setTranslation(50, 50)
	.addEventListener("click", () => {
		Engine.showView("gameplay");
	});

const PLAYER_STATS_BUTTON = new ViewText("Player")
	.setAnchor(Engine.anchorPresets.topLeft)
	.setTranslation( 100, 100 )
	.setFont("Preahvihear", 64)
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("inventory/player-stats");
	});

const CHARACTER_STATS_BUTTON = new ViewText("Character")
	.setAnchor(Engine.anchorPresets.topLeft)
	.setTranslation( 400, 100 )
	.setFont("Preahvihear", 64)
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("inventory/character-stats");
	});

const RECIPE_BUTTON = new ViewText("Recipe")
	.setAnchor(Engine.anchorPresets.topLeft)
	.setTranslation( 850, 100 )
	.setFont("Preahvihear", 64)
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("inventory/recipe");
	});

/**s
 *! PLAYER STATS
 */
const PLAYER_STATS = new View;
VIEW.createView("player-stats", PLAYER_STATS);

PLAYER_STATS.addElement(CLOSE_BUTTON);
PLAYER_STATS.addElement(PLAYER_STATS_BUTTON);
PLAYER_STATS.addElement(CHARACTER_STATS_BUTTON);
PLAYER_STATS.addElement(RECIPE_BUTTON);

Inventory.give("honey", 30);
Inventory.give("jar", 30);

var itemGroup = new ViewElementCollection;
PLAYER_STATS.addElement(itemGroup);

PLAYER_STATS.addEventListener("show", () => {

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

/**
 *! CHARACTER STATS
 */

const CHARACTER_STATS = new View;
VIEW.createView("character-stats", CHARACTER_STATS);

CHARACTER_STATS.addElement(CLOSE_BUTTON);
CHARACTER_STATS.addElement(PLAYER_STATS_BUTTON);
CHARACTER_STATS.addElement(CHARACTER_STATS_BUTTON);
CHARACTER_STATS.addElement(RECIPE_BUTTON);

CHARACTER_STATS.addElement(
	new ViewSprite("sandwich-one")
	.setAnchor(Engine.anchorPresets.centerCenter)
)

/**
 *! TOOL RECIPE
 */
const RECIPE = new View;
VIEW.createView("recipe", RECIPE);
RECIPE.addElement(CLOSE_BUTTON);
RECIPE.addElement(PLAYER_STATS_BUTTON);
RECIPE.addElement(CHARACTER_STATS_BUTTON);
RECIPE.addElement(RECIPE_BUTTON);