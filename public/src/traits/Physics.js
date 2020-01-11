import {Trait} from '../Entity.js';
import { States } from '../Game.js';

export const GRAVITY = 2000;
export default class Physics extends Trait {
    constructor(){
        super('physics');
    }
    update(entity,deltaTime,game){
        if(game.state === States.STOP || game.state === States.END) return ;

        entity.pos.x += entity.vel.x * deltaTime;
        game.checkOut(entity);
        entity.pos.y += entity.vel.y * deltaTime;
            
        game.tileCollider.checkY(entity);
        entity.vel.y += GRAVITY*deltaTime;
    }
}