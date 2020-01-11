import Recorder from './Recorder.js';



const tbody = document.getElementById('list');


async function tableRendering(){
    
    var list = await Recorder.get();
    var htmlCode;
    if(list === null){
        htmlCode = '저장된 데이터가 없습니다.';
    }else{
        htmlCode = list.scores.reduce((acc,cur,index)=>{
            return acc + `<tr><td>${index+1}</td><td>${cur.username}</td><td>${cur.score}</td></tr>`;
        },'');
    }
    

    tbody.innerHTML = htmlCode;
}
export function reset(){
    Recorder.clear();
    tableRendering();    
}
tableRendering();

