const STORAGE_IDENTIFIER = 'AVOID_BOMB';
class Recorder{
    
    save(data){

        let list = this.get();
        
        if(list === null){
            list = {
                scores : [
                    data            
                ]
            }
            this.set(list);
        }else{
            var new_scores = list.scores.concat(data);
            new_scores.sort((a, b) => {
                return b.score - a.score;
            });
            this.set(Object.assign({},list,{scores:new_scores}));
        }
    }


    set(data){
        localStorage.setItem(STORAGE_IDENTIFIER,JSON.stringify(data));
    }
    get(){
        return JSON.parse(localStorage.getItem(STORAGE_IDENTIFIER));
    }
    clear(){
        localStorage.removeItem(STORAGE_IDENTIFIER);
    }
}
export default new Recorder();