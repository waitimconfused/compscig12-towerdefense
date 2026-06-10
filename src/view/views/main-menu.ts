import Engine from "../../engine.js";
import { ViewRect } from "../elements/rect.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { ViewCollection } from "../view-collection.js";
import { View } from "../view.js";

var menuView = new ViewCollection();
Engine.createView("main-menu", menuView);

const bookRotation = 15;
const bookRotationRad = bookRotation * Math.PI / 180;

// Play button & Credits button
var mainMenu = new View();
menuView.createView("start", mainMenu);


let grassBackgroundImage = new Image;
grassBackgroundImage.src = "/assets/grass.svg";

var grassBackground = new ViewRect;
mainMenu.addElement(grassBackground);
grassBackground.setFill(grassBackgroundImage);
grassBackground.setAnchor(Engine.anchorPresets.centerCenter);
grassBackground.setSize(window.innerWidth, window.innerHeight);
grassBackground.setStroke("none");

let picnicBackgroundImage = new Image;
picnicBackgroundImage.src = "/assets/picnic.svg";

var picnicBackground = new ViewRect;
mainMenu.addElement(picnicBackground);
picnicBackground.setFill(picnicBackgroundImage);
picnicBackground.setAnchor(Engine.anchorPresets.bottomCenter);
picnicBackground.setRotation(3, "deg");
picnicBackground.setSize(window.innerWidth, window.innerHeight);
picnicBackground.setStroke("none");

mainMenu.addEventListener("resize", () => {
	grassBackground.setSize(Engine.size[0], Engine.size[1]);
	picnicBackground.setSize(Engine.size[0] * 1.2, Engine.size[1] * 1.2);
});

// Book
var book = new ViewSprite("gui-cover")
	.setAnchor(Engine.anchorPresets.bottomLeft)
	.setOrigin(0, 1)
	.setTranslation(-100, 50)
	.setRotation(bookRotation)

mainMenu.addElement(book);

// Title
mainMenu.addElement(
	new ViewText("Tower\nDefense")
	.setAnchor(Engine.anchorPresets.bottomLeft)
	.setTranslation(
		650*Math.cos(Math.PI/2 - bookRotationRad) + 350,
		-650*Math.sin(Math.PI/2 - bookRotationRad) - 20
	)
	.setRotation(bookRotation, "deg")
	.setFont("Preahvihear", undefined, undefined, -50)
	.setAlignment("center", "bottom")
	.setFill("black")
	.setStroke("none")
);

// Play button
mainMenu.addElement(
	new ViewText("play")
	.setAnchor(Engine.anchorPresets.bottomLeft)
	.setTranslation(
		300*Math.cos(Math.PI/2 - bookRotationRad) + 350,
		-300*Math.sin(Math.PI/2 - bookRotationRad) - 20
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
	.setAnchor(Engine.anchorPresets.bottomLeft)
	.setTranslation(
		75*Math.cos(Math.PI/2 - bookRotationRad) + 350,
		-75*Math.sin(Math.PI/2 - bookRotationRad) - 20
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
	.setAnchor(Engine.anchorPresets.bottomLeft)
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
	.setAnchor(Engine.anchorPresets.bottomLeft)
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
	.setAnchor(Engine.anchorPresets.bottomLeft)
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