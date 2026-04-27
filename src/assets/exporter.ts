import { SpriteData } from "../sprites.js";
import { default as SuperGif } from "./libgif.js";

const newSprite: HTMLButtonElement = document.getElementById("new-sprite") as HTMLButtonElement;
const spritesDiv: HTMLDivElement = document.getElementById("sprites") as HTMLDivElement;

const spriteTemplate: HTMLTemplateElement = document.getElementById("sprite-template") as HTMLTemplateElement;

const exportAll: HTMLButtonElement = document.getElementById("export-all") as HTMLButtonElement;
exportAll.disabled = true;

const PADDING = 5;

type SUPER_GIF = {
	play: () => void;
	pause: () => void;
	move_relative: (amount: number) => void;
	move_to: (frame_idx: number) => void;

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
	load_url: (source: string, callback: () => void) => void;
	load: (callback: () => void) => void;
	load_raw: (arr: ImageData[], callback: () => void) => void;
	set_frame_offset: () => void
};

function extractFrames(gif: HTMLImageElement): Promise<ImageData[]> {
	let rub: SUPER_GIF = new SuperGif({ gif }) as SUPER_GIF;

	return new Promise((resolve) => {

		rub.load(() => {
			let frames = rub.get_frames().map((frame) => frame.data);

			rub.get_canvas().remove();

			resolve(frames);
		});

	});
}



class ExportableSprite {

	source: HTMLCanvasElement;

	data: SpriteData = {
		name: "untitled-sprite",
		source: "untitled-sprite.png",

		crop: undefined,
		animation: undefined
	};

	private titleInput: HTMLInputElement;
	private fileInput: HTMLInputElement;
	private jsonOutput: HTMLOutputElement;
	private exporter_image: HTMLButtonElement;
	private exporter_json: HTMLButtonElement;
	private animationType: HTMLSelectElement;
	private animationDuration: HTMLInputElement;

	private index:number;

	private static list:ExportableSprite[] = [];

	constructor() {

		this.index = ExportableSprite.list.length;
		ExportableSprite.list.push(this);



		const clone = document.importNode(spriteTemplate.content, true);

		this.titleInput = clone.getElementById("sprite-name") as HTMLInputElement;
		this.fileInput = clone.querySelectorAll("input")[1] as HTMLInputElement;
		this.source = clone.querySelector("canvas") as HTMLCanvasElement;
		this.jsonOutput = clone.querySelector("output") as HTMLOutputElement;
		this.exporter_image = clone.querySelectorAll("button")[0] as HTMLButtonElement;
		this.exporter_json = clone.querySelectorAll("button")[1] as HTMLButtonElement;
		this.animationType = clone.getElementById("duration-type") as HTMLSelectElement;
		this.animationDuration = clone.getElementById("duration") as HTMLInputElement;

		spritesDiv.appendChild(clone);



		this.exporter_image.addEventListener("click", () => this.exportImage());
		this.exporter_json.addEventListener("click", () => this.exportJson());

		this.data.name = this.titleInput.value || `untitled-sprite-${this.index+1}`;
		this.data.source = `./${this.data.name.replace(/[^a-zA-Z0-9-_]/g, '-')}.png`;
		this.titleInput.placeholder = this.data.name;
		this.jsonOutput.innerText = this.getJsonString();



		this.titleInput.addEventListener("input", () => {
			this.data.name = this.titleInput.value || `untitled-sprite-${this.index+1}`;
			this.data.source = `./${this.data.name.replace(/[^a-zA-Z0-9-_]/g, '-')}.png`;
			this.jsonOutput.innerText = this.getJsonString();
		});

		let context: CanvasRenderingContext2D = this.source.getContext("2d") as CanvasRenderingContext2D;
		this.source.width = this.jsonOutput.offsetWidth;
		this.source.height = this.jsonOutput.offsetHeight;

		context.fillStyle = "black";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "24px monospace"
		context.fillText("No source provided.", this.source.width/2, this.source.height/2);


		this.fileInput.addEventListener('change', async (event) => {
			this.exporter_image.disabled = true;
			this.exporter_json.disabled = true;

			let target: HTMLInputElement = event.target as HTMLInputElement;
			let files = target.files;

			if (!files || files.length == 0) return;

			let image = await ExportableSprite.uploadSource(files[0] as File);

			if (image.src.startsWith("data:image/gif")) {
				document.body.appendChild(image);

				let frames = await extractFrames(image);

				this.exporter_image.disabled = false;
				this.exporter_json.disabled = false;
				exportAll.disabled = false;

				this.source.width = frames.length * (PADDING + (frames[0]?.width ?? 0));
				this.source.height = frames[0]?.height ?? 0;

				this.data.animation = {
					duration: undefined,
					frame_duration: undefined,
					offset: undefined,
					frames: []
				};

				if (this.animationDuration.parentElement) this.animationDuration.parentElement.style.display = "";

				for (let i = 0; i < frames.length; i++) {

					this.data.animation.frames.push({
						source: undefined,
						crop: {
							x: i * (PADDING + (frames[0]?.width ?? 0)),
							y: 0,
							w: frames[0]?.width ?? 0,
							h: frames[0]?.height ?? 0
						}
					})

					context.putImageData(
						frames[i] as ImageData,
						i * (PADDING + (frames[0]?.width ?? 0)),
						0
					);

				}
			} else {
				this.exporter_image.disabled = false;
				this.exporter_json.disabled = false;
				exportAll.disabled = false;

				this.source.width = image.width;
				this.source.height = image.height;

				let context: CanvasRenderingContext2D = this.source.getContext("2d") as CanvasRenderingContext2D;
				context.drawImage(image, 0, 0);
			}

			this.updateAnimation(); // Function also updates jsonOutput.innerText

		});

		this.animationType.addEventListener("input", () => this.updateAnimation());

		this.animationDuration.addEventListener("input", () => this.updateAnimation());
	}

	public updateAnimation() {
		if (!this.data.animation) return;

		switch (this.animationType.value) {
			case "total":
				this.data.animation.duration = this.animationDuration.valueAsNumber || 100 * this.data.animation.frames.length;
				this.data.animation.frame_duration = undefined;
				this.jsonOutput.innerText = this.getJsonString();
				break;

			case "frame":
				this.data.animation.duration = undefined;
				this.data.animation.frame_duration = this.animationDuration.valueAsNumber || 100;
				this.jsonOutput.innerText = this.getJsonString();
				break;

			default:
				break;
		}
	}

	public export() {
		this.exportImage();
		this.exportJson();
	}

	private exportImage() {
		let url = this.source.toDataURL("image/png").replace("image/png", "image/octet-stream");

		let imageLink: HTMLAnchorElement = document.createElement("a");
		imageLink.setAttribute('download', `${this.data.name.replace(/[^a-zA-Z0-9-_]/g, '-')}.png`);
		imageLink.setAttribute('href', url);
		imageLink.click();
	}

	private exportJson() {
		let link: HTMLAnchorElement = document.createElement("a");

		let data = this.getJsonString();

		let blob: Blob = new Blob([data], { type: "octet/stream" });
		let url: string = window.URL.createObjectURL(blob);

		link.href = url;
		link.download = `${this.data.name}.json`;
		link.click();

		window.URL.revokeObjectURL(url);
	}

	getJsonString():string {
		return JSON.stringify(this.data, null, "\t")
			.replaceAll(
				/{\n\t\t\t\t"crop": {\n\t\t\t\t\t"x": (\d*),\n\t\t\t\t\t"y": (\d*),\n\t\t\t\t\t"w": (\d*),\n\t\t\t\t\t"h": (\d*)\n\t\t\t\t}\n\t\t\t}/gm,
				`{ "crop": { "x": $1, "y": $2, "w": $3, "h": $4 } }`
			);
	}

	private static uploadSource(file: File): Promise<HTMLImageElement> {
		return new Promise((resolve) => {
			var reader: FileReader = new FileReader();

			reader.addEventListener("load", (progressEvent: ProgressEvent<FileReader>) => {
				let image = new Image;

				let fileReader = progressEvent.target;
				image.src = fileReader?.result as string;

				image.addEventListener("load", () => {
					resolve(image);
				});

			});

			reader.readAsDataURL(file);
		});
	}

	public static compressAll() {

		let canvasPackage: HTMLCanvasElement = document.createElement("canvas");
		let contextPackage: CanvasRenderingContext2D = canvasPackage.getContext("2d") as CanvasRenderingContext2D;

		canvasPackage.width = this.list[0]?.source?.width ?? 0;
		canvasPackage.height = 0;

		for (let i = 0; i < this.list.length; i++) {
			canvasPackage.width = Math.max(canvasPackage.width, this.list[i]?.source?.width ?? Infinity);
			canvasPackage.height += this.list[i]?.source?.height ?? 0;
			canvasPackage.height += PADDING;
		}

		let duplicatedSpriteData:SpriteData[] = structuredClone(this.list.map( (exportable) => exportable.data ));
		
		let y = 0;

		for (let i = 0; i < this.list.length; i++) {
			let canvas: HTMLCanvasElement = this.list[i]?.source as HTMLCanvasElement;

			contextPackage.drawImage(canvas, 0, y);

			(duplicatedSpriteData[i] as SpriteData).source = "./sprite-collection.png";

			(duplicatedSpriteData[i] as SpriteData).crop = {
				x: duplicatedSpriteData[i]?.crop?.x ?? 0,
				y: (duplicatedSpriteData[i]?.crop?.y ?? 0) + y,
				w: duplicatedSpriteData[i]?.crop?.w || canvas.width,
				h: duplicatedSpriteData[i]?.crop?.h || canvas.height
			}

			let frames = duplicatedSpriteData[i]?.animation?.frames;

			if (frames) for ( let i = 0; i < frames.length; i ++ ) {
				(frames[i] as SpriteData).crop = {
					x: frames[i]?.crop?.x ?? 0,
					y: (frames[i]?.crop?.y ?? 0) + y,
					w: frames[i]?.crop?.w ?? canvas.width,
					h: frames[i]?.crop?.h ?? canvas.height
				}
			}

			y += canvas.height + PADDING;
		}

		return {
			source: canvasPackage,
			data: duplicatedSpriteData
		}

	}

	public static exportAll() {
		exportAll.disabled = true;

		let data = ExportableSprite.compressAll();

		let jsonString = JSON.stringify(data.data, null, "\t")
		.replaceAll(
			/{\n\t\t\t\t\t"crop": {\n\t\t\t\t\t\t"x": (\d*),\n\t\t\t\t\t\t"y": (\d*),\n\t\t\t\t\t\t"w": (\d*),\n\t\t\t\t\t\t"h": (\d*)\n\t\t\t\t\t}\n\t\t\t\t}/gm,
			`{ "crop": { "x": $1, "y": $2, "w": $3, "h": $4 } }`
		);

		let href = data.source.toDataURL("image/png").replace("image/png", "image/octet-stream");

		let blob: Blob = new Blob([jsonString], { type: "octet/stream" });
		let url: string = window.URL.createObjectURL(blob);

		let jsonLink: HTMLAnchorElement = document.createElement("a");
		jsonLink.href = url;
		jsonLink.download = "sprite-collection.json";
		jsonLink.click();

		window.URL.revokeObjectURL(url);

		let imageLink: HTMLAnchorElement = document.createElement("a");
		imageLink.setAttribute('download', "sprite-collection.png");
		imageLink.setAttribute('href', href);
		imageLink.click();

		exportAll.disabled = false;
	}


}




newSprite.addEventListener("click", () => new ExportableSprite() );

exportAll.addEventListener("click", ExportableSprite.exportAll);

new ExportableSprite();