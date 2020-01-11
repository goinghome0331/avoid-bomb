import {Vec2} from './math.js';
import BoundingBox from './BoundingBox.js';
export const Sides = {
    TOP : Symbol('top'),
    BOTTOM : Symbol('bottom')
};
export class Trait {
    constructor(name){
        this.NAME = name;
        this.tasks = [];
    }
    update(){

    }
    collides(us,them){

    }
    obstruct(){

    }
    finalize(){
        this.tasks.forEach(task=>task());
        this.tasks.length = 0;
    }
    queue(task){
        this.tasks.push(task);
    }
}
export default class Entity{
    constructor(name){
        this.NAME = name;
        this.canCollide = true;
        this.pos = new Vec2(0,0);
        this.vel = new Vec2(0,0);
        this.size = new Vec2(0,0);
        this.offset = new Vec2(0,0);
        this.bounds = new BoundingBox(this.pos,this.size,this.offset);
        this.traits = [];
        this.lifeTime = 0;
    }

    addTrait(trait){
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(side,match){
        this.traits.forEach(trait=>{
            trait.obstruct(this,side,match);
        });
    }
    collides(candidate,game){
        this.traits.forEach(trait=>{
            trait.collides(this,candidate,game);
        });
    }
    update(deltaTime,game){
        this.traits.forEach(trait=>{
            trait.update(this,deltaTime,game);
        });
        this.lifeTime += deltaTime;
    }
    finalize(){
        this.traits.forEach(trait=>{
            trait.finalize();
        });
    }
}