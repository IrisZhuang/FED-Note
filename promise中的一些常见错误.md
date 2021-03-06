#### From [we-have-a-problem-with-promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)

##### 初级错误
1. 正确使用composing promises  

        remotedb.allDocs({  
            include_docs: true,  
            attachments: true  
        }).then(function (result) {  
            var docs = result.rows;  

            docs.forEach(function(element) {  
                localdb.put(element.doc).then(function(response) {  
                alert("Pulled doc with id " + element.doc._id + " and added to local db.");  
            }).catch(function (err) {   
                if (err.name == 'conflict') {  
                localdb.get(element.doc._id).then(function (resp) {  
                localdb.remove(resp._id, resp._rev).then(function (resp) {  
             // et cetera...  


    then 里面调用then,更好的实现方式是composing promises，后一个then会调用前一个返回的结果。

    优化方案：  

        remotedb.allDocs(...).then(function (resultOfAllDocs) {  
            return localdb.put(...);  
        }).then(function (resultOfPut) {  
            return localdb.get(...);  
        }).then(function (resultOfGet) {  
            return localdb.put(...);  
        }).catch(function (err) {  
            console.log(err);  
        });



2. 用promise.all()实现forEach/for/while

        // I want to remove() all docs  
        db.allDocs({include_docs: true}).then(function (result) {  
        result.rows.forEach(function (row) {  
            db.remove(row.doc);    
        });  
        }).then(function () {  
        // I naively believe all docs have been removed() now!  
        });  

    前一个then并没有返回一个新的promise结果给第二个then,所以第二个then在db.remove()之前就已经执行。

    解决方案：

        db.allDocs({include_docs: true}).then(function (result) {  
        return Promise.all(result.rows.map(function (row) {  
            return db.remove(row.doc);  
        }));  
        }).then(function (arrayOfResults) {  
        // All docs have really been removed() now!  
        });  


3. 没有加 .catch()

    * .then()的第二个参数和.cathch()的区别？

    then只会捕捉前一个promise里的错误，catch()会捕捉全部promise链上的错误


4. 使用"deferred"

    jQuery and Angular were using this "deferred" pattern,
    which has now been replaced with the ES6 Promise spec

    deferred是jQuery和Angular中实现promise的方式，现在已被ES6的Promise代替

5. side effects 代替return 
(关键问题，Seriously, this is the one weird trick that, once you understand it, will prevent all of the errors I've been talking about.)

* [什么是side effects?](https://www.zhihu.com/question/30779564)

    函数一般认为是没有状态的，每次用相同的输入调用时应当给出相同的输出，且不会影响程序的其它部分。如果函数对程序的状态有影响，这种影响就叫作“side effects”。  例如：  

    
        int counter = 0;

        // with side effect
        int intCounter() {
            counter += 1;
            return counter;
        }

        // without side effect
        int intNumber(int m) {
            return m + 1;
        }
    
    intCounter改变了外部环境,所以是side effects; intNumber只改变了自身变量，所以without side effect；

        somePromise().then(function () {  
        someOtherPromise();  
        }).then(function () {  
        // Gee, I hope someOtherPromise() has resolved!  
        // Spoiler alert: it hasn't.  
        });  
 
    回到之前的问题，
    eg.    

        somePromise().then(function () {  
        // I'm inside a then() function!  
        });  


    当我们有一个then()的时候，我们可以做这些事：

    - 返回一个promise
    - 返回一个异步的value 或者 undefine
    - 返回一个异步的错误

    第二个then不会关心前一个then返回的是同步还是异步的结果，但是non-returning的函数将返回undefine，所以很可能当你想返回一些东西的时候，实际上仅仅实现了一个side effects.
    所以，比较好的建议是无论什么时候都在then()中加上return 或者 throw.
    而 throw 是promise的另一个神奇之处，catch可以接收到一个同步的错误，也可接受来自被拒绝的promise的异步错误。例如，JSON.parse(params)中params无效时报的错误将会被catch捕捉。


##### 进阶错误
1. 不知道用promise.resolve()

    习惯new Promise((resolve,reject)=>{resolve(someSynchronousValue)} ).then()
    可以优化为
    Promise.resolve(someSynchronousValue).then();
    好处是一些同步错误可以被捕捉到。
    如果希望得到一个Promise对象，比较方便的方法就是直接调用Promise.resolve方法。eg. var p = Promise.resolve();
    需要注意的是，立即resolve的Promise对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时,
    (我的理解是加到执行栈的尾端,关于event-loop可参考node入门中的md)

2. catch 和 then第二个参数的区别

    见初级问题3，then第二个参数无法捕捉自身throw的error

3. 如何用promise实现aysnc的series?

            function executeSequentially(promises) {  
                var result = Promise.resolve();  
                promises.forEach(function (promise) {  
                    result = result.then(promise);  
                });  
                return result;  
            }

    promise array不能达到这个效果，他们还是会并行，因为promise被创建时，他就开始执行了，所以需要这样一个promise工厂，当promise被需要时，才会返回一个promise

            function myPromiseFactory() {  
                return somethingThatCreatesAPromise();  
            }  

4. 如何在第三个then中同时获取来自第二个then和第一个then的结果

        let a = Promise.resolve(2).then((result)=>{
            return test(result).then((result2)=>{console.log(result + ':'+ result2)});
        }).then((result)=>{
            console.log('done')
        })

        function test(result){
            let result2 = result +1;
            return  Promise.resolve(result2)
        }


5. 一个问题：

        Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {  
            console.log(result);  
        });  

    输出foo 还是 bar？

    答案： foo

    当在then里传的是非函数时，即使传的是一个Promise对象，也会被处理为then(null)而将result传递到下一个result中，这也解释了第三个问题result.then(promise)为什么不能达到效果，因为这里的promise是非函数对象，只有通过myPromiseFactory将其变为函数，才不会pass through到下一个then

        Promise.resolve('foo').then(function () {  
            return Promise.resolve('bar');  
        }).then(function (result) {  
            console.log(result);  
        });  
    
    这样才会输出bar


    * 我的一些理解 ：then中为non-function和side effects（non-returning）是两种情况

            doSomething().then(  
                Promise.resolve(resultOfDoSomething)  
            ).then(finalHandler);  

                VS

            doSomething().then(function () {  
                doSomethingElse();  
            }).then(finalHandler);  



            前者
            doSomething
            |-----------------|
                            Promise对象 = then(null)
                            |------------------|
                            finalHandler(resultOfDoSomething)
                            |------------------|
            后者  
            doSomething
            |-----------------|
                            doSomethingElse(undefined)
                            |------------------|
                            finalHandler(undefined)
                            |------------------|
            ）




