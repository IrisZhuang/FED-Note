##### 《Node.js开发指南》

###### Nodejs特点
1. 阻塞与线程
    单线程事件驱动的异步式 I/O的优点 －  就是少了多线程的开销。对操作系统来说，创建一个线程的代价是十分昂贵的

2. 事件
    libev 事件循环的每一次迭代，在 Node.js 中就是一次 Tick，libev 不断检查是否有活动的、可供检测的事件监听器，直到检测不到时才退出事件循环，进程结束。

3. 模块和包
    在 Node.js 中，创建一个模块非常简单，因为一个文件就是一个模块，我们要关注的问题仅仅在于如何在其他文件中获取这个模块。Node.js 提供了 exports 和 require 两个对象，其中 exports 是模块公开的接口，require 用于从外部获取一个模块的接口，即所获取模块的 exports 对象。

###### 核心模块

1. 全局对象
    global 最根本的作用是作为全局变量的宿主。在 Node.js 中你不可能在最外层定义变量，因为所有用户代码都是属于当前模块的，而模块本身不是最外层上下文。
    - process :
        process.stdout是标准输出流，通常我们使用的 console.log() 向标准输出打印字符，而 process.stdout.write() 函数提供了更底层的接口。process.nextTick(callback)的功能是为事件循环设置一项任务，Node.js 会在下次事件循环调响应前调用 callback。
    - console
    - util:
         util.inherits(A,B) A 仅仅继承了 B 在原型中定义的函数，而构造函数内部创造的 属性和 函数都没有被 Sub 继承。
         util.inspect是一个将任意对象转换为字符串的方法
        

.



2. 事件驱动 events (events 是 Node.js 最重要的模块)
    events 模块只提供了一个对象： events.EventEmitter。
    常用api: emit()注册监听器, on()发射, once() 单次监听器, removeListener()移除监听器
    * 我们一般要为会发射 error事件的对象设置监听器，避免遇到错误后整个程序崩溃

Tips:




* 可通过supervisor及时监听变化
* 使用node-inspector调试
* for循环中通过闭包保存当前i值之外的解决方案是使用forEach