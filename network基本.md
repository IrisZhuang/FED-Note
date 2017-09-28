最近遇到了一些network相关的问题,eg:
1. formData 和 request repload区别 ? post时如何转换
2. referer
3. cookie & session
4. withCredentials 跨域 同源 
[CORS](http://www.cnblogs.com/shikyoh/p/4959562.html) 
[web会话](http://web.jobbole.com/89072/)


##### formData 和 request repload
以Content-Type: application/json格式传的是request repload，
以Content-Type: application/x-www-form-urlencoded or Content-Type: multipart/form-data传的是formData格式，后端拿到的处理方式不一样

转换方式：
$.ajax post改为formdata的方法：contentType: 'application/x-www-form-urlencoded'


axios post改为formdata时如果直接改contentType会有一个坑，因为axios是默认发送json格式，所以我们传过去的formdata只是一个key值，没有value,
解决方案是引入axios里面的qs库，或者nodejs自身的querystring

fetch如何?( todo)
fetch也有相同问题😑

解决方案：手写一个querystring把json格式转成key = value & ..模式,
如果用new Formdata() append处理后格式是WebKitFormBoundary，也不能解决。

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


##### referer
表示从哪儿链接到目前的网页，采用的格式是URL。换句话说，借着HTTP来源地址，目前的网页可以检查访客从哪里而来，这也常被用来对付伪造的跨网站请求。

referer的主要用途：
1. 防盗链
2. 统计来源

本地js不能修改浏览器referer


//todo
##### cookie & session
