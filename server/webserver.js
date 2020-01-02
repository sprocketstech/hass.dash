"use strict";
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
const io = require('socket.io');

var webserver = {}

webserver.init = function(log, config) {
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

    //add some convenience functions to all responses
    webserver.router.use(function(req, res, next) {
        res.handleError = function(err) {
            if (err.code === 417) {
                res.status(417).send({code: 417, message: err.message});
            } else if (err.code === 404) {
                res.status(404).send({code: 404, message: err.message});
            }
            else {
                loggingService.error(err.message, err.stack);
                res.status(500).send(err);
            }
        };
        res.success = function(body) {
            res.status(200).send(body);
        };
        res.unauthorized = function(code, err) {
            res.status(401).send({code: code, message: err});  
        };
        res.notFound = function() {
            res.status(404).send({code: 404, message: 'Not found'});
        };
        next();
    });
    
    //serve any static files out of the configured ui root
    webserver.router.use(express.static(config.html_root));

    webserver.app.use('', webserver.router);
    //setup the http server
    webserver.server = http.Server(webserver.app);
    webserver.clientHandler = io.listen(webserver.server);
    webserver.server.listen(config.web_port, function () {
        webserver.logger.info('Server listening on port ' + config.web_port + '!');
    });
}

module.exports = function(log, config) {
    webserver.init(log, config);
    return webserver;
}