
module.exports = function(logger, config, webserver) {
    return {
        widgets: require('./widgetApi.js')(config, webserver),
        devices: require('./deviceTypeApi.js')(config, webserver),
        dashboards: require('./dashboardApi.js')(config, webserver),
        entities: require('./entityApi.js')(logger, config, webserver)
    }
}