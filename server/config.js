"use strict";
var fs = require("fs");

module.exports = function(argv) {
    var overrideFile = __dirname + "/config.json";

    var config = {
        log_level: 'debug',
        html_root: __dirname + '/../ui/',
        web_port: 9044,
        widget_directory: __dirname + '/widgets',
        devices_directory: __dirname + '/devices',
        dashboards: __dirname + '/dashboards.yaml',
        hass_url: "http://192.168.56.102:8123/api/",
        hass_llat: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyYTRiMzU0ZTg4NjM0ZjM2YmRkMWZkNjU1NTVlZmM5ZSIsImlhdCI6MTU3NzczMjE1OSwiZXhwIjoxODkzMDkyMTU5fQ.wgbVeItK-CyXZjli36xSd2NkQZQxwpbGodVE3rYIJq0"
    }

    try {
        if (fs.statSync(overrideFile)) {
            const fc = fs.readFileSync(overrideFile, 'utf8');
            var overrides = JSON.parse(fc);
            for (var i in overrides) {
                var val = overrides[i];
                if (val.startsWith("$")) {
                    val = process.env[val.substring(1)]
                }
                console.log("Overriding " + i + " with " + val);
                config[i] = val;
            }
        }
    } catch (err) {

    }


    return config;
}
