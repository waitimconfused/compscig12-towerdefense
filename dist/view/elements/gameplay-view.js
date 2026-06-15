import { View } from "../view.js";
import { Entity } from "../../entity/entity.js";
import { SpriteRenderer } from "../../sprites.js";
import Engine from "../../engine.js";
import spriteAssets from "../../../assets/sprites.json" with { type: "json" };
import { rulesToFunction } from "../../entity/logic-flow.js";
import { MouseManager } from "../../mouse.js";
import { Wave } from "../../wave.js";
var entityRenderingLookup = new Map;
export default class GameplayView extends View {
    static playSpaceSize = [1000, 750];
    static playSpacePadding = [0, 0];
    gameplayBackground = {
        source: null,
        repetition: "repeat",
        scale: [1, 1]
    };
    entitySpriteLayers = new Map;
    entitySpawnAreas = new Map;
    spawningEntity = null;
    _gameplayPattern = null;
    constructor() {
        super();
    }
    render(canvas, context) {
        super.render(canvas, context, true, false);
        let appropriateScale = Math.min(canvas.width / (GameplayView.playSpaceSize[0] + GameplayView.playSpacePadding[0]), canvas.height / (GameplayView.playSpaceSize[1] + GameplayView.playSpacePadding[1]));
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2);
        context.scale(appropriateScale, appropriateScale);
        context.translate(-GameplayView.playSpaceSize[0] / 2, -GameplayView.playSpaceSize[1] / 2);
        let inverseTransform = context.getTransform().inverse();
        let innerMouse = inverseTransform.transformPoint(new DOMPoint(MouseManager.x, MouseManager.y));
        this.renderGameplayBackground(canvas, context);
        if (this.spawningEntity) {
            context.save();
            context.globalAlpha = 0.5;
            let entityDisplayName = this.spawningEntity.entity.getDisplayName();
            if (this.entitySpawnAreas.has(entityDisplayName) == false) {
                this.entitySpawnAreas.set(entityDisplayName, new Path2D(`M0,0 L${GameplayView.playSpaceSize[0]},0 L${GameplayView.playSpaceSize[0]},${GameplayView.playSpaceSize[1]} L0,${GameplayView.playSpaceSize[1]} L0,0`));
            }
            let path = this.entitySpawnAreas.get(entityDisplayName);
            context.fillStyle = "green";
            context.fill(path);
            context.restore();
        }
        Wave.update(Engine.stats.delta);
        this.renderEntities(canvas, context);
        if (this.spawningEntity) {
            context.save();
            context.globalAlpha = 0.5;
            context.translate(innerMouse.x, innerMouse.y);
            context.scale(0.75, 0.75);
            let sprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
                name: this.spawningEntity.reference,
                position: [0, 0],
                size: [0, 0]
            });
            let rotationSpeed = performance.now() / 1000;
            let minAngle = -Math.PI / 18;
            let maxAngle = Math.PI / 18;
            let angle = 0.5 * ((maxAngle - minAngle) * Math.sin(rotationSpeed) + (maxAngle + minAngle));
            context.rotate(angle);
            context.translate(-sprite.width / 2, 0);
            context.drawImage(sprite, 0, 0);
            context.restore();
            let path = this.entitySpawnAreas.get(this.spawningEntity.entity.getDisplayName());
            let isMouseInsideSpawnArea = context.isPointInPath(path, MouseManager.x, MouseManager.y);
            Engine.cursor = isMouseInsideSpawnArea ? "cell" : "no-drop";
            if (isMouseInsideSpawnArea && MouseManager.buttons.left) {
                MouseManager.buttons.left = false;
                this.spawningEntity.entity.spawn(1, [innerMouse.x, innerMouse.y]);
                this.spawningEntity = null;
            }
        }
        context.restore();
        super.render(canvas, context, false, true);
    }
    renderGameplayBackground(canvas, context) {
        if (!this.gameplayBackground.source)
            return;
        let source = this.gameplayBackground.source;
        if (typeof source == "string") {
            this._gameplayPattern = null;
        }
        if (source instanceof HTMLImageElement && !this._gameplayPattern) {
            this._gameplayPattern = context.createPattern(this.gameplayBackground.source, this.gameplayBackground.repetition);
            let transform = new DOMMatrix;
            transform = transform.scale(this.gameplayBackground.scale[0], this.gameplayBackground.scale[1]);
            this._gameplayPattern.setTransform(transform);
        }
        context.fillStyle = this._gameplayPattern ?? source;
        context.fillRect(0, 0, GameplayView.playSpaceSize[0], GameplayView.playSpaceSize[1]);
    }
    renderEntities(canvas, context) {
        let entities = [...Entity.entities.keys()];
        let hasCarrier = false;
        for (let i = 0; i < entities.length; i++) {
            let entityId = entities[i];
            let entity = Entity.entities.get(entityId);
            if (entity.entityType == "entity/carrier")
                hasCarrier = true;
            entity.tick(Engine.stats.delta);
            if (entity.updateRenderCache || this.entitySpriteLayers.has(entity.id) == false) {
                entity.updateRenderCache = false;
                let spriteRuleset = entityRenderingLookup.get(entity.entityType);
                if (spriteRuleset) {
                    this.entitySpriteLayers.set(entity.id, {
                        layers: spriteRuleset(entity),
                        animation_offset: 0
                    });
                }
            }
            this.renderEntity(entity, canvas, context);
        }
        let savedIds = [...this.entitySpriteLayers.keys()];
        for (let i = 0; i < savedIds.length; i++) {
            let id = savedIds[i];
            if (Entity.entities.has(id))
                continue;
            this.entitySpriteLayers.delete(id);
        }
        if (!hasCarrier)
            Engine.showView("game-over");
    }
    renderEntity(entity, canvas, context) {
        let data = this.entitySpriteLayers.get(entity.id);
        if (!data)
            return;
        let layers = data.layers;
        if (!layers || layers.length == 0)
            return;
        for (let i = 0; i < layers.length; i++) {
            let reference = layers[i];
            if (!reference)
                continue;
            let offscreenSprite = SpriteRenderer.getSpriteAsOffscreenCanvas({
                name: reference.sprite,
                position: [0, 0],
                size: [0, 0],
                animation_offset: data.animation_offset,
                animation_frames: reference.frames
            });
            let flipX = entity.direction > Math.PI / 2;
            let flipY = false;
            context.save();
            context.translate(entity.position[0], entity.position[1]);
            context.translate((reference.origin[0] / 100) * offscreenSprite.width * (flipX ? 1 : -1), (reference.origin[1] / -100) * offscreenSprite.height);
            if (reference?.offset)
                context.translate(reference.offset[0], reference.offset[1]);
            context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
            context.drawImage(offscreenSprite, 0, 0);
            context.restore();
        }
    }
}
for (let i = 0; i < spriteAssets.logic.length; i++) {
    let path = spriteAssets.logic[i];
    path = new URL(path, location.origin + "/assets/").href;
    let { default: data } = await import(path, { with: { type: "json" } });
    let generatedRule = rulesToFunction(data.logic);
    entityRenderingLookup.set(data.type, generatedRule);
}
//# sourceMappingURL=gameplay-view.js.map