"use strict";

module.exports = function(argv) {
    var config = {
        log_level: 'debug',
        html_root: __dirname + '/../ui/',
        web_port: 8099,
        widget_directory: __dirname + '/widgets',
        devices_directory: __dirname + '/devices',
        dashboards: __dirname + '/dashboards.yaml',
        hass_url: "http://192.168.56.102:8123/api/",
        hass_llat: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyYTRiMzU0ZTg4NjM0ZjM2YmRkMWZkNjU1NTVlZmM5ZSIsImlhdCI6MTU3NzczMjE1OSwiZXhwIjoxODkzMDkyMTU5fQ.wgbVeItK-CyXZjli36xSd2NkQZQxwpbGodVE3rYIJq0"
    }
    return config;
}
