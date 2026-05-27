import Engine from "../../engine.js";
import { ViewRect } from "../elements/rect.js";
import { ViewSprite } from "../elements/sprite.js";
import { ViewText } from "../elements/text.js";
import { View } from "../view.js";

ViewText.addFont("Preahvihear", "/fonts/preahvihear.ttf");
ViewText.addFont("Gamja Flower", "/fonts/gamja-flower.ttf");

var menuView = new View();
Engine.createView("main-menu", menuView);

let book = new ViewRect;
book.setAnchor(Engine.anchor.bottomLeft);
book.rotation = Math.PI / 12;
book.moveTo(300, 0);
book.setSize(750, 2000);
book.fill = "red";
menuView.addElement(book);

let title = new ViewText("Tower Defense");
title.alignment.x = "center";
title.alignment.y = "bottom";
title.font.family = "Preahvihear";
title.setAnchor( Engine.anchor.bottomLeft );
title.rotation = book.rotation;
title.moveTo(
	600*Math.cos(Math.PI/2 - book.rotation) + 300,
	-600*Math.sin(Math.PI/2 - book.rotation)
);
title.fill = "black";
title.stroke.colour = "white";
title.stroke.size = 6;
menuView.addElement(title);


let playButton = new ViewText("<play>");
playButton.addEventListener("click", () => {
	Engine.showView("gameplay");
});
playButton.font.family = "Gamja Flower";
playButton.fill = "black";
playButton.stroke.colour = "white";
playButton.stroke.size = 6;
playButton.alignment.x = "center";
playButton.alignment.y = "bottom";
playButton.rotation = book.rotation;
playButton.setAnchor(Engine.anchor.bottomLeft);
playButton.moveTo(
	400*Math.cos(Math.PI/2 - book.rotation) + 300,
	-400*Math.sin(Math.PI/2 - book.rotation)
);
menuView.addElement(playButton);

let creditsButton = new ViewText("<credits>");
creditsButton.addEventListener("click", () => {
	Engine.showView("credits");
});
creditsButton.font.family = "Gamja Flower";
creditsButton.fill = "black";
creditsButton.stroke.size = 6;
creditsButton.stroke.colour = "white";
creditsButton.alignment.x = "center";
creditsButton.alignment.y = "bottom";
creditsButton.rotation = book.rotation;
creditsButton.setAnchor(Engine.anchor.bottomLeft);
creditsButton.moveTo(
	300*Math.cos(Math.PI/2 - book.rotation) + 300,
	-300*Math.sin(Math.PI/2 - book.rotation)
);
menuView.addElement(creditsButton);

let asset = new ViewSprite("sandwich-three");
menuView.addElement(asset);
asset.setAnchor( Engine.anchor.centerLeft );
asset.setSize(291, 224);