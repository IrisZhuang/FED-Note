
## Node stream VS vinyl File Object Stream

目的： 将比较少的缓存放入到内存中

### stream in node

##### stream Module 中五个类型：
    readable
    writeable
    transform
    duplex
    classic

.pipe()

* readable._read()可通过定义函数避免.push()缓存数据,仅当数据消耗者出现数据才会推送,如.pipe() shell中可通过|head -cn 设置请求n比特的数据,-n 请求前n行
* process.stdin 一个指向 标准输入流(stdin) 的可读流(Readable Stream) 可直接消耗数据
    process.stdin.read(n) 每次读取n个字节
* stream传输的三种模式：string/ buffer/ Object(objectMode:true)
* The amount of data potentially buffered depends on the highWaterMark option passed into the streams constructor. For normal streams, the highWaterMark option specifies a total number of bytes. For streams operating in object mode, the highWaterMark specifies a total number of objects. 默认的highWaterMark为40k,设置和默认中以最小为准


##### Node.js中应用了stream流的模块
1. http   
req : readable stream 
res: writeable stream

2. process.stdout, process.stderr
 

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

* gulp使用的不是 Node stream 而是 Vinyl File Object Stream ,vinyl: 虚拟文件格式 path contents, gulp使用了vinyl-fs模块,特点：保留了路径的文件树

* .src() 生成Vinyl File Object .dest()将使用Vinyl File Object，进行写入操作。

* contents的三种类型：
1.Stream 2.Buffer 3.null
（personal opnion:此处的Buffer并不是NodeJs中Buffer概念，只是为了区分是否以stream模式传输,NodeJs中的Buffer是stream传输的一种模式，另外两种是string 与 object）

* gulp-uglify只支持Buffer模式的contents,可用vinyl-buffer转换
* 使用stream可对src设置(..,{buffer: false})
* Node Stream和Vinyl File Object Stream的互相转换 ：vinyl-source-stream




##### 参考资料：
[Stream API](https://nodejs.org/api/stream.html)
[Stream Handbook](https://github.com/substack/stream-handbook)
[探究Gulp的Stream](https://segmentfault.com/a/1190000003770541)

