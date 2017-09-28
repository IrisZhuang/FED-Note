1. 事件驱动机制 

    [understanding node.js](http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb)

    -  command line tool
    -  run js in your terminal
    -  V8 javascript engine(Chrome)

Note:  single-threaded, but event-based

2. 阻塞与非阻塞
node.js是单线程的，通过事件轮询实现并行操作
event-loop 机制(http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/)
chilid_process模块 －> exec()实现异步

 everything runs in parallel except your code
 I/O calls

   执行栈，任务列表
   

3. 补充

    setTimeout 是将任务放入任务列表中等待执行，假如执行栈耗时很长，有可能超过设置的时间才执行任务，h5中setTimeout的参数最低为4ms；
    v8解析js脚本，调用node api,libuv负责node api的执行，形成event loop ,以异步的方式将结果返回给v8;
    process.nextTick 在执行栈尾部，任务列表之前执行回调。
    setImmediate 在任务列表尾部添加。

    [阮一峰谈event-loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)