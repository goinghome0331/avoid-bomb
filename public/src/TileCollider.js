import TileResolver from './TileResolver.js';
import {Sides} from './Entity.js';
export default class TileCollider {
    constructor(matrix){
        this.tileResolver = new TileResolver(matrix);
    }

    checkY(entity){
        const matches = this.tileResolver.searchByRange(entity.bounds.left, entity.bounds.right,
                                            entity.bounds.bottom,entity.bounds.bottom);

        matches.forEach(match=>{
            if(!match){
                return ;
            }
            
            if(match.tile.type !=='block'){
                return ;
            }
            if(entity.vel.y > 0){
                if(entity.bounds.bottom > match.y1){
                    entity.obstruct(Sides.BOTTOM,match);
                }
            }
        });
        
    }
    test(entity){
        this.checkY(entity);
    }
}