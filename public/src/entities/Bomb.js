import Entity, { Trait,Sides } from '../Entity.js';
import {loadSpriteSheet} from '../loaders.js';
import Killable from '../traits/Killable.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import {States} from '../Game.js';
export const BOMB_WIDTH = 19;
export const BOMB_HEIGHT = 19;

export function loadBomb(){
    return loadSpriteSheet('bomb')
    .then(createBombFactory);
    
}
class Behavior extends Trait{
    constructor(){
        super('behavior');
        this.isBottom = false;
        this.count = false;
    }
    collides(us,them,game){
        if(them.sandbag){
            us.vel.y = 0;
            us.killable.kill();
            if(!this.isBottom){
                if(!them.killable.dead){
                    game.state = States.STOP;
                    them.solid.obstructs = true;
                    them.vel.set(100,-400);
                    them.killable.dead = true;
                }
            }
        }
    }
    obstruct(entity,side){
        if(side === Sides.BOTTOM){
            this.isBottom = entity.killable.dead = true;
        }
    }
    update(entity,deltaTime,game){
        if(this.isBottom && !this.count){
            this.queue(()=>{
                this.count = true;
                game.count++;
            });
        }
    }
}
function createBombFactory(spriteSheet){
    const explodeAnim = spriteSheet.animations.get('explode');
    function routeAnim(bomb) {
        if(bomb.killable.dead){
            return explodeAnim(bomb.lifeTime);
        }
        return 'idle';
    }
    function drawBomb(context) {
        spriteSheet.draw(routeAnim(this), context, this.pos.x, this.pos.y);
    }

    return function createBomb(){
        const bomb = new Entity('bomb');
        bomb.addTrait(new Physics());
        bomb.addTrait(new Solid());
        bomb.addTrait(new Killable());
        bomb.addTrait(new Behavior());
        bomb.killable.removeAfter = 0.7;
        bomb.size.set(19,19);
        bomb.draw = drawBomb;
        return bomb;
    }
}