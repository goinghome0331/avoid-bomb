import {Trait} from '../Entity.js';
import { States } from '../Game.js';
import {GRAVITY} from './Physics.js';
export default class Sandbag extends Trait {
    constructor(){
        super('sandbag');
    }

    update(entity,deltaTime,game){
        if(game.state === States.STOP){
            entity.pos.y += entity.vel.y * deltaTime;
            
            game.tileCollider.checkY(entity);
            entity.vel.y += GRAVITY*deltaTime;
        }
    }
}