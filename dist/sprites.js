import { StaticClass } from "./types.js";
import spriteAssets from "../assets/sprites.json" with { type: "json" };
export class SpriteRenderer extends StaticClass {
    static verbose = true;
    static registeredSprites = new Map();
    static images = {};
    static isRegistered(reference) {
        return this.registeredSprites.has(reference);
    }
    static registerData(data) {
        if (this.verbose)
            console.groupCollapsed(`Creating sprite: "${data.name}"`);
        if (this.registeredSprites.has(data.name)) {
            if (this.verbose)
                console.error(`Cannot have multiple sprites of the same name "${data.name}".`);
            if (this.verbose)
                console.groupEnd();
            return null;
        }
        if (typeof data.source == "string") {
            let src = data.source;
            if (src in this.images == false) {
                this.images[src] = new Image;
                this.images[src].src = src;
                if (this.verbose)
                    console.log(`Loading image from "${src}".`);
            }
            else {
                if (this.verbose)
                    console.log(`Using preloaded image "${src}".`);
            }
            data.source = this.images[src];
        }
        else if (data.source.src in this.images == false) {
            this.images[data.source.src] = data.source;
        }
        if (data?.animation != null) {
            if (!data.animation?.duration && !data.animation?.frame_duration) {
                if (this.verbose)
                    console.warn("Animation%c duration%c and%c frame_duration%c unset. Will default to%c 100ms/frame%c.", "font-style: italic; font-weight: bold", "", "font-style: italic; font-weight: bold", "", "font-style: italic; font-weight: bold", "");
            }
            else if (data.animation?.duration && data.animation?.frame_duration) {
                if (this.verbose)
                    console.warn("Animation%c duration%c and%c frame_duration%c are both set. Will default to%c duration%c.", "font-style: italic; font-weight: bold", "", "font-style: italic; font-weight: bold", "", "font-style: italic; font-weight: bold", "");
            }
            for (let i = 0; i < data.animation.frames.length; i++) {
                let frame = data.animation.frames[i];
                if (!frame?.source)
                    continue;
                if (frame?.source instanceof HTMLImageElement)
                    continue;
                let src = frame.source;
                if (src in this.images == false) {
                    this.images[src] = new Image;
                    this.images[src].src = src;
                    if (this.verbose)
                        console.log(`Loading image from "${src} for frame #${i + 1}".`);
                }
                else {
                    if (this.verbose)
                        console.log(`Using preloaded image "${src}" for frame #${i + 1}".`);
                }
                frame.source = this.images[src];
            }
        }
        this.registeredSprites.set(data.name, data);
        if (this.verbose)
            console.log("Sprite has been registered.");
        if (this.verbose)
            console.groupEnd();
        return data;
    }
    static getData(reference, forced_time) {
        if (this.registeredSprites.has(reference.name) == false) {
            console.error(`Failed to find SpriteData with name "${reference.name}".`);
            return null;
        }
        let data = this.registeredSprites.get(reference.name);
        if (data.source instanceof HTMLImageElement == false) {
            console.error(`Sprite "${data.name}"'s source was loaded incorrectly.`);
            return null;
        }
        let image = data.source;
        let crop = data?.crop ?? { x: 0, y: 0, w: image.width, h: image.height };
        if (!data?.animation)
            return { image, crop };
        let frameCount = reference?.animation_frames?.length ?? data.animation.frames.length;
        let duration = (data.animation?.duration
            || (data.animation?.frame_duration
                || 100) * frameCount);
        let speed = duration / frameCount;
        let offset = data.animation?.offset ?? 0;
        offset += reference.animation_offset ?? 0;
        let currentTime = forced_time ?? performance.now();
        let frameIndex = (currentTime - offset) / speed;
        frameIndex = Math.floor(frameIndex);
        frameIndex = frameIndex % frameCount;
        if (reference?.animation_frames)
            frameIndex = reference.animation_frames[frameIndex];
        let frame = data.animation.frames[frameIndex];
        if (reference.animation_frames) {
            let realFrameIndex = reference.animation_frames[frameIndex];
            frame = data.animation.frames[realFrameIndex];
        }
        if (frame?.source)
            image = frame.source;
        crop = frame?.crop ?? { x: 0, y: 0, w: image.width, h: image.height };
        return { image, crop };
    }
    static drawSprite(reference, context, forced_time) {
        let data = this.getData(reference, forced_time);
        if (!data)
            return;
        context.drawImage(data.image, data.crop.x, data.crop.y, data.crop.w, data.crop.h, reference.position[0], reference.position[1], reference.size[0] || data.crop.w, reference.size[1] || data.crop.h);
    }
    static getSpriteAsOffscreenCanvas(reference, forced_time) {
        let data = this.getData(reference, forced_time);
        if (!data)
            return new OffscreenCanvas(reference.size[0], reference.size[1]);
        let offscreenCanvas = new OffscreenCanvas(reference.size[0] || (data?.crop.w ?? 100), reference.size[1] || (data?.crop.h ?? 100));
        let context = offscreenCanvas.getContext("2d");
        context.drawImage(data.image, data.crop.x, data.crop.y, data.crop.w, data.crop.h, reference.position[0], reference.position[1], reference.size[0] || data.crop.w, reference.size[1] || data.crop.h);
        return offscreenCanvas;
    }
    static getAllSprites() {
        return this.registeredSprites.keys();
    }
    static loadDefaults() {
        return new Promise(async (resolve) => {
            let references = [];
            let imagePaths = [];
            let loadedImageCount = 0;
            for (let i = 0; i < spriteAssets.assets.length; i++) {
                let path = spriteAssets.assets[i];
                path = new URL(path, location.origin + "/assets/").href;
                let spriteData = await import(path, { with: { type: "json" } });
                let imported = spriteData?.default;
                if (Array.isArray(imported)) {
                    for (let i = 0; i < imported.length; i++) {
                        let rawData = imported[i];
                        rawData.source = new URL(rawData.source, path).href;
                        let data = SpriteRenderer.registerData(rawData);
                        if (data == null)
                            continue;
                        references.push(data.name);
                        if (imagePaths.includes(rawData.source))
                            continue;
                        imagePaths.push(rawData.source);
                        let sourceImage = data.source;
                        sourceImage.addEventListener("load", () => {
                            loadedImageCount += 1;
                            if (loadedImageCount <= imagePaths.length)
                                return;
                            resolve(references);
                        });
                    }
                }
                else {
                    imported.source = new URL(imported.source, path).href;
                    let data = SpriteRenderer.registerData(imported);
                    if (data == null)
                        continue;
                    if (imagePaths.includes(imported.source))
                        continue;
                    imagePaths.push(imported.source);
                    let sourceImage = data.source;
                    sourceImage.addEventListener("load", () => {
                        loadedImageCount += 1;
                        if (loadedImageCount <= imagePaths.length)
                            return;
                        resolve(references);
                    });
                    references.push(imported.name);
                }
            }
            console.log(`Loading ${references.length} sprites, with ${imagePaths.length} images`);
            resolve(references);
        });
    }
}
;
//# sourceMappingURL=sprites.js.map