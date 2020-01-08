angular.module('hassdash').factory('deviceTypeService',function($http, $q) {

    var deviceTypeService = {};

    deviceTypeService.cachedDevices = [];
    deviceTypeService.getAll = function() {
        var deferred = $q.defer();
        if (deviceTypeService.cachedDevices.length === 0) {
            $http({
                method: 'GET',
                url: 'api/devices'
            }).success(function(response){
                //cache the result
                deviceTypeService.cachedDevices = response;
                deferred.resolve(deviceTypeService.cachedDevices);
            }).error(function(error){
                deferred.reject({message: error});
            });
        } else {
            deferred.resolve(deviceTypeService.cachedDevices);
        }

        return deferred.promise;
    };

    deviceTypeService.get = function(name) {
        var deferred = $q.defer();
        deviceTypeService.getAll().then(function(response) {
            var dt = _.filter(response, function(d) {
                return d.name === name;
            });
            if (dt.length > 0) {
                deferred.resolve(dt[0]);
            } else {
                deferred.reject("Device type " + name + " was not found.");
            }
        });
        return deferred.promise;
    };

    return deviceTypeService;
});
