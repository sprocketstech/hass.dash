
var express = require('express');
var svc = {
    widgets: []
};

var findPlugins = function(dir) {
    var ret = [];
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            //look for a config.json file
            if (fs.statSync(dir + '/' + file + '/widget.json')) {
                ret.push(require(dir + '/' + file + '/widget.json'));
            }
        }
    });
    return ret;
};

function loadWidgets(widgetDir) {
    svc.widgets = findPlugins(widgetDir);
}

function init(widgetDir, webserver) {
    loadWidgets(widgetDir);
    webserver.router.route('/api/widgets').get(function(req, res) {
        res.success(svc.widgets);
    });
    //serve any widgets out of the widget subdirectory
    webserver.router.use('/widgets', express.static(widgetDir));
    return svc;
}

module.exports = function(config, webserver) {
    return init(config.widget_directory, webserver);
};