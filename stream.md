

## Node stream 
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






## Node stream VS vinyl File Object Stream

目的： 将比较少的缓存放入到内存中

### stream in node

##### stream Module 中五个类型：
    readable
    writeable
    transform
    duplex
    classic


* readable._read()可通过定义函数避免.push()缓存数据,仅当数据消耗者出现数据才会推送,如.pipe() shell中可通过|head -cn 设置请求n比特的数据,-n 请求前n行
* process.stdin 一个指向 标准输入流(stdin) 的可读流(Readable Stream) 可直接消耗数据
    process.stdin.read(n) 每次读取n个字节
* stream传输的三种模式：string/ buffer/ Object(objectMode:true)
* The amount of data potentially buffered depends on the highWaterMark option passed into the streams constructor. For normal streams, the highWaterMark option specifies a total number of bytes. For streams operating in object mode, the highWaterMark specifies a total number of objects. 默认的highWaterMark为40k,设置和默认中以最小为准


##### Node.js中应用了stream流的模块
<img src="https://cdn-images-1.medium.com/max/1600/1*lhOvZiDrVbzF8_l8QX3ACw.png">

##### writeable:
drain(.write()返回false时处理完积压数据后触发)
error (设置－head时需处理)
finished  (after end)
pipe/unpipe

##### readable:
2 Modes 触发条件
    flowing : 'data'/ resume() /pipe()
    paused : pause()/ unpipe()



### stream in Gulp

* gulp使用的不是 Node stream 而是 Vinyl File Object Stream ,vinyl: 虚拟文件格式 Vinyl主要用两个属性来描述文件，它们分别是路径（path）及内容（contents）, gulp使用了vinyl-fs模块,特点：保留了路径的文件树
        var File = require('vinyl');  

        var coffeeFile = new File({  
            cwd: "/",   
            base: "/test/",  
            path: "/test/file.coffee",  
            contents: new Buffer("test = 123")  
        });


* contents的三种类型：
1.Stream 2.Buffer 3.null
（personal opinion:此处的Buffer并不是NodeJs中Buffer概念，只是为了区分是否以stream模式传输,NodeJs中的Buffer是stream传输的一种模式，另外两种是string 与 object）

* .src() 生成Vinyl File Object .dest()将使用Vinyl File Object，进行写入操作。

* gulp-uglify只支持Buffer模式的contents,可用vinyl-buffer转换
* 使用stream可对src设置(..,{buffer: false})
* Node Stream和Vinyl File Object Stream的互相转换 ：vinyl-source-stream




##### 参考资料：
1. [Stream API](https://nodejs.org/api/stream.html)
2. [Stream Handbook](https://github.com/substack/stream-handbook)
3. [探究Gulp的Stream](https://segmentfault.com/a/1190000003770541)

