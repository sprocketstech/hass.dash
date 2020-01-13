

function init(log, config, webserver, backend) {
    webserver.router.route('/api/calendar/:calendarId')
        .get(function(req, res) {
            var id = req.params.calendarId;
            var start = req.query.start;
            var end = req.query.end;
            log.info("Querying calendar " + id + " from " + start + " to " + end);
            backend.getCalendar(id, start, end).then(function (results) {
                res.success(results.data);
            }).catch(error => {
                backend._logError(error);
                //TODO: Error
                res.success([]);
            });
        });
    return {};
}

module.exports = function(logger, config, webserver, backend) {
    return init(logger, config, webserver, backend);
};