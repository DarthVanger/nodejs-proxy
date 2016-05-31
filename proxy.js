var http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({}),
    url = require('url');

http.createServer(function(req, res) {
    //var hostname = req.headers.host.split(":")[0];
    var pathname = url.parse(req.url).pathname;

    //console.log('hostname = ' + hostname + '\n');
    //console.log('pathname = ' + pathname + '\n');

    // port 8000 is apache
    var sites = {
        '/jsonFileDb': 'http://localhost:9000',
        '/cash-machine': 'http://localhost:9001',
        '/futon-art': 'http://localhost:8000',
        '/electronics-shop': 'http://localhost:9002',
        '/': 'http://localhost:8000'
    }

    var noSiteWasMatched = true;
    for (var site in sites) {
        var rootRegex = new RegExp(site + '/?');
        var sitePageRegex = new RegExp(site + '/.*');
        if (pathname.match(rootRegex) || pathname.match(sitePageRegex)) {
	    //console.log('matched ' + site);
            noSiteWasMatched = false;
            proxy.web(req, res, { target: sites[site] });
            break;
        }
    }

    if (noSiteWasMatched) {
        res.statusCode = 404;
        res.end('Proxy server: No subsite was found for url "' + req.url + '"');
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
