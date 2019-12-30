var path = require('path');

var svc = {
    devices: []
};

var findPlugins = function(dir) {
    var ret = [];
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    files.forEach(function(file) {
        if (path.extname(file) === '.json') {
            ret.push(require(dir + '/' + file));
        }
    });
    return ret;
};

function loadDevices(deviceDir) {
    svc.devices = findPlugins(deviceDir);
}

function init(deviceDir, webserver) {
    loadDevices(deviceDir);
    webserver.router.route('/api/devices').get(function(req, res) {
        res.success(svc.devices);
    });
    return svc;
}

module.exports = function(config, webserver) {
    return init(config.devices_directory, webserver);
};