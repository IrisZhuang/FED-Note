var http = require('http');
var url = require('url');
var handle = require('./requestHandler');

function start (route){
    function onRequest(request, response) {
        var postData = '';
        var pathname = url.parse(request.url).pathname;

    request.setEncoding("utf8");

    request.addListener("data", function(chunk) {
      postData += chunk;
      console.log("Received POST data chunk '"+
      chunk + "'.");
    });

     request.addListener("end",()=>{
        console.log('end'+pathname);
        route (handle,pathname,response,postData);
     })


    }
    http.createServer(onRequest).listen(1111);
}

exports.start = start;