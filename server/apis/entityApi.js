
const hass = require('../backend/hass.js');

function init(log, config, webserver, backend) {
    var clientHandler = webserver.clientHandler;

    backend.onEntityChange(function(new_ent) {
        log.debug("Entity change for " + new_ent.entity_id + ", publishing.");
        clientHandler.sockets.emit('entity.changed', new_ent);
    });

    webserver.router.route('/api/entities')
        .get(function(req, res) {
            res.success(backend.states());
        });
    return {};
}

module.exports = function(logger, config, webserver, backend) {
    return init(logger, config, webserver, backend);
};