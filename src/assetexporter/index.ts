import { SpriteData } from "../sprites.js";
import { default as SuperGif } from "./libgif.js";

const newSprite:HTMLButtonElement = document.getElementById("new-sprite") as HTMLButtonElement;
const spritesDiv:HTMLDivElement = document.getElementById("sprites") as HTMLDivElement;

const exportAll:HTMLButtonElement = document.getElementById("export-all") as HTMLButtonElement;
exportAll.disabled = true;

const PADDING = 5;

var allJsonData:SpriteData[] = [];
var allImages:HTMLCanvasElement[] = [];

newSprite.addEventListener("click", () => {

	let section:HTMLElement = document.createElement("section");
	spritesDiv.appendChild(section);

	let div:HTMLDivElement = document.createElement("div");
	section.appendChild(div);
	
	let title:HTMLInputElement = document.createElement("input");
	title.type = "text";
	title.placeholder = "Sprite Name";
	div.appendChild(title);

	let file:HTMLInputElement = document.createElement("input");
	file.type = "file";
	file.id = `sprite-${spritesDiv.children.length}`;
	file.accept = "image/png image/gif";
	div.appendChild(file);

	let divider1:HTMLDivElement = document.createElement("div");
	divider1.classList.add("divider");
	section.appendChild(divider1);



	let canvas:HTMLCanvasElement = document.createElement("canvas");
	section.appendChild(canvas);

	let exportImage:HTMLButtonElement = document.createElement("button");
	exportImage.innerText = "Export Source Image";
	exportImage.disabled = true;
	section.appendChild(exportImage);

	exportImage.addEventListener("click", () => {
		
		let link:HTMLAnchorElement = document.createElement("a");
		link.setAttribute('download', `${title.value || "untitled-sprite"}.png`);
		link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
		link.click();

	});

	let divider2:HTMLDivElement = document.createElement("div");
	divider2.classList.add("divider");
	section.appendChild(divider2);



	let output:HTMLOutputElement = document.createElement("output");
	section.appendChild(output);

	let exportJson:HTMLButtonElement = document.createElement("button");
	exportJson.innerText = "Export JSON Data";
	exportJson.disabled = true;
	section.appendChild(exportJson);

	exportJson.addEventListener("click", () => {
		
		let link:HTMLAnchorElement = document.createElement("a");

		let data = output.innerText;
		console.log(data);

		let blob:Blob = new Blob([output.innerText], {type: "octet/stream"});
		let url:string = window.URL.createObjectURL(blob);

		link.href = url;
		link.download = `${title.value || "untitled-sprite"}.json`;
		link.click();

		window.URL.revokeObjectURL(url);

	});


	sprite(title, file, canvas, output, exportImage, exportJson);

});


function sprite(
	title:HTMLInputElement,
	file:HTMLInputElement,
	canvas:HTMLCanvasElement,
	output:HTMLOutputElement,
	exportImage:HTMLButtonElement,
	exportJson:HTMLButtonElement
):void {
	
	let index = allJsonData.length;

	let section:HTMLElement = canvas.parentElement as HTMLElement;

	let jsonData:SpriteData = {
		name: "",
		source: "",
		crop: undefined,
		animation: undefined
	};

	jsonData.name = title.value || `untitled-sprite-${index+1}`;
	jsonData.source = `./${ jsonData.name }.png`;

	title.addEventListener("input", () => {
		jsonData.name = title.value || `untitled-sprite-${index+1}`;
		jsonData.source = `./${ jsonData.name }.png`;
		output.innerText = JSON.stringify(jsonData, null, "\t");
	})

	allJsonData[index] = jsonData;
	allImages[index] = canvas;
	output.innerText = JSON.stringify(jsonData, null, "\t")
		.replaceAll(
			/{\n\t\t\t\t"crop": {\n\t\t\t\t\t"x": (\d*),\n\t\t\t\t\t"y": (\d*),\n\t\t\t\t\t"w": (\d*),\n\t\t\t\t\t"h": (\d*)\n\t\t\t\t}\n\t\t\t}/gm,
			`{ "x": $1, "y": $2, "w": $3, "h": $4 }`
		);

	file.addEventListener('change', (event) => {
		exportImage.disabled = true;
		exportJson.disabled = true;

		let target:HTMLInputElement = event.target as HTMLInputElement;
		let files = target.files;

		if (!files || files.length == 0) return;

		var reader:FileReader = new FileReader();

		reader.addEventListener("load", (progressEvent:ProgressEvent<FileReader>) => {
			let image = new Image;

			let fileReader = progressEvent.target;
			image.src = fileReader?.result as string;

			image.addEventListener("load", async () => {

				if (image.src.startsWith("data:image/gif")) {
					section.appendChild(image);
				
					let frames = await extractFrames(image);

					exportImage.disabled = false;
					exportJson.disabled = false;
					exportAll.disabled = false;

					canvas.width = (frames[0]?.width??0) * frames.length;
					canvas.height = (frames[0]?.height??0);

					let context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

					jsonData.animation = {
						duration: undefined,
						frame_duration: 0,
						offset: undefined,
						frames: []
					}

					for (let i = 0; i < frames.length; i ++) {

						jsonData.animation.frames.push({
							source: undefined,
							crop: {
								x: i * ( PADDING + (frames[0]?.width ?? 0) ),
								y: 0,
								w: frames[0]?.width ?? 0,
								h: frames[0]?.height ?? 0
							}
						})

						context.putImageData(
							frames[i] as ImageData,
							i*(frames[0]?.width??0),
							0
						);

					}
				} else {
					exportImage.disabled = false;
					exportJson.disabled = false;
					exportAll.disabled = false;

					canvas.width = image.width;
					canvas.height = image.height;

					let context:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
					context.drawImage(image, 0, 0);
				}

				allJsonData[index] = jsonData;
				output.innerText = JSON.stringify(jsonData, null, "\t")
					.replaceAll(
						/{\n\t\t\t\t"crop": {\n\t\t\t\t\t"x": (\d*),\n\t\t\t\t\t"y": (\d*),\n\t\t\t\t\t"w": (\d*),\n\t\t\t\t\t"h": (\d*)\n\t\t\t\t}\n\t\t\t}/gm,
						`{ "x": $1, "y": $2, "w": $3, "h": $4 }`
					);

			});

		})

		reader.readAsDataURL( files[0] as File );     
	}, false);

}

exportAll.addEventListener("click", () => {
		
	let jsonLink:HTMLAnchorElement = document.createElement("a");

	let data = JSON.stringify(allJsonData, null, "\t")
		.replaceAll(
			/{\n\t\t\t\t\t"crop": {\n\t\t\t\t\t\t"x": (\d*),\n\t\t\t\t\t\t"y": (\d*),\n\t\t\t\t\t\t"w": (\d*),\n\t\t\t\t\t\t"h": (\d*)\n\t\t\t\t\t}\n\t\t\t\t}/gm,
			`{ "x": $1, "y": $2, "w": $3, "h": $4 }`
		);

	let blob:Blob = new Blob([data], {type: "octet/stream"});
	let url:string = window.URL.createObjectURL(blob);
	
	jsonLink.href = url;
	jsonLink.download = "sprite-collection.json";
	jsonLink.click();

	window.URL.revokeObjectURL(url);

	let canvasPackage:HTMLCanvasElement = document.createElement("canvas");
	let contextPackage:CanvasRenderingContext2D = canvasPackage.getContext("2d") as CanvasRenderingContext2D;

	canvasPackage.width = allImages[0]?.width ?? 0;
	canvasPackage.height = 0;

	for (let i = 0; i < allImages.length; i ++) {
		canvasPackage.width = Math.max( canvasPackage.width, allImages[i]?.width ?? Infinity );
		canvasPackage.height += allImages[i]?.height ?? 0;
	}

	let y = 0;

	for (let i = 0; i < allImages.length; i ++) {
		let canvas:HTMLCanvasElement = allImages[i] as HTMLCanvasElement;
		
		contextPackage.drawImage(canvas, 0, y);

		y += canvas.height + PADDING;

	}

	let imageLink:HTMLAnchorElement = document.createElement("a");
	imageLink.setAttribute('download', "sprite-collection.png");
	imageLink.setAttribute('href', canvasPackage.toDataURL("image/png").replace("image/png", "image/octet-stream"));
	imageLink.click();


});

type SUPER_GIF = {
	play: () => void;
	pause: () => void;
	move_relative: (amount:number) => void;
	move_to: (frame_idx:number) => void;

	// getters for instance vars
	get_playing: () => boolean;
	get_canvas: () => HTMLCanvasElement;
	get_canvas_scale: () => number;
	get_loading: () => boolean;
	get_auto_play: () => boolean;
	get_length: () => number;
	get_frames: () => { data: ImageData, delay: 12 }[];
	get_duration: () => number;
	get_duration_ms: () => number;
	get_current_frame: () => ImageData;
	load_url: ( source:string, callback:()=>void ) => void;
	load: (callback:()=>void) => void;
	load_raw: (arr:ImageData[], callback:()=>void) => void;
	set_frame_offset: () => void
};

function extractFrames(gif:HTMLImageElement):Promise<ImageData[]> {
	let rub:SUPER_GIF = new SuperGif({ gif }) as SUPER_GIF;

	return new Promise( (resolve) => {

		rub.load( () => {
			let frames = rub.get_frames().map( (frame) => frame.data );

			rub.get_canvas().remove();

			resolve(frames);
		} );

	} );
}