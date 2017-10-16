最近遇到了一些network相关的问题,eg:
1. formData 和 request repload区别 ? post时如何转换
2. referer
3. cookie & session
4. withCredentials 跨域 同源 

#### formData 和 request repload
        以Content-Type: application/json格式传的是request repload，
        以Content-Type: application/x-www-form-urlencoded or Content-Type: multipart/form-data传的是formData格式，后端拿到的处理方式不一样

        转换方式：

        - $.ajax post改为formdata的方法：contentType: 'application/x-www-form-urlencoded'

        - axios post改为formdata时如果直接改contentType会有一个坑，因为axios是默认发送json格式，所以我们传过去的formdata只是一个key值，没有value,
        解决方案是引入axios里面的qs库，或者nodejs自身的querystring

        - fetch如何?( todo)
        fetch也有相同问题😑

        不引用库的解决方案：手写一个querystring把json格式转成key = value & ..模式,
        如果用new Formdata() append处理后格式是WebKitFormBoundary，也不能解决。但是有一个问题是如果value里面有&也会解析成key1.  可以encodeUriComponent() 一下


        另外
        formdata 有一个坑是
        { Id: 1, 
        name:'john', 
        phones:[{title:'home',number:111111,...},
                {title:'office',number:22222,...}]
        }
        这种需要把数组stringify，不然会转化为这种格式：
        { Id: 1, 
        name:'john', 
        phones:[object object]
        phones:[object object]
        }

参考：
[axios.js post application/x-www-form-urlencoded参数问题](https://segmentfault.com/q/1010000007607111)

 #### referer
        表示从哪儿链接到目前的网页，采用的格式是URL。换句话说，借着HTTP来源地址，目前的网页可以检查访客从哪里而来，这也常被用来对付伪造的跨网站请求。

        referer的主要用途：
        1. 防盗链
        2. 统计来源

        本地js不能修改浏览器referer


//todo
#### cookie & session
cookie

        cookie是存储key-value对的一个文件，务必记住，它是由服务器将cookie添加到response里一并返回给客户端，然后客户端会自动把response里的cookie接收下来，并且保存到本地，下次发出请求的时候，就会把cookie附加在request里，服务器在根据request里的cookie遍历搜索是否有与之符合的信息

        首先， 我们明确cookie是存在客户端的，实际上就是在客户端与服务端交换的一小段数据（一个name/string对) ，如果客户端的浏览器禁用了 Cookie 怎么办？一般这种情况下，会使用一种叫做URL重写的技术来进行会话跟踪，即每次HTTP交互，URL后面都会被附加上一个诸如 sid=xxxxx 这样的参数，服务端据此来识别用户。

[cookie基本框架](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework)

session

        Session即会话，指一种持续性的、双向的连接。Session与Cookie在本质上没有区别，都是针对HTTP协议的局限性而提出的一种保持客户端和服务器间保持会话连接状态的机制。Session也是一个通用的标准，但在不同的语言中实现有所不同。针对Web网站来说，Session指用户在浏览某个网站时，从进入网站到浏览器关闭这段时间内的会话。由此可知，Session实际上是一个特定的时间概念。
        使用Session可以在网站的上下文不同页面间传递变量、用户身份认证、程序状态记录等。常见的形式就是配合Cookie使用，实现保存用户登录状态功能。

        localStorage 与 sessionStorage的区别
        localStorage 与 sessionStorage 相似。不同之处在于，存储在 localStorage 里面的数据没有过期时间（expiration time），而存储在 sessionStorage 里面的数据会在浏览器会话（browsing session）结束时被清除，即浏览器关闭时。
#### withCredentials 跨域 同源 CORS
        1.Corss-Origin Resources Sharing

        简单理解就是服务端设置一些字段来保证跨域的实现，应用即我们在写爬虫时可以通过类似superagent这样的模块或者electron这种客户端来实现跨域请求。

        Access-Control-Allow-Origin:* , 

        Access-Control-Allow-Credentials: true /false,

        Access-Control-Request-Headers:content-type ...

        Access-Control-Request-Method:POST ...

        2.浏览器的同源策略
        同源策略限制从一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的关键的安全机制。
        浏览器是可以发起跨域请求的，比如你可以外链一个外域的图片或者脚本。但是Javascript脚本是不能获取这些资源的内容的，它只能被浏览器执行或渲染。主要原因还是出于安全考虑，浏览器会限制脚本中发起的跨站请求。
        如果资源做了同源策略的限制，那么实现跨域有以下几种方式：
        - srcipt(JSONP原理) ,link,img,video,object,@font-face,frame,iframe
        - CORS

        3.withCredentials
        在已经实现跨域的基础上，可能仍然存在cookie问题需要解决，跨域请求时如果想带上当前域名的cookie需要在请求头里设置{crossDomain: true, xhrFields: {withCredentials: true}}，当然，服务端Access-Control-Allow-Credentials也要相应设置为true.




[CORS](http://www.cnblogs.com/shikyoh/p/4959562.html) 
[web会话](http://web.jobbole.com/89072/)
[how-to-allow-cor](https://stackoverflow.com/questions/7067966/how-to-allow-cors)