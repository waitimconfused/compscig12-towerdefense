import Engine from "./engine.js";
import Inventory from "./inventory.js";
import { MouseManager } from "./mouse.js";
import { SpriteRenderer } from "./sprites.js";
import { ViewText } from "./view/elements/text.js";
import viewFiles from "./view/views.json" with { type: "json" };
const defaultView = "main-menu/start";
SpriteRenderer.verbose = false;
MouseManager.preventContextMenu = true;
MouseManager.preventScroll = true;
MouseManager.preventZoom = true;
ViewText.addFont("Preahvihear", "/fonts/preahvihear.ttf");
ViewText.addFont("Gamja Flower", "/fonts/gamja-flower.ttf");
Inventory.load();
const canvas = document.getElementById("canvas");
await SpriteRenderer.loadDefaults();
for (let i = 0; i < viewFiles.length; i++) {
    let path = viewFiles[i];
    path = path.replace(/\.ts$/, ".js");
    let absolutePath = new URL(path, location.origin + "/dist/view/").pathname;
    console.info(`Importing view from "${absolutePath}".`);
    await import(absolutePath);
    console.info(`Successfully imported view from "${absolutePath}".`);
}
console.info(`Initialing Engine via <canvas id="${canvas.id}">`);
Engine.initialize(canvas);
console.info(`Showing default view of "${defaultView}"`);
Engine.showView(defaultView);
let loader = document.getElementById("loading");
loader.remove();
//# sourceMappingURL=index.js.map