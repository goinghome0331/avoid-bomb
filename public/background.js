function createBackground(){
    let g = 0,b = 0;
        setInterval(()=>{
            b++;
            if(b >= 256) {
                g++;
                if(g >= 256){
                    g = 0;
                }
                b = 0;
            }
            document.body.style.backgroundColor=`rgb(${0},${g},${b})`;
    },20);
}