### async 
##### series

let urlMap = [...,...,..];

urlMap.reduce(function(sequence,url){
    return sequence.then(()=>{
        return getPromise(url);
    })
},Promise.resolve())



##### waterfall
function waterfall(task,callback){
    let length = task.length;
    let all= [];

    function loop(){
        while(length){
            let task = task.shift()
            task((result)=>{
                all.push(result)
            });
            if(!length){
                callback(all);
            }
        }
    }
    loop();

}
优化：
function waterfall(task,callback){
    let length = task.length;

    function loop(n){
        if(n == length){
            return callback;
        }
        return function(){
            task[n](...args,loop(n+1));
        }
    }
    loop(0);

}

##### parallel
function parallel(task,callback){
    let count = task.length;
    let all = [];

    for(let i = 0;i<length;i++){
        let task = task[i];
        task((result)=>{
            all[i]=result;
            count--;
            if(!count){
                callback(all);
            }
        })
    }


}