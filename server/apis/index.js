
module.exports = function(logger, config, webserver) {
    
    const hass = require('../backend/hass.js');
    hass.init(logger, config.hass_url, config.hass_llat);
    return {
        widgets: require('./widgetApi.js')(config, webserver),
        devices: require('./deviceTypeApi.js')(config, webserver),
        dashboards: require('./dashboardApi.js')(config, webserver),
        entities: require('./entityApi.js')(logger, config, webserver, hass),
        calendars: require('./calendarApi.js')(logger, config, webserver, hass)
    }
}