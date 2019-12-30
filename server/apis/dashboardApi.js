
var fs = require('fs');
var YAML = require('yaml');

var svc = {
    dashboards: [],
    dashboardStore: ''
};
function loadDashboards() {
    if (fs.statSync(svc.dashboardStore)) {
        const fc = fs.readFileSync(svc.dashboardStore, 'utf8');
        svc.dashboards = YAML.parse(fc);
    }
}

function saveDashboards(newObj) {
    //generate yaml
    var yamlString = YAML.stringify(newObj);
    fs.writeFileSync(svc.dashboardStore, yamlString);
    svc.dashboards = newObj;
}

function init(dashboardStore, webserver) {
    svc.dashboardStore = dashboardStore;
    loadDashboards();
    webserver.router.route('/api/dashboards')
        .get(function(req, res) {
            res.success(svc.dashboards);
        })
        .post(function(req, res) {
            saveDashboards(req.body);
            res.success({});
        });
    return svc;
}

module.exports = function(config, webserver) {
    return init(config.dashboards, webserver);
};