import { Ant } from "./enemy.types/ant";
import { Frog } from "./enemy.types/frog";
import { Raccoon } from "./enemy.types/raccoon";
import { Wasp } from "./enemy.types/wasp";
import { SpriteRenderer } from "./sprites";
import { RenderingContext } from "./types";


export class EnemyController {

    render (enemyEntity : Raccoon | Ant | Wasp | Frog, canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteName = enemyEntity.render();

        // Draws a sprite using the current sprite reference, position, and sprite size
        SpriteRenderer.drawSprite({
            name: 'hey',
            position: enemyEntity.position,
            size: [ 0, 0 ]
        }, context,)
    }
}