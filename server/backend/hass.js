"use strict";

const axios = require('axios');
const es = require('eventsource');
const util = require('util');

var hass_svc = {
    entityChangedCBs: []
}

hass_svc.states = {}

hass_svc.init = function(logger, url, llat) {
    hass_svc.logger = logger;
    hass_svc.url = url;
    hass_svc.token = llat;
    
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + hass_svc.token;
    hass_svc._load();
}

hass_svc.states = function() {
    var ret = [];
    for (var i in hass_svc.states) {
        ret.push(hass_svc.states[i]);
    }
    return ret;
}

hass_svc.onEntityChange = function(cb) {
    hass_svc.entityChangedCBs.push(cb);
    hass_svc.logger.debug(hass_svc.entityChangedCBs.length + " client registered")
}

hass_svc._logError = function(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        hass_svc.logger.error("Error accessing " + error.config && error.config.url ? error.config.url : hass_svc.url + ": (" + error.response.status + ") " + error.response.statusText);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        hass_svc.logger.error("No response while accessing " + error.config && error.config.url ? error.config.url : hass_svc.url);
    } else {
        // Something happened in setting up the request that triggered an Error
        hass_svc.logger.error("Error accessing " + error.config && error.config.url ? error.config.url : hass_svc.url + ": " + error.message);
    }
}

hass_svc._loadConfig = function() {
    hass_svc.logger.info("Loading config from " + hass_svc.url);
    axios.get(hass_svc.url + "/config")
        .then(response => {
            hass_svc.info = {
                elevation: response.data.elevation,
                latitude: response.data.latitude,
                longitude: response.data.longitude,
                time_zone: response.data.time_zone,
                length_units: response.data.unit_system.length,
                mass_units: response.data.unit_system.mass,
                temperature_units: response.data.unit_system.temperature,
                volume_units: response.data.unit_system.volume
            };
            hass_svc.logger.info("Config load complete")
        })
        .catch(error => {
            hass_svc.logger.info("Config load failed")
            hass_svc._logError(error);
        });
};

hass_svc._loadEvents = function() {
    hass_svc.logger.debug("Loading events from " + hass_svc.url);
    axios.get(hass_svc.url + "/events")
        .then(response => {
            hass_svc.events = [];
            for (var i=0; i < response.data.length; ++i) {
                hass_svc.events.push(response.data[i].event);
            }
        })
        .catch(error => {
            hass_svc._logError(error);
        });
};

hass_svc._loadStates = function() {
    hass_svc.logger.debug("Loading states from " + hass_svc.url);
    axios.get(hass_svc.url + "/states")
        .then(response => {
            for (var i=0; i < response.data.length; ++i) {
                hass_svc.states[response.data[i].entity_id] = {
                    entity_id: response.data[i].entity_id,
                    state: response.data[i].state
                };
                hass_svc._loadState(response.data[i].entity_id)
            }
        })
        .catch(error => {
            hass_svc._logError(error);
        });
};
hass_svc._publishStateChange = function(state) {
    for (var i=0; i < hass_svc.entityChangedCBs.length; ++i) {
        hass_svc.entityChangedCBs[i](state);
    }
};

hass_svc._loadState = function(id) {
    hass_svc.logger.debug("Loading state " + id + " from " + hass_svc.url);
    axios.get(hass_svc.url + "/states/" + id)
        .then(response => {
            hass_svc.states[id].friendly_name = response.data.friendly_name || response.data.attributes.friendly_name || id;
            hass_svc.states[id].icon = response.data.attributes.icon || 'mdi:crosshairs-question';
            hass_svc.states[id].attributes = response.data.attributes;
        })
        .catch(error => {
            hass_svc._logError(error);
        });
};


hass_svc._subscribeToStates = function() {
    var eventSourceInitDict = {headers: {'Authorization': 'Bearer ' + hass_svc.token}};
    hass_svc.updates = new es(hass_svc.url + "/stream", eventSourceInitDict);
    hass_svc.updates.onmessage = function(event) {
        try {
            var dt = JSON.parse(event.data);
            if (dt.event_type === "state_changed") {
                var stateData = dt.data.new_state;
                var eid = stateData.entity_id;
                hass_svc.logger.debug("State update for " + eid);
                if (!hass_svc.states.hasOwnProperty(eid)) {
                    hass_svc.states[eid] = {
                        entity_id: eid,
                        friendly_name: stateData.friendly_name || response.data.attributes.friendly_name || id,
                        icon: stateData.attributes.icon || 'mdi:crosshairs-question',
                        state: stateData.state,
                        attributes: stateData.attributes
                    };
                } else {
                    hass_svc.states[eid].state = stateData.state;
                    hass_svc.states[eid].attributes = stateData.attributes;
                }
                hass_svc._publishStateChange(hass_svc.states[eid]);
            } else {
                //console.log("Unknown event type: " + dt.event_type);
            }
        } catch (e) {
            //TODO: Log console.log(e);
            // Intentionally ignored...
        }
        
    };
    hass_svc.updates.onerror = function (err) {
        hass_svc._logError(err);
    };
};

hass_svc._load = function() {
    hass_svc.logger.info("Checking hass at " + hass_svc.url);
    axios.get(hass_svc.url + '/')
        .then(response => {
            if (response.data.message) {
                hass_svc.logger.debug("HASS API at " + hass_svc.url + " responds: " + response.data.message);
                hass_svc._loadConfig();
                hass_svc._loadStates();
                hass_svc._subscribeToStates();
            } else {
                hass_svc.logger.error("Something went wrong querying the HASS api: " + response.data);
            }
        })
        .catch(error => {
            hass_svc._logError(error);
        });
}
module.exports = hass_svc;
/*function(log, config) {
    hass_svc.init(log, config.hass_url, config.hass_llat);
    return hass_svc;
}*/