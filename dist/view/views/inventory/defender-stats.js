import Engine from "../../../engine.js";
import { DefenderEntity } from "../../../entity/defender.js";
import { Entity } from "../../../entity/entity.js";
import { SpriteRenderer } from "../../../sprites.js";
import { ViewSprite } from "../../elements/sprite.js";
import { ViewText } from "../../elements/text.js";
import { ViewElementCollection } from "../../view-element-collection.js";
import { View } from "../../view.js";
import { book, tab_defenderStats } from "../inventory.js";
const view = new View;
view.addEventListener("show", () => {
    tab_defenderStats.reference = "tab-defender-active";
});
view.addEventListener("hide", () => {
    tab_defenderStats.reference = "tab-defender";
});
view.addElement(new ViewText("Defender Stats")
    .setAnchor(Engine.anchorPresets.centerCenter)
    .setTranslation(-book.size[0] / 2 + 100, -book.size[1] / 2 + 100)
    .setRotation(3, "deg")
    .setAlignment("left", "top")
    .setFont("Preahvihear", 65)
    .setStroke("none")
    .setFill("black"));
class Section extends ViewElementCollection {
    _anchor = Engine.anchorPresets.topLeft;
    _position = [0, 0];
    get position() {
        let anchorPosition = Engine.resolveAnchor(this._anchor);
        return {
            raw: [this._position[0], this._position[1]],
            anchor: [this._position[0], this._position[1]],
            final: [anchorPosition[0] + this._position[0], anchorPosition[1] + this._position[1]]
        };
    }
    setTranslation(x, y) {
        this._position = [x, y];
        return this;
    }
    setAnchor(anchor) {
        if (!anchor)
            anchor = Engine.anchorPresets.topLeft;
        if (Object.values(Engine.anchorPresets).includes(anchor) == false) {
            console.error(`ViewElement cannot be anchored to an unknown anchor "${anchor.resolver.toString()}".`);
            return this;
        }
        this._anchor = anchor;
        return this;
    }
    render(canvas, context) {
        context.save();
        context.translate(this.position.final[0], this.position.final[1]);
        SpriteRenderer.drawSprite({
            name: "paper",
            position: [0, 0],
            size: [0, 0]
        }, context);
        super.render(canvas, context);
        context.restore();
    }
}
const enemyCards = new ViewElementCollection;
view.addElement(enemyCards);
view.addEventListener("show", () => {
    while (enemyCards.children.length)
        enemyCards.removeElement(enemyCards.children[0]);
    let enemyTypes = [...Entity.derived.keys()];
    let positions = [
        [-550, -200],
        [-300, -200],
        [-550, 50],
        [-300, 50]
    ];
    let positionIndex = 0;
    for (let i = 0; i < enemyTypes.length; i++) {
        let type = enemyTypes[i];
        let constructor = Entity.derived.get(type);
        if (constructor.prototype instanceof DefenderEntity == false)
            continue;
        let card = new Section;
        enemyCards.addElement(card);
        card.setAnchor(Engine.anchorPresets.centerCenter);
        let position = positions[positionIndex];
        positionIndex += 1;
        positionIndex %= positions.length;
        card.setTranslation(position[0], position[1]);
        card.addElement(new ViewText(type)
            .setTranslation(219 / 2, 231 - 32)
            .setRotation(-2, "deg")
            .setFont("Gamja Flower", 40)
            .setAlignment("center", "bottom")
            .setFill("black")
            .setStroke("none"));
        card.addElement(new ViewSprite(type)
            .setTranslation(219 / 2, 231 - 32)
            .setRotation(-2, "deg"));
    }
});
export default view;
//# sourceMappingURL=defender-stats.js.map