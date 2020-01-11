import {createGameLoader} from './loaders.js';
import Timer from './Timer.js';

import {loadEntities} from './entities.js';




async function main(canvas){
    const context = canvas.getContext('2d');

    const [entityFactory] = await Promise.all([loadEntities()]);

    const loadGame = await createGameLoader(entityFactory);
    const game = await loadGame('game');
    game.initialize();
    const timer = new Timer(1/60);

    timer.update = function update(deltaTime){
        game.update(deltaTime);
        game.comp.draw(context);
    }
    timer.start();
}

const canvas = document.getElementById('screen');
main(canvas);