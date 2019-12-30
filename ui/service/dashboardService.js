angular.module('hassdash').factory('dashboardService', function($http, $q) {

    var dashboardService = {};

    dashboardService.get = function() {
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
