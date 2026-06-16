import GameplayView from "../elements/gameplay-view.js";
import { Sandwich } from "../../entity/defender.types/sandwich.js";
import Engine from "../../engine.js";
import { ViewSprite } from "../elements/sprite.js";
import { Wave } from "../../wave.js";
import { ViewElementCollection } from "../view-element-collection.js";
import { ViewRect } from "../elements/rect.js";
import { Entity } from "../../entity/entity.js";
import { Strawberry } from "../../entity/defender.types/strawberry.js";
import { Carrier } from "../../entity/other/carrier.js";
import { Corn } from "../../entity/defender.types/corn.js";
import { ViewText } from "../elements/text.js";
import { Cherry } from "../../entity/defender.types/cherry.js";
import { BananaSpawner } from "../../entity/defender.types/banana.js";

GameplayView.playSpaceSize[0] = 1900;
GameplayView.playSpaceSize[1] = 950;
GameplayView.playSpacePadding = [100, 300];

var view = new GameplayView;
Engine.createView("gameplay", view);

view.addElement(
	new ViewSprite("close")
	.setSize(50, 50)
	.setTranslation(50, 50)
	.addEventListener("click", () => {
		Engine.showView("main-menu/start");
	})
)

export let mainCarrier : Carrier;

view.addEventListener("show", () => {

	if (Entity.entities.size != 0) return;

	mainCarrier = Carrier.spawn(1, [
		GameplayView.playSpaceSize[0] - 200,
		GameplayView.playSpaceSize[1] - 200
	])[0] as Carrier;

	Wave.setWave(1);

});


let grass = new Image;
grass.src = "/assets/grass.svg";

grass.addEventListener("load", () => {
	view.background.source = grass;
});

let picnic = new Image;
picnic.src = "/assets/picnic.svg";

picnic.addEventListener("load", () => {
	view.gameplayBackground.source = picnic;
});


view.addElement(
	new ViewRect()
	.setAnchor(Engine.anchorPresets.bottomCenter)
	.setFill("#C06B41")
	.setOrigin(0.5, 1)
	.setStroke("#842C33", 10)
	.addEventListener("pre-render", (element, canvas) => {
		element.setSize(canvas.width, 100);
	}),

	new ViewSprite("gui-cover-flip")
	.setAnchor(Engine.anchorPresets.bottomRight)
	.setOrigin(1, 1)
	.setTranslation(100, 50)
	.setRotation(15, "deg")
);

class Bar extends ViewElementCollection {

	private childOffset = 20;

	public override addElement(...elements: SpawnButton[]): this {
		
		for (let i = 0; i < elements.length; i ++) {

			let element:SpawnButton = elements[i] as SpawnButton;

			element.setAnchor( Engine.anchorPresets.bottomLeft );
			element.setTranslation( this.childOffset, -50 );
			element.setOrigin(0, 0.5);

			
			let height = element.size[1];
			let wantedHeight = 80;
			
			element.scale( wantedHeight / height );
			
			this.childOffset += element.size[0] + 50;

			super.addElement(element);

		}

		return this;
	}

}

const bar = new Bar;
view.addElement(bar);

let inventoryButton = new ViewSprite("gui-cover");
inventoryButton.setAnchor( Engine.anchorPresets.bottomRight )
	.scale(0.5)
	.setOrigin(0.8, 0.9)
	.setRotation(-10, "deg")
	.scale(0.75);

inventoryButton.addEventListener("click", () => {
	Engine.showView("inventory/player-stats");
});

view.addElement(
	inventoryButton,

	new ViewText("Inventory")
	.setAnchor( Engine.anchorPresets.bottomRight )
	.setAlignment("center", "middle")
	.setFont("Preahvihear", 32)
	.setFill("black")
	.setStroke("none")
	.setRotation(-10, "deg")
	.setTranslation(-125, -200)
)

class SpawnButton extends ViewSprite {
	constructor(reference:string, entity:typeof Entity) {
		
		super(reference);

		this.addEventListener("click", () => {
			view.spawningEntity = { reference, entity};
		});
	}
}

bar.addElement( new SpawnButton("strawberry-idling", Strawberry) );
bar.addElement( new SpawnButton("sandwich-four", Sandwich) );
bar.addElement( new SpawnButton("corn-idling", Corn) );
bar.addElement( new SpawnButton("cherry-idling", Cherry) );
bar.addElement( new SpawnButton("banana-rolling", BananaSpawner) );

const defaultSpawnAreas = {
	on_path: new Path2D("M1063.5 0C1063.5 0 1198.81 31.4441 1279.5 67.5C1408.82 125.29 1477.75 174.002 1567 284C1638.97 372.7 1620.8 461.424 1706 537.5C1741.19 568.92 1761.76 591.445 1807.5 603C1842.52 611.848 1900 603 1900 603V826C1900 826 1807.01 831.9 1749.5 819.5C1654.79 799.079 1600.6 769.395 1531 702C1448.31 621.937 1462.99 532.366 1397 439.5C1345.3 366.744 1307.15 328.003 1229.5 284C1127.74 226.34 1053.45 223.241 936.5 222C860.212 221.191 809.139 207.854 742.5 245C688.312 275.206 634.5 361.5 634.5 361.5C634.5 361.5 783.158 303.766 883 301C980.172 298.308 1044.23 295.684 1128 345C1196.94 385.583 1238.23 420.549 1267.5 495C1301.13 580.563 1282.02 642.599 1253.5 730C1221.04 829.487 1100.5 950 1100.5 950H533.5C533.5 950 469.105 875.16 440.5 819.5C395.149 731.256 379 573 379 573C322 573 176.5 400.5 131.5 289.5C86.5 178.5 0 174 0 174V0H215.5C337.193 82.4191 380.939 149.865 443 284C443 284 528.838 154.229 608 98C694.828 36.3262 862.5 0 862.5 0H1063.5ZM996 537.5C947.959 481.706 882.337 506.969 809 513.5C742.53 519.419 645 561.5 645 561.5C645 561.5 647.023 658.106 682 703.5C712.85 743.538 742.329 760.8 791.5 772.5C853.125 787.163 899.136 779.369 951 743C996.938 710.787 1030.67 679.103 1030 623C1029.57 587.07 1019.45 564.73 996 537.5Z"),
	off_path: new Path2D("M645 561.5C645 561.5 647.023 658.106 682 703.5C712.85 743.538 742.329 760.8 791.5 772.5C853.125 787.163 899.136 779.369 951 743C996.938 710.787 1030.67 679.103 1030 623C1029.57 587.07 1019.45 564.73 996 537.5C947.959 481.706 882.337 506.969 809 513.5C742.53 519.419 645 561.5 645 561.5Z M0 174C0 174 86.5 178.5 131.5 289.5C176.5 400.5 322 573 379 573C379 573 395.149 731.256 440.5 819.5C469.105 875.16 533.5 950 533.5 950H0V174Z M1253.5 730C1282.02 642.599 1301.13 580.563 1267.5 495C1238.23 420.549 1196.94 385.583 1128 345C1044.23 295.684 980.172 298.308 883 301C783.158 303.766 634.5 361.5 634.5 361.5C634.5 361.5 688.312 275.206 742.5 245C809.139 207.854 860.212 221.191 936.5 222C1053.45 223.241 1127.74 226.34 1229.5 284C1307.15 328.003 1345.3 366.744 1397 439.5C1462.99 532.366 1448.31 621.937 1531 702C1600.6 769.395 1654.79 799.079 1749.5 819.5C1807.01 831.9 1900 826 1900 826V950H1100.5C1100.5 950 1221.04 829.487 1253.5 730Z M1900 0V603C1900 603 1842.52 611.848 1807.5 603C1761.76 591.445 1741.19 568.92 1706 537.5C1620.8 461.424 1638.97 372.7 1567 284C1477.75 174.002 1408.82 125.29 1279.5 67.5C1198.81 31.4441 1063.5 0 1063.5 0H1900Z M862.5 0C862.5 0 694.828 36.3262 608 98C528.838 154.229 443 284 443 284C380.939 149.865 337.193 82.4191 215.5 0H862.5Z")
}

view.entitySpawnAreas.set(Sandwich.getDisplayName(), new Path2D(defaultSpawnAreas.on_path) );
view.entitySpawnAreas.set(Corn.getDisplayName(), new Path2D(defaultSpawnAreas.off_path) );