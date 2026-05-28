import Engine from "../../engine.js";
import { ViewRect } from "../elements/rect.js";
import { ViewText } from "../elements/text.js";
import { View, ViewCollection } from "../view.js";

var menuView = new ViewCollection();
Engine.createView("main-menu", menuView);

const bookRotation = 15;
const bookRotationRad = bookRotation * Math.PI / 180;

// Play button & Credits button
var mainMenu = new View();
menuView.createView("start", mainMenu);


// Book
var book = new ViewRect()
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(300, 0)
	.setSize(750, 2000)
	.setRotation(bookRotation, "deg")
	.setFill("red")
	.setStroke("none");

mainMenu.addElement(book);

// Title
mainMenu.addElement(
	new ViewText("Tower Defense")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		600*Math.cos(Math.PI/2 - bookRotationRad) + 300,
		-600*Math.sin(Math.PI/2 - bookRotationRad)
	)
	.setRotation(bookRotation, "deg")
	.setFont("Preahvihear", 90)
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("none")
);

// Play button
mainMenu.addElement(
	new ViewText("> play <")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		400*Math.cos(Math.PI/2 - bookRotationRad) + 300,
		-400*Math.sin(Math.PI/2 - bookRotationRad)
	)
	.setRotation(bookRotation, "deg")
	.setFont("Gamja Flower")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("gameplay");
	})
);

// Credits button
mainMenu.addElement(
	new ViewText("credits")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		300*Math.cos(Math.PI/2 - bookRotationRad) + 300,
		-300*Math.sin(Math.PI/2 - bookRotationRad)
	)
	.setRotation(bookRotation, "deg")
	.setFont("Gamja Flower")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("main-menu/credits");
	})
);





// Credits Menu
var creditsMenu = new View();
menuView.createView("credits", creditsMenu);

// Book
creditsMenu.addElement(book);

// Title
creditsMenu.addElement(
	new ViewText("Developed by:")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		600*Math.cos(Math.PI/2 - bookRotationRad) + 300,
		-600*Math.sin(Math.PI/2 - bookRotationRad)
	)
	.setRotation(bookRotation, "deg")
	.setFont("Preahvihear", 90)
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("none")
);

// Names
creditsMenu.addElement(
	new ViewText("Kenneth E\nCassandra H\nBrendan D")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		450*Math.cos(Math.PI/2 - bookRotationRad) + 300,
		-450*Math.sin(Math.PI/2 - bookRotationRad)
	)
	.setRotation(bookRotation, "deg")
	.setFont("Gamja Flower", 80)
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("none")
);

// Main menu button
creditsMenu.addElement(
	new ViewText("> back <")
	.setAnchor(Engine.anchor.bottomLeft)
	.setTranslation(
		150*Math.cos(Math.PI/2 - bookRotationRad) + 300,
		-150*Math.sin(Math.PI/2 - bookRotationRad)
	)
	.setRotation(bookRotation, "deg")
	.setFont("Gamja Flower")
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("white", 6)
	.addEventListener("click", () => {
		Engine.showView("main-menu/start");
	})
);