import {States} from './Game.js';
export function createBackgroundLayer(game, spriteSheet){
    const buffer = document.createElement('canvas');
    buffer.width = 368;
    buffer.height = 640;

    const context = buffer.getContext('2d');
    game.tiles.forEach((tile,x,y) => {
        spriteSheet.drawTile(tile.name, context, x, y);
    });
    return function drawBackgroundLayer(context){
        context.drawImage(buffer,0,0);
    }
}

export function createSpriteLayer(entities){
    return function drawSpriteLayer(context){
        entities.forEach(entity=>{
            entity.draw(context);
        })
    }
}
function createEntityLayer(entities){
    return function drawBoundingBox(context){
        context.strokeStyle='red';
        entities.forEach(entity=>{
            context.beginPath();
            context.rect(
                entity.bounds.left, entity.bounds.top,
                entity.size.x, entity.size.y
            );
            context.stroke();
        });
    }
}
function createTileCandidateLayer(tileCollider){
    const resolvedTiles = [];

    const tileResolver = tileCollider.tileResolver;
    const tileSize = tileResolver.tileSize;

    const getByIndexOriginal  = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexFake(x,y){
        resolvedTiles.push({x,y});
        return getByIndexOriginal.call(tileResolver,x,y);
    }

    return function drawTileCandidates(context){
        context.strokeStyle='blue';
        resolvedTiles.forEach(({x,y})=>{
            context.beginPath();
            context.rect(x*tileSize,y*tileSize,tileSize,tileSize);
            context.stroke();
        });
        resolvedTiles.length = 0;
    }
}
export function createCollisionLayer(game){
    
    const drawTileCandidates = createTileCandidateLayer(game.tileCollider);
    const drawBoundingBoxes = createEntityLayer(game.entities);

    return function drawCollision(context){
        drawTileCandidates(context);
        drawBoundingBoxes(context);
    }
}
export function createDashboardLayer(game,font){
    const LINE1 = font.size;
    const LINE2 = font.size*2;
    return function drawDashboard(context){
        font.print('COUNT',context,16,LINE1);
        font.print(game.count.toString().padStart(4,'0'),context,22,LINE2);
    }
}
export function createReadyLayer(game,font){
    return function drawReady(context){
        if(game.state === States.READY1){
            font.print('READY!',context,130,320);
        }else if(game.state === States.READY2){
            font.print('GO!!!',context,145,320);
        }
    }
}

export function createMenuLayer(game){
    
    return function drawMenu(context){
        if(game.state === States.END){
            context.fillStyle='white';
            context.beginPath();
            context.fillRect(85,190,200,200);

            context.fillStyle='black';
            context.font = '30px normal';
            context.fillText("Result", 145,220);

            context.font = '50px normal';
            context.fillText(game.count.toString().padStart(4,'0'), 135,280);

            context.font = '25px normal';
            game.options.forEach((option,index)=>{
                if(game.menuIndex === index)
                    context.fillStyle='red';
                else
                    context.fillStyle='black';
                context.fillText(option.name, option.x,option.y);    
            });

            context.stroke();
        }
    }
}