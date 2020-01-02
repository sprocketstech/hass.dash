
const hass = require('../backend/hass.js');
const io = require('socket.io');

function init(log, config, webserver) {
    var clientHandler = io.listen(webserver.server);

    hass.init(log, config.hass_url, config.hass_llat);
    hass.onEntityChange(function(new_ent) {
        console.log("Test")
        log.debug("Entity change for " + new_ent.entity_id + ", publishing.");
        clientHandler.sockets.emit('entity.changed', new_ent);
    });

    webserver.router.route('/api/entities')
        .get(function(req, res) {
            res.success(hass.states());
        });
    return {};
}

module.exports = function(logger, config, webserver) {
    return init(logger, config, webserver);
};