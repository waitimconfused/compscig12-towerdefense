/**import all the sprites, rendering context and view */
import { SpriteRenderer } from "./sprites.js";
import { RenderingContext } from "./types.js";
import { Cherry } from "./defender.types/cherry.js";
import { Sandwich } from "./defender.types/sandwich.js";
import { Strawberry } from "./defender.types/strawberry.js";
import { Corn } from "./defender.types/corn.js";
import { Banana } from "./defender.types/banana.js";
import { View } from "./view.js";
import { DefenderEntity } from "./defenderentity.js";
import GameplayView from "./gameplay-view.js";

class defenderController {
    private _defenderModel : DefenderEntity;
    private _gameImage : GameplayView;
    
    private _canvas : HTMLCanvasElement;
    private _ctx : CanvasRenderingContext2D;
    
    render (defenderEntity : Cherry | Sandwich | Strawberry | Corn | Banana, canvas : OffscreenCanvas, context : RenderingContext) : void {
        let spriteName = defenderEntity.render();

        // Draws a sprite using the current sprite reference, position, and sprite size
        SpriteRenderer.drawSprite({
            name: 'defender',
            position: defenderEntity.position,
            size: [ 0, 0 ];
        }, context,)
    }

    constructor(x : number, y : number, width : number, height : number, 
        speed : number, direction : string, filename : string, canvas : HTMLCanvasElement){
        super (x,y,width,height)
        //creates the player
        this._playerModel = new PlayerModel (x,y,width,height,speed,direction);
        //creates the player's image
        this._gameImage = new GameImage (filename, this._playerModel);

        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    }
}

export {defenderController};