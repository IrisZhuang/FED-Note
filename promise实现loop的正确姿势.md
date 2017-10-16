项目里使用了bluebird作为promise库，有一个场景是某个接口很容易出错，期望是出错时轮训请求直到成功。伪大神小哥哥跟我说用Promise.try，参数里加个次数就行了，于是我看了下文档，不怼是我最后的温柔。

版本1－错误示例:

```
function loop(cb){
    $.ajax({
        ....
        success:(data)=>{
            if(data.error_code){
                loop(cb)
            }else{
                cb(data)
            }
        }
        error:(data)=>{
            loop()
        }
    })
}
new Promise((resolve,reject)=>{
    $.ajax({
        ....
        success:(data)=>{
            if(data.error_code){
                loop((data)=>{
                    resolve(data)
                })
            }
        }
        error:(data)=>{
                loop((data)=>{
                    resolve(data)
                })
        }
    })
})
```
这个版本new Promise里的代码提出来重复写了一个loop,把resolve当作cb传进loop里，保证成功时能返回给await正确的结果，实际上是用promise写了个回调的老代码，而且更冗余了，除了能迅速上线其他惨不忍睹。

版本2：
```
new Promise((resolve,reject)=>{
    (function loop ()=>{
        $.ajax({
            ....
            success:(data)=>{
                if(data.error_code){
                    loop()
                }else{
                    resolve()
                }
            }
            error:(data)=>{
                loop()
            }
        })
    })();

})
```
版本2套了层立即执行函数，轮训自身，没有回调了，但也没有发挥promise的特性，也不是我们想要的。

版本3:
```
function loop(promise, fn){
    return promise.then(fn).then((res)=>{
        return !res.done ? loop(Promise.resolve(res.value)) : res.value;
    })
}

loop(Promise.resolve(),function(result){
    console.log(result);
    $.ajax({
        ....
        success:(data)=>{
            if(data.error_code){
                return {
                    done: false
                    value: data
                }
            }else{
                return {
                    done: true
                    value: data
                }
            }

        }
        error:(data)=>{
                return {
                    done: false
                    value: data
                }
        }
    })
})
```
版本3把loop部分抽出来包在promise外面，循环执行部分也抽离出来，第一次传入Promise.resolve(),之后通过then形成chain


版本4:
```
var wrongFlag = true;
var promiseWhile = Promise.method(function(condition,action,value)) {
    if(!condition()) return lastValue;
    return action().then(Promise.bind(null,contidion,action,res)
 }

promiseWhile(
    fuction(){
        return flag;
    },
    function(){
            $.ajax({
                ....
                success:(data)=>{
                    if(!data.error_code){
                        wrongFlags = false;
                        
                    }
                    return data;
                }
                error:(data)=>{
                    ..
                }
            })
    }
).then(console.log('done'))


```



版本4中我们用Promise.method和Promise.bind实现loop 把loop的部分抽成promiseWhile,然后判断条件和执行代码也相应抽离出来。这样实现了高复用性，后期可以抽成公用方法，是目前相对理想的方案。

版本5:
是否可以尝试用asycn
getData()=>{
    return new Promise((resolve,reject)=>{
            $.ajax({
                ....
                success:(data)=>{
                    if(!data.error_code){
                       resolve({success: false;data: data})
                        
                    }else{
                        resolve({success: true;data: data})
                    }
                }
                error:(data)=>{
                    resolve({success: false;data: data})
                }
            })
    })
}

let resp = await getData();
while(!resp.success){
    resp = await getData();
}
resp = resp.data;

借鉴：
[Correct way to write loops for promise.](https://stackoverflow.com/questions/24660096/correct-way-to-write-loops-for-promise)