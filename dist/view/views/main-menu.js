import Engine from "../../engine.js";
import { ViewRect } from "../elements/rect.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { ViewCollection } from "../view-collection.js";
import { View } from "../view.js";
var view = new ViewCollection;
Engine.createView("main-menu", view);
const bookRotation = 15;
const bookRotationRad = bookRotation * Math.PI / 180;
let grassBackgroundImage = new Image;
grassBackgroundImage.src = "/assets/grass.svg";
let picnicBackgroundImage = new Image;
picnicBackgroundImage.src = "/assets/picnic.svg";
var grassBackground = new ViewRect()
    .setFill(grassBackgroundImage)
    .setAnchor(Engine.anchorPresets.centerCenter)
    .setSize(window.innerWidth, window.innerHeight)
    .setStroke("none");
var picnicBackground = new ViewRect()
    .setFill(picnicBackgroundImage)
    .setAnchor(Engine.anchorPresets.bottomCenter)
    .setRotation(-3, "deg")
    .setSize(window.innerWidth, window.innerHeight)
    .setStroke("none");
view.addElement(grassBackground, picnicBackground);
view.addEventListener("show", () => {
    grassBackground.setSize(Engine.size[0], Engine.size[1]);
    picnicBackground.setSize(Engine.size[0] * 1.2, Engine.size[1] * 1.2);
});
view.addEventListener("resize", () => {
    grassBackground.setSize(Engine.size[0], Engine.size[1]);
    picnicBackground.setSize(Engine.size[0] * 1.2, Engine.size[1] * 1.2);
});
view.addElement(new ViewSprite("carrier-1")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .setTranslation(-100, -275), new ViewSprite("corn-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-500, -300), new ViewSprite("cherry-skipping")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-250, -200), new ViewSprite("sandwich-four")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-400, -150), new ViewSprite("ant-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-760, -400), new ViewSprite("ant-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-710, -310), new ViewSprite("raccoon-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .setTranslation(-800, -250), new ViewSprite("ant-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-740, -160), new ViewSprite("ant-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-825, -125), new ViewSprite("ant-idling")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-780, -220), new ViewSprite("wasp-flying")
    .setAnchor(Engine.anchorPresets.bottomRight)
    .setOrigin(1, 1)
    .scale(0.75)
    .setTranslation(-900, -220), new ViewSprite("gui-cover")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setOrigin(0, 1)
    .setTranslation(-100, 50)
    .setRotation(bookRotation));
var mainMenu = new View();
view.createView("start", mainMenu);
mainMenu.addElement(new ViewText("Tower\nDefense")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setTranslation(550 * Math.cos(Math.PI / 2 - bookRotationRad) + 325, -550 * Math.sin(Math.PI / 2 - bookRotationRad) - 20)
    .setRotation(bookRotation, "deg")
    .setFont("Preahvihear", undefined, undefined, -50)
    .setAlignment("center", "bottom")
    .setFill("black")
    .setStroke("none"), new ViewText("play")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setTranslation(250 * Math.cos(Math.PI / 2 - bookRotationRad) + 325, -250 * Math.sin(Math.PI / 2 - bookRotationRad) - 20)
    .setRotation(bookRotation, "deg")
    .setFont("Gamja Flower")
    .setAlignment("center", "bottom")
    .setFill("black")
    .setStroke("white", 6)
    .addEventListener("click", () => {
    Engine.showView("gameplay");
}), new ViewText("credits")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setTranslation(100 * Math.cos(Math.PI / 2 - bookRotationRad) + 325, -100 * Math.sin(Math.PI / 2 - bookRotationRad) - 20)
    .setRotation(bookRotation, "deg")
    .setFont("Gamja Flower")
    .setAlignment("center", "bottom")
    .setFill("black")
    .setStroke("white", 6)
    .addEventListener("click", () => {
    Engine.showView("main-menu/credits");
}));
var creditsMenu = new View();
view.createView("credits", creditsMenu);
creditsMenu.addElement(new ViewText("Created by:")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setTranslation(550 * Math.cos(Math.PI / 2 - bookRotationRad) + 325, -550 * Math.sin(Math.PI / 2 - bookRotationRad) - 20)
    .setRotation(bookRotation, "deg")
    .setFont("Preahvihear", 90)
    .setAlignment("center", "bottom")
    .setFill("black")
    .setStroke("none"), new ViewText("Kenneth E\n☆ Cassandra H ☆\nBrendan D")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setTranslation(450 * Math.cos(Math.PI / 2 - bookRotationRad) + 325, -450 * Math.sin(Math.PI / 2 - bookRotationRad) - 20)
    .setRotation(bookRotation, "deg")
    .setFont("Gamja Flower", 80, undefined, 25)
    .setAlignment("center", "bottom")
    .setFill("black")
    .setStroke("none"), new ViewText("back")
    .setAnchor(Engine.anchorPresets.bottomLeft)
    .setTranslation(100 * Math.cos(Math.PI / 2 - bookRotationRad) + 325, -100 * Math.sin(Math.PI / 2 - bookRotationRad) - 20)
    .setRotation(bookRotation, "deg")
    .setFont("Gamja Flower")
    .setAlignment("center", "bottom")
    .setFill("black")
    .setStroke("white", 6)
    .addEventListener("click", () => {
    Engine.showView("main-menu/start");
}));
//# sourceMappingURL=main-menu.js.map