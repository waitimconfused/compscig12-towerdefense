import Engine from "../../engine.js";
import { View, ViewSprite, ViewText } from "../view.js";

var menuView = new View();
Engine.createView("main-menu", menuView);

let title = new ViewText("Tower Defense");
title.alignment.x = "center";
title.alignment.y = "bottom";
title.setAnchor( Engine.anchor.centerCenter );
title.stroke.colour = "none";
title.stroke.size = 0;
menuView.addElement(title);


let playButton = new ViewText("Play");
playButton.addEventListener("click", () => {
	Engine.showView("gameplay");
});
playButton.setAnchor( Engine.anchor.bottomCenter );
playButton.alignment.x = "center";
playButton.alignment.y = "bottom";
playButton.moveTo(0, -100);
menuView.addElement(playButton);

let asset = new ViewSprite("sandwich-three");
menuView.addElement(asset);
asset.setAnchor( Engine.anchor.centerCenter );
asset.setSize(291, 224);
