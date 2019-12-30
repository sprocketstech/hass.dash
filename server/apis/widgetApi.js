var svc = {
    widgets: []
};

var findPlugins = function(dir) {
    var ret = [];
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            //look for a config.json file
            if (fs.statSync(dir + '/' + file + '/config.json')) {
                ret.push(require(dir + '/' + file + '/config.json'));
            }
        }
    });
    return ret;
};

function loadWidgets() {
    //widgets are in a subdirectory "widgets"
    //at some point this should be configurable....
    var widgetDir = __dirname + "/../widgets";
    svc.widgets = findPlugins(widgetDir);
}

function init(webserver) {
    loadWidgets();
    webserver.router.route('/api/widgets').get(function(req, res) {
        res.success(svc.widgets);
    });
    return svc;
}

module.exports = function(webserver) {
    return init(webserver);
};