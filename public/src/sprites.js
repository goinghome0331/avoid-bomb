import SpriteSheet from './SpriteSheet.js';
import {loadImage} from './loaders.js';

export function loadPlayerSpriteSheet(){
    return loadImage('/img/robot.png')
    .then((image)=>{
        const spriteSheet = new SpriteSheet(image,16,16);
        spriteSheet.define('idle',2,2,10,14);

        return spriteSheet;
    });   
}
