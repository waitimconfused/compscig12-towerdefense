import { SpriteRenderer } from "../sprites.js";

const template:HTMLTemplateElement = document.getElementById("sprite") as HTMLTemplateElement;
const output:HTMLDivElement = document.getElementById("sprites") as HTMLDivElement;

var references:string[] = await SpriteRenderer.loadDefaults();
references = references.sort();

var canvases:HTMLCanvasElement[] = [];

for (let i = 0; i < references.length; i ++) {

	let clone:DocumentFragment = document.importNode(template.content, true);

	canvases.push( clone.getElementById("result") as HTMLCanvasElement );

	let name:HTMLParagraphElement = clone.getElementById("name") as HTMLParagraphElement;
	name.innerText = references[i] as string;

	output.appendChild(clone);



}

function tick() {

	for (let i = 0; i < references.length; i ++) {

		let canvas:HTMLCanvasElement = canvases[i] as HTMLCanvasElement;

		let context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
		context.clearRect(0, 0, canvas.width, canvas.height);

		let offscreenCanvas:OffscreenCanvas = SpriteRenderer.getSpriteAsOffscreenCanvas({
			name: references[i] as string,
			position: [ 0, 0 ],
			size: [ 0, 0 ],
		});

		if (canvas.width != offscreenCanvas.width) canvas.width = offscreenCanvas.width;
		if (canvas.height != offscreenCanvas.height) canvas.height = offscreenCanvas.height;

		context.drawImage(offscreenCanvas, 0, 0);

	}

	window.requestAnimationFrame(tick);

}

tick();