import {Trait} from '../Entity.js';
import { States } from '../Game.js';
const  DEAD_DURATION = 2;
export default class Killable extends Trait {
    constructor(){
        super('killable');
        this.dead = false; 
        this.deadTime = 0;
        this.removeAfter = DEAD_DURATION;
    }
    
    kill(){
        this.dead = true;
    }
    update(entity,deltaTime,game){
        if(this.dead){
            this.deadTime += deltaTime;
            if(this.deadTime > this.removeAfter){
                this.queue(()=>{
                    game.entities.delete(entity);
                    if(entity.NAME === 'player')
                        game.state = States.END;
                })
            }
        }
    }

}