angular.module('hassdash').factory('entityService',function($q, _) {

    var entityService = {};

    var entities = [
        {
            friendly_name: 'Date & Time ISO',
            icon: 'mdi:calendar-clock',
            entity_id: 'sensor.date_time_iso',
            state: '2019-12-26T08:44:00'
        }
    ]

    entityService.get = function(filters) {
        var deferred = $q.defer();

        var filterRegexp = [];
        for (var i=0; i < filters.length; ++i) {
            filterRegexp.push(new RegExp(filters[i]));
        }

        var filtered = _.filter(entities, function(e) {
            for (var i=0; i < filterRegexp.length; ++i) {
                if (filterRegexp[i].test(e.entity_id)) {
                    return true;
                }
            }
            return false;
        });
        deferred.resolve(filtered);
        return deferred.promise;
    }

    entityService.getValue = function(entity_id) {
        var ent = _.filter(entities, function(e) { return e.entity_id === entity_id; });
        return ent[0].state;
    }


    return entityService;
});
