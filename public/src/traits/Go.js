import {Trait} from '../Entity.js';
export default class Go extends Trait {
    constructor(){
        super('go');

        this.dir = 0;
        this.acceleration = 400;
        this.deceleration = 300;
        this.distance = 0;
        this.dragFactor = 1/5000;
    }
    update(entity,deltaTime){
        if(entity.killable.dead) {
            entity.vel.x=0;
            this.dir = 0;
            return ;
        }
        
        const absX = Math.abs(entity.vel.x);
        if(this.dir){
            entity.vel.x += this.acceleration * this.dir * deltaTime;
        }else if(entity.vel.x !== 0){
            const decel = Math.min(absX,this.deceleration*deltaTime);
            entity.vel.x += entity.vel.x > 0 ? -decel : decel;
        }else{
            this.distance = 0;
        }

        const drag = this.dragFactor * entity.vel.x * absX;
        entity.vel.x -= drag;

        this.distance += absX * deltaTime;
    }
}