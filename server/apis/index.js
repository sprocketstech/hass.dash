

module.exports = function(webserver) {
    return {
        widgets: require('./widgetApi.js')(webserver)
    }
}