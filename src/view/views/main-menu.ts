import Engine from "../../engine.js";
import { ViewRect } from "../elements/rect.js";
import { ViewText } from "../elements/text.js";
import { View, ViewCollection } from "../view.js";

var menuView = new ViewCollection();
Engine.createView("main-menu", menuView);

var mainMenu = new View();
menuView.createView("start", mainMenu);

const rotation = 15;
const rotationRad = rotation * Math.PI / 180;

mainMenu.addElement(
	new ViewRect()
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(300, 0)
	.setSize(750, 2000)
	.setRotation(rotation, "deg")
	.setFill("red")
	.setStroke("none", 0)
);

mainMenu.addElement(
	new ViewText("Tower Defense")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		600*Math.cos(Math.PI/2 - rotationRad) + 300,
		-600*Math.sin(Math.PI/2 - rotationRad)
	)
	.setRotation(rotation, "deg")
	.setFont("Preahvihear")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
);

mainMenu.addElement(
	new ViewText("<play>")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		400*Math.cos(Math.PI/2 - rotationRad) + 300,
		-400*Math.sin(Math.PI/2 - rotationRad)
	)
	.setRotation(rotation, "deg")
	.setFont("Gamja Flower")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("gameplay");
	})
);

mainMenu.addElement(
	new ViewText("<credits>")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		300*Math.cos(Math.PI/2 - rotationRad) + 300,
		-300*Math.sin(Math.PI/2 - rotationRad)
	)
	.setRotation(rotation, "deg")
	.setFont("Gamja Flower")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("main-menu/credits");
	})
);

// let creditsButton = new ViewText("<credits>");
// creditsButton.addEventListener("click", () => {
// 	Engine.showView("credits");
// });
// creditsButton.font.family = "Gamja Flower";
// creditsButton.fill = "black";
// creditsButton.stroke.size = 6;
// creditsButton.stroke.colour = "white";
// creditsButton.alignment.x = "center";
// creditsButton.alignment.y = "bottom";
// creditsButton.rotation = book.rotation;
// creditsButton.setAnchor(Engine.anchor.bottomLeft);
// creditsButton.setTranslation(
// 	300*Math.cos(Math.PI/2 - book.rotation) + 300,
// 	-300*Math.sin(Math.PI/2 - book.rotation)
// );
// mainMenu.addElement(creditsButton);

// let asset = new ViewSprite("sandwich-three");
// mainMenu.addElement(asset);
// asset.setAnchor( Engine.anchor.centerLeft );
// asset.setSize(291, 224);