"use strict";
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var webserver = {}

webserver.init = function(log, staticRoot, port) {
    webserver.app = express();
    webserver.router = express.Router();
    webserver.logger = log;
    //setup the body parser
    webserver.router.use(bodyParser.urlencoded({ extended: true }));
    webserver.router.use(bodyParser.json());
    // simple logger for this router's requests
    webserver.router.use(function(req, res, next) {
        //Disable logging
        webserver.logger.verbose(util.format('X: %s %s %s', req.method, req.url, req.path));
        next();
    });
    
    //serve any static files out of the configured ui root
    webserver.router.use(express.static(staticRoot));

    webserver.app.use('', webserver.router);
    //setup the http server
    webserver.server = http.Server(webserver.app);
    webserver.server.listen(port, function () {
        webserver.logger.info('Server listening on port ' + port + '!');
    });
}

module.exports = function(log, config) {
    webserver.init(log, config.html_root, config.web_port);
    return webserver;
}