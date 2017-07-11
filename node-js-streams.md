

<img src="https://cdn-images-1.medium.com/max/1600/1*lhOvZiDrVbzF8_l8QX3ACw.png">

##### stream的四种基本类型：
1. readable : eg. fs.creatReadStream
2. writable : eg. fs.creatWriteStream
3. duplex : TCP socket
4. transform : zlib.creatGzip

所有的stream都包含EventEmitter,当数据可/可写时，事件会被触发，但是我们一般会用更简单的pipe()来处理

##### pipe() & envents

you can chain pipe calls like a|b|c|d in Linux,但是如果希望以更常规的方式处理数据，可以选择events;

常见的events:

<img src="https://cdn-images-1.medium.com/max/1600/1*HGXpeiF5-hJrOk_8tT2jFA.png">
 
比较重要的几个事件：

 readable: data  , end
 writable: drain , finish

readable两种模式触发条件
    flowing : 'data'/ resume() /pipe()
    paused : pause()/ unpipe()

当readable处于paused状态时，可以使用read()来将其转化为flowing模式。

stream的两种形式：1.implement 2.consumer
implent eg: 
    const { Writable } = require('stream');
    const outStream = new Writable({  
        ...  
    })  


下面实在无力看了。。。感觉不是比较重点的东西
2014.6.13
