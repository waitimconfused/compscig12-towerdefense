/**import all the sprites, rendering context and view */
import { SpriteRenderer } from "./sprites.js";
import { RenderingContext } from "./types.js";
import { Cherry } from "./defender.types/cherry.js";
import { Sandwich } from "./defender.types/sandwich.js";
import { Strawberry } from "./defender.types/strawberry.js";
import { Corn } from "./defender.types/corn.js";
import { Banana } from "./defender.types/banana.js";
import { View } from "./view.js";

class defenderController {
    render (defenderEntity : Cherry | Sandwich | Strawberry | Corn | Banana, canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteName = defenderEntity.render();

        // Draws a sprite using the current sprite reference, position, and sprite size
        SpriteRenderer.drawSprite({
            name: 'defender',
            position: defenderEntity.position,
            size: [ 0, 0 ];
        }, context,)
    }
}

export {defenderController};