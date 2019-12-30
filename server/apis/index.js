

module.exports = function(config, webserver) {
    return {
        widgets: require('./widgetApi.js')(config, webserver)
    }
}