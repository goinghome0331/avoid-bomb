import Game from "./Game.js";
import {createBackgroundLayer,createSpriteLayer,createCollisionLayer,createDashboardLayer, createReadyLayer, createMenuLayer} from './layers.js';
import SpriteSheet from './SpriteSheet.js';
import { createAnim } from "./anim.js";
import {loadFont} from './font.js';

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}
function loadJSON(url){
    return fetch(url)
    .then(r=>r.json());
}
function createTiles(game,backgrounds){
    function applyRange(background, xStart, xLen, yStart, yLen){
        const xEnd = xStart + xLen;
        const yEnd = yStart + yLen;

        for (let x = xStart; x < xEnd; x++) {
            for (let y = yStart; y < yEnd; y++) {
                game.tiles.set(x, y, {
                    name: background.name,
                    type : background.type,
                })
            }
        }
    }
    backgrounds.forEach(background=>{
        background.ranges.forEach(range=>{
            if(range.length === 4){
                const [xStart,xLen,yStart,yLen]  = range;
                applyRange(background,xStart,xLen,yStart,yLen);
            }else if(range.length === 3){
                const [xStart, xLen, yStart] = range;
                applyRange(background,xStart,xLen,yStart,1);
            }else if(range.length === 2){
                const [xStart, yStart] = range;
                applyRange(background,xStart,1,yStart,1);
            }
        });
    });
}    
export function createGameLoader(entityFactory){
    return function loadGame(name) {
        return loadJSON(`/${name}.json`)
            .then(gameSpec =>
                Promise.all([
                    gameSpec,
                    loadSpriteSheet(gameSpec.spriteSheet),
                    loadFont()
                ])).then(([gameSpec, tilesSpriteSheet,font]) => {
                    const game = new Game(entityFactory);
                    createTiles(game, gameSpec.backgrounds);

                    const backgroundLayer = createBackgroundLayer(game, tilesSpriteSheet);
                    game.comp.layers.push(backgroundLayer);

                    const spriteLayer = createSpriteLayer(game.entities);
                    game.comp.layers.push(spriteLayer);

                    // const collisionLayer = createCollisionLayer(game);
                    // game.comp.layers.push(collisionLayer);

                    const dashboardLayer = createDashboardLayer(game,font);
                    game.comp.layers.push(dashboardLayer);

                    const readyLayer = createReadyLayer(game,font);
                    game.comp.layers.push(readyLayer);

                    const menuLayer = createMenuLayer(game,font);
                    game.comp.layers.push(menuLayer);

                    // gameSpec.entities.forEach(({ name, pos: [x, y] }) => {
                    //     const createEntity = entityFactory[name];
                    //     const entity = createEntity();
                    //     entity.pos.set(x, y);
                    //     game.entities.add(entity);
                    // });
                    return game;
                })
    }
}
export function loadSpriteSheet(name){
    return loadJSON(`/sprites/${name}.json`)
    .then(sheetSpec=>Promise.all([
        sheetSpec,
        loadImage(sheetSpec.imageURL)
    ]))
    .then(([sheetSpec,image])=>{
        const spriteSheet = new SpriteSheet(image,sheetSpec.tileW,sheetSpec.tileH);
        if(sheetSpec.tiles){
            sheetSpec.tiles.forEach(tileSpec => {
                spriteSheet.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);
            });
        }
        if(sheetSpec.frames){
            sheetSpec.frames.forEach(frameSpec=>{
                spriteSheet.define(frameSpec.name,...frameSpec.rect);
            });
        }
        if(sheetSpec.animations){
            sheetSpec.animations.forEach(animSpec=>{
                spriteSheet.defineAnim(animSpec.name,createAnim(animSpec.frames,animSpec.frameLen));
            });
        }
        return spriteSheet; 
        
    })
}