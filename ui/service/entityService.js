angular.module('hassdash').factory('entityService',function($http, $q, _, clientUpdates) {

    var entityService = {};
    entityService.entities = [];

    entityService.getAll = function() {
        var deferred = $q.defer();
        if (entityService.entities.length > 0) {
            deferred.resolve(entityService.entities);
        } else {
            $http({
                method: 'GET',
                url: 'api/entities'
            }).success(function(response){
                entityService.entities = response;
                deferred.resolve(entityService.entities);
            }).error(function(error){
                deferred.reject({message: error});
            });
        }

        return deferred.promise;
    };

    entityService.get = function(filters) {
        var deferred = $q.defer();
        entityService.getAll().then(function(results) {
            var filterRegexp = [];
            for (var i=0; i < filters.length; ++i) {
                filterRegexp.push(new RegExp(filters[i]));
            }
            var filtered = _.filter(results, function(e) {
                for (var i=0; i < filterRegexp.length; ++i) {
                    if (filterRegexp[i].test(e.entity_id)) {
                        return true;
                    }
                }
                return false;
            });
            deferred.resolve(filtered);
        }).catch(function (err) {
            deferred.reject({message: err});
        });
        return deferred.promise;
    };

    entityService.getEntity = function(entity_id) {
        var deferred = $q.defer();
        entityService.getAll().then(function(results) {
            var filtered = _.filter(results, function(e) {
                if (e.entity_id === entity_id) {
                    return true;
                }
                return false;
            });
            if (filtered.length > 0) {
                deferred.resolve(filtered[0]);
            } else {
                deferred.reject({message: "Entity " + entity_id + " was not found."});
            }

        }).catch(function (err) {
            deferred.reject({message: err});
        });

        return deferred.promise;
    };


    entityService.onStateChange = function(scope, callback) {
        clientUpdates.forward('entity.changed', scope);
        var unbind = scope.$on('socket:entity.changed', function(event, data) {
            callback(data);
        });
        scope.$on('$destroy', function() {
            unbind();
        });
    };

    return entityService;
});
