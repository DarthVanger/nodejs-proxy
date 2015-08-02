var http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({}),
    url = require('url');

http.createServer(function(req, res) {
    var hostname = req.headers.host.split(":")[0];
    var pathname = url.parse(req.url).pathname;

    console.log('hostname = ' + hostname);
    console.log('pathname = ' + pathname);

    switch(pathname)
    {
        case '/futon-art':
            proxy.web(req, res, { target: 'http://localhost:8000' });
            break;
        case '/jsonFileDb':
            proxy.web(req, res, { target: 'http://localhost:9000' });
            break;
        default:
            proxy.web(req, res, { target: 'http://localhost:8000' });
    }
}).listen(80, function() {
    console.log('proxy listening on port 80');
});

// We simulate the 3 target applications
//http.createServer(function(req, res) {
//    res.end("Request received on 9000");
//}).listen(9000);

//http.createServer(function(req, res) {
//    res.end("Request received on 9002");
//}).listen(9002);
//
//http.createServer(function(req, res) {
//    res.end("Request received on 9003");
