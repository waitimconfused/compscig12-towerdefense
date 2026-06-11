import { SpriteData, SpriteRenderer } from "../sprites.js";
import pathsToSpriteData from "../../assets/sprites.json" with { type: "json" };

const template:HTMLTemplateElement = document.getElementById("sprite") as HTMLTemplateElement;
const output:HTMLDivElement = document.getElementById("sprites") as HTMLDivElement;

const sources:HTMLUListElement = document.getElementById("sources") as HTMLUListElement;

SpriteRenderer.verbose = false;

await SpriteRenderer.loadDefaults();

var canvases:Map<string, HTMLCanvasElement> = new Map();

for (let i = 0; i < pathsToSpriteData.assets.length; i ++) {
	
	let path = pathsToSpriteData.assets[i] as string;
	let absolutePath = new URL( path, location.origin+"/assets/" ).pathname;
	let spriteData:SpriteData|SpriteData[] = (await import(absolutePath, { with: { type: "json" } })).default;
	
	let li = document.createElement("li");
	let link = document.createElement("a");
	link.innerText = absolutePath;
	link.href = `#file-${i+1}`;
	
	li.appendChild(link);
	sources.appendChild(li);

	let section = document.createElement("section");
	let sectionTitle = document.createElement("p");
	section.appendChild(sectionTitle);
	sectionTitle.innerText = absolutePath;
	sectionTitle.id = `file-${i+1}`;
	
	let div = document.createElement("div");
	section.appendChild(div);

	if (Array.isArray(spriteData) == false) spriteData = [spriteData];

	for (let i = 0; i < spriteData.length; i ++) {
		let data:SpriteData = spriteData[i] as SpriteData;
		
		let clone:DocumentFragment = document.importNode(template.content, true);

		let canvas = clone.getElementById("result") as HTMLCanvasElement;

		let context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
		context.clearRect(0, 0, canvas.width, canvas.height);

		let offscreenCanvas:OffscreenCanvas = SpriteRenderer.getSpriteAsOffscreenCanvas({
			name: data.name,
			position: [ 0, 0 ],
			size: [ 0, 0 ],
		}, 0);

		canvas.width = offscreenCanvas.width;
		canvas.height = offscreenCanvas.height;
		
		context.drawImage(offscreenCanvas, 0, 0);

		if (data?.animation) canvases.set(data.name, canvas);

		let name:HTMLParagraphElement = clone.getElementById("name") as HTMLParagraphElement;
		name.innerText = data.name as string;
		
		div.appendChild(clone);
	}
	
	
	output.appendChild(section);
}

if (location.hash) {
	let hash = location.hash.replace(/^#/, "");
	let sectionTitle:HTMLParagraphElement|null = document.getElementById(hash) as HTMLParagraphElement|null;

	if (sectionTitle) {
		sectionTitle.scrollIntoView(true);

		sectionTitle.style.animation = "highlight 1s linear";

		sectionTitle.addEventListener("animationend", () => {
			sectionTitle.style.animation = "";
		});

	}
}

let previousTime = 0;

function tick() {

	let currentTime = performance.now();
	let delta = currentTime - previousTime;

	if (delta < 1000 / 60) {
		window.requestAnimationFrame(tick);
		return;
	}

	let spriteNames:string[] = [ ...canvases.keys() ];

	let renderedCanvases = 0;

	for (let i = 0; i < spriteNames.length; i ++) {

		let spriteName:string = spriteNames[i] as string;

		let canvas:HTMLCanvasElement = canvases.get(spriteName) as HTMLCanvasElement;
	
		let canvasBoundingBox = canvas.getBoundingClientRect();

		if (canvasBoundingBox.bottom < 0) continue;
		if (canvasBoundingBox.top > window.innerHeight) continue;
		
		let context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
		context.clearRect(0, 0, canvas.width, canvas.height);

		let offscreenCanvas:OffscreenCanvas = SpriteRenderer.getSpriteAsOffscreenCanvas({
			name: spriteName,
			position: [ 0, 0 ],
			size: [ 0, 0 ],
		});

		if (canvas.width != offscreenCanvas.width) canvas.width = offscreenCanvas.width;
		if (canvas.height != offscreenCanvas.height) canvas.height = offscreenCanvas.height;

		context.drawImage(offscreenCanvas, 0, 0);

	}

	previousTime = currentTime;
	window.requestAnimationFrame(tick);

}

tick();


window.navigation.addEventListener("navigate", (event) => {

	setTimeout(() => {

		let element:HTMLAnchorElement|null = document.querySelector(location.hash);

		if (!element) return;

		element.style.animation = "highlight 1s linear";

		element.addEventListener("animationend", () => {
			element.style.animation = "";
		});
	}, 100);
})