"use strict";

/* Initializes the logging framework
   Hooks into all log frameworks used by third party components
   and forwards them to our logging service
 */

var util = require('util');
var winston = require('winston');

process.env['DEBUG_COLORS'] = 0;
var logger = null;

var consoleTransport = new (winston.transports.Console)({
    timestamp: function() {
        return new Date();
    },
    formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp().toISOString() + '\t' + '\t' + appTier + '\t' + options.level.toUpperCase() +'\t'+ (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
    }
});


//hook into debug if the log level is debug or verbose
function loggingWrapper() {
    logger.debug(util.format.apply(null, arguments));
}

var service = {};

var createMetadata = function(stack, md) {
    var retVal = null;
    if (stack) {
        retVal = {stack: stack};
    }
    if (md) {
        if (!retVal) {
            retVal = {};
        }
        for (var i in md) {
            retVal[i] = md[i];
        }
    }
    return retVal;
};

service._log = function(level, message, stack, md) {
    var metadata = createMetadata(stack, md);
    switch(level) {
        case "error":
            logger.error(message, metadata);
            break;
        case "info":
            logger.info(message, metadata);
            break;
        case "warn":
            logger.warn(message, metadata);
            break;
        case "verbose":
            logger.verbose(message, metadata);
            break;
        case "debug":
            logger.debug(message, metadata);
            break;
        default:
            logger.error(message, metadata);
            break;
    }
};

/**
 * Log a message at the info level
 * @param message
 * @param metadata
 */
service.info = function(message, stack, md) {
    service._log('info', message, stack, md);
};
/**
 * Log a message at the error level
 * @param message
 * @param metadata
 */
service.error = function(message, stack, md) {
    service._log('error', message, stack, md);
};

/**
 * Log a message at the warning level
 * @param message
 * @param metadata
 */
service.warn = function(message, stack, md) {
    service._log('warn', message, stack, md);
};

/**
 * Log a message at the verbose level
 * @param message
 * @param metadata
 */
service.verbose = function(message, stack, md) {
    service._log('verbose', message, stack, md);
};

/**
 * Log a message at the debug level
 * @param message
 * @param metadata
 */
service.debug = function(message, stack, md) {
    service._log('debug', message, stack, md);
};



module.exports = function(config) {
    var logLevel = config.log_level;


    logger = winston.createLogger({
        level: logLevel,
        defaultMeta: {  },
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.simple(),
            winston.format.printf(function(info){
                return `${info.timestamp}\t${info.level}: ${info.message}\t${info.md && Object.keys(info.md).length ? JSON.stringify(info.md, null, 2) : ''}\t${info.stack ? info.stack : ""}`;
            })
        ),
        transports: [
            consoleTransport/*,
            fileTransport,
             dbTransport*/
        ]
    });

    //order is important here! if we set debug env after require of debug
    //nothing is logged.
    if (logLevel === 'verbose') {
        process.env['DEBUG'] = '*';
    }

    var Debug = require('debug');
    if (logLevel === 'debug' || logLevel === 'verbose') {
        //hook into debug for additional logs
        Debug.log = loggingWrapper;
        Debug.formatArgs = function() {
            return arguments;
        };
    }
    process.on('uncaughtException', function(err) {
        //log any uncaught exceptions
        logger.error(err.message, err.stack);
    });
    process.on('unhandledRejection', function(err) {
        //log any unhandled rejections
        logger.error(err.message, err.stack);
    });

    return service;
}