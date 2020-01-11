import {loadBomb} from './entities/Bomb.js';
import {loadPlayer} from './entities/Player.js';



export function loadEntities(){
    const entityFactories = [];

    function addAs(name){
        return factory => entityFactories[name] = factory;
    }
    return Promise.all([
        loadPlayer().then(addAs('player')),
        loadBomb().then(addAs('bomb'))
    ]).then(()=>entityFactories);
}