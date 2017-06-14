


function router(handle,pathname,response,postData) {
    pathname = pathname.split('/')[1];
    if(typeof handle[pathname] === 'function'){
        return handle[pathname](response,postData);
    }else{
        console.log('木有这个功能');

        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404");
        response.end();
    } 


    
}

exports.router = router;