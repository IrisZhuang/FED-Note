1. 事件驱动机制 

    understanding node.js[http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb]

    -  command line tool
    -  run js in your terminal
    -  V8 javascript engine(Chrome)

Note:  single-threaded, but event-based

2. 阻塞与非阻塞
node.js是单线程的，通过事件轮询实现并行操作
［http://blog.mixu.net/2011/02/01/understanding-the-node-js-event-loop/］
chilid_process模块 －> exec()实现异步

 everything runs in parallel except your code
 I/O calls

   执行栈，任务列表