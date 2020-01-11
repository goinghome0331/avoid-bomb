import {Trait, Sides} from '../Entity.js';
export default class Solid extends Trait {
    constructor(){
        super('solid');
        this.obstructs = false;
    }
    obstruct(entity,side,match){
        if(this.obstructs) return ;
        if(side === Sides.BOTTOM){
            entity.bounds.bottom = match.y1;
            entity.vel.y = 0;
        }
    }
}