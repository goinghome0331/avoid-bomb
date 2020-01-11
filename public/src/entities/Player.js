import Entity from '../Entity.js';
import Go from '../traits/Go.js';
import {loadSpriteSheet} from '../loaders.js';
import Sandbag from '../traits/Sandbag.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';

export function loadPlayer(){
    return loadSpriteSheet('player')
    .then(createPlayerFactory)
    
}

function createPlayerFactory(spriteSheet){
    const runAnim = spriteSheet.animations.get('run');

    function routeAnim(player) {
        if (player.go.dir != 0) {
            return runAnim(player.go.distance);
        }
        return 'idle';
    }
    function drawPlayer(context) {
        spriteSheet.draw(routeAnim(this), context, this.pos.x, this.pos.y, this.go.dir > 0);
    }
    

    return function createPlayer(){
        const player = new Entity('player');
        player.size.set(35, 55);
        player.addTrait(new Physics());
        player.addTrait(new Solid());
        player.addTrait(new Go());
        player.addTrait(new Sandbag());
        player.addTrait(new Killable());
        player.killable.removeAfter = 1;
        player.draw = drawPlayer;
        return player;
    }
}