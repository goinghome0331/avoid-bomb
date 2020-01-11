import KeyBoard from './KeyBoardState.js';
import { States } from './Game.js';
import Recorder from './Recorder.js';
export function setupKeyBoard(player,game){

    function upIndex(){
        game.menuIndex--;
        if (game.menuIndex < 0) {
            game.menuIndex = game.options.length - 1;
        }    

    }
    function downIndex(){
        game.menuIndex++;
        if (game.menuIndex === game.options.length) {
            game.menuIndex = 0;
        }    
        
    }

    const input = new KeyBoard();
    input.addMapping('ArrowRight', keyState => {
        if(game.state !== States.END)
            player.go.dir += keyState ? 1 : -1;
        else
            downIndex();
    });
    input.addMapping('ArrowLeft', keyState => {
        if(game.state !== States.END)
            player.go.dir += keyState ? -1 : 1;
        else
            upIndex();
    });
    input.addMapping('ArrowUp', keyState => {
        if(keyState && game.state === States.END){
            upIndex();
        }
    });
    input.addMapping('ArrowDown', keyState => {
        if(keyState && game.state === States.END){
            downIndex();
        }
    });
    
    input.addMapping('Enter', keyState => {
        if(keyState && game.state === States.END){
            switch(game.menuIndex){
                case 0:
                    location.href='/';
                    break;
                case 1:
                    if(window.confirm('Do you want save?')){
                        let username = window.prompt('Input username');
                        if(username){
                            Recorder.save({username:username,score:game.count});
                            alert('Finish save');
                        }
                    }
                    break;
                case 2:
                    game.initialize();
                    break;
            }
        }
            
    });
    return input;
}