"use strict";

module.exports = function(argv) {
    var config = {
        log_level: 'verbose',
        html_root: __dirname + '/../ui/',
        web_port: 8099,
        widget_directory: __dirname + '/widgets',
        devices_directory: __dirname + '/devices'
    }
    return config;
}
