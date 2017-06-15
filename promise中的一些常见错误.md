#####From [we-have-a-problem-with-promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)


1. 正确使用composing promises

｀remotedb.allDocs({
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
// et cetera...｀

then 里面调用then,更好的实现方式是composing promises，后一个then会调用前一个返回的结果。

优化方案：
`remotedb.allDocs(...).then(function (resultOfAllDocs) {
  return localdb.put(...);
}).then(function (resultOfPut) {
  return localdb.get(...);
}).then(function (resultOfGet) {
  return localdb.put(...);
}).catch(function (err) {
  console.log(err);
});`



2. 用promise.all()实现forEach/for/while

｀// I want to remove() all docs
db.allDocs({include_docs: true}).then(function (result) {
  result.rows.forEach(function (row) {
    db.remove(row.doc);  
  });
}).then(function () {
  // I naively believe all docs have been removed() now!
});｀

前一个then并没有返回一个新的promise结果给第二个then,所以第二个then在db.remove()之前就已经执行。

解决方案：
｀db.allDocs({include_docs: true}).then(function (result) {
  return Promise.all(result.rows.map(function (row) {
    return db.remove(row.doc);
  }));
}).then(function (arrayOfResults) {
  // All docs have really been removed() now!
});｀


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

    `
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
    `
    intCounter改变了外部环境,所以是side effects; intNumber只改变了自身变量，所以without side effect；

`somePromise().then(function () {
  someOtherPromise();
}).then(function () {
  // Gee, I hope someOtherPromise() has resolved!
  // Spoiler alert: it hasn't.
});
`

eg.
`somePromise().then(function () {
  // I'm inside a then() function!
});`
当我们有一个then()的时候，我们可以做这些事：

  - 返回一个promise
  - 返回一个异步的value 或者 undefine
  - 返回一个异步的错误

