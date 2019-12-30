

module.exports = function(config, webserver) {
    return {
        widgets: require('./widgetApi.js')(config, webserver),
        devices: require('./deviceTypeApi.js')(config, webserver)
    }
}