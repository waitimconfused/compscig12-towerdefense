import Engine from "../../engine.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { ViewCollection } from "../view-collection.js";
import { View } from "../view.js";

export const view = new ViewCollection;
Engine.createView("inventory", view);

export const button_close = new ViewSprite("close")
	.setSize(50, 50)
	.setTranslation(50, 50)
	.addEventListener("click", () => {
		Engine.showView("gameplay");
	});

export const book = new ViewSprite("gui-book")
	.setAnchor( Engine.anchorPresets.centerCenter )
	.setOrigin(0.5, 0.5);

export const tab_playerStats = new ViewSprite("tab-stats")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setOrigin(0.6, 0.5)
	.setTranslation( book.size[0]/2, -250 )
	.addEventListener("click", () => {
		Engine.showView("inventory/player-stats");
	});

export const tab_defenderStats = new ViewSprite("tab-defender")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setOrigin(0.6, 0.5)
	.setTranslation( book.size[0]/2, -100 )
	.addEventListener("click", () => {
		Engine.showView("inventory/defender-stats");
	});

export const tab_enemyStats = new ViewSprite("tab-enemy")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setOrigin(0.6, 0.5)
	.setTranslation( book.size[0]/2, 50 )
	.addEventListener("click", () => {
		Engine.showView("inventory/enemy-stats");
	});

export const tab_recipe = new ViewSprite("tab-recipe")
	.setAnchor(Engine.anchorPresets.centerCenter)
	.setTranslation( 200, -425 )
	.setRotation(-3, "deg")
	.addEventListener("click", () => {
		Engine.showView("inventory/recipe");
	});

const subViews = {
	"player-stats": "./inventory/player-stats.js",
	"defender-stats": "./inventory/defender-stats.js",
	"enemy-stats": "./inventory/enemy-stats.js",
	"recipe": "./inventory/tool-recipe.js"
};


let backgroundImage = new Image;
backgroundImage.src = "/assets/picnic.svg";
backgroundImage.addEventListener("load", () => {
	view.background.source = backgroundImage;
});

for (let name in subViews) {

	let path = subViews[name as keyof typeof subViews] as string;

	import(path)
	.then((module) => {
		let subView:View = module.default as View;
		subView.background.source = backgroundImage;
		view.createView(name, subView);
	});
}