import Compositor from './Compositor.js';
import {Matrix} from './math.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import {BOMB_WIDTH} from './entities/Bomb.js';
import {setupKeyBoard} from './input.js';
const BOMB_DURATION = 0.2;
const GAME_WIDTH = 368;

 

export const States = {
    READY1 : Symbol('ready1'),
    READY2 : Symbol('ready2'),
    RUNNING : Symbol('running'),
    STOP : Symbol('stop'),
    END : Symbol('end')
}
export default class Game {
    constructor(entityFactory){
        this.entityFactory = entityFactory;
        this.comp = new Compositor();
        this.entities = new Set();
        this.tiles = new Matrix();
        this.tileCollider = new TileCollider(this.tiles);
        this.entityCollider = new EntityCollider(this.entities);
        this.count = 0;
        this.bombTime = 0;

        this.options = [
            {name : "Home",x:155,y:320},
            {name : "Save",x:162,y:345},
            {name : "Replay",x:152,y:370}
        ]

        this.eventTime = 0;
        this.state = States.READY1;
        this.menuIndex = 0;

        
    }
    initialize(){
        this.entities.clear();
        this.count = this.bombTime = this.eventTime = this.menuIndex = 0;
        this.state = States.READY1;

        const player = this.entityFactory.player();
        player.pos.set(160, 535);

        this.entities.add(player);


        const input = setupKeyBoard(player, this    );
        input.listenTo(window);
    }
    ready(deltaTime){
        this.eventTime += deltaTime;
        if(this.eventTime<=1){
            this.state = States.READY1;
        }else if(this.eventTime <= 1.8){
            this.state = States.READY2;
        }else{
            this.state = States.RUNNING;
            this.eventTime = 0;
        }
    }
    basic(deltaTime){
        this.entities.forEach(entity=>{
            entity.update(deltaTime,this);
            this.entityCollider.check(entity,this);
            this.entities.forEach(entity=>{
                 entity.finalize();
             });
        });
    }
    running(deltaTime){
        
        this.bombTime += deltaTime;

        if(this.bombTime > BOMB_DURATION){
            const entity = this.entityFactory['bomb']();
            entity.pos.set((Math.random()*GAME_WIDTH-BOMB_WIDTH)/BOMB_WIDTH*BOMB_WIDTH, 0);
            this.entities.add(entity);
            this.bombTime = 0;
        }
    }
    end(deltaTime){
        
    }
    update(deltaTime){
        if(this.state === States.END) return ;
        this.basic(deltaTime);
        if(this.state === States.READY1 || this.state === States.READY2) this.ready(deltaTime);
        if(this.state === States.RUNNING) this.running(deltaTime);   
    }
    checkOut(entity){
        if(entity.pos.x+entity.size.x > GAME_WIDTH){
            entity.pos.x = GAME_WIDTH - entity.size.x;
            entity.vel.x = 0;
        }
        if(entity.pos.x < 0){
            entity.pos.x = 0;
            entity.vel.x = 0;
        }
    }
}