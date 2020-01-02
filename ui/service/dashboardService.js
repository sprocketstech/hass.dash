angular.module('hassdash').factory('dashboardService', function($http, $q, _) {

    var dashboardService = {};

    dashboardService.getAll = function() {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/dashboards'
        }).success(function(response){
            deferred.resolve(response);
        }).error(function(error){
            deferred.reject({message: error});
        });
        return deferred.promise;
    };

    dashboardService.get = function(name) {
        var deferred = $q.defer();
        dashboardService.getAll().then(function(response) {
            var dash = _.filter(response, function(d) {
                return d.name === name;
            });
            if (dash.length > 0) {
                deferred.resolve(dash[0]);
            } else {
                deferred.reject("Dashboard " + name + " was not found.");
            }
        });
        return deferred.promise;
    };

    dashboardService.save = function(obj) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/dashboards',
            data: obj
        }).success(function(response){
            deferred.resolve(response);
        }).error(function(error){
            deferred.reject({message: error});
        });
        return deferred.promise;
    };
    return dashboardService;
});
