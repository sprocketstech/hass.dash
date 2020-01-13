angular.module('hassdash').factory('calendarService', function($q, $http) {

    var calendarService = {};
    function randomDate(dt) {
        return dt.add(Math.random() * 720, 'hours');
     }

    calendarService.getEvents = function(calendarId, start, end) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: 'api/calendar/' + calendarId + '?start=' + start.toISOString() + '&end=' + end.toISOString()
        }).success(function(response){
            deferred.resolve(response);
        }).error(function(error){
            deferred.reject({message: error});
        });
        return deferred.promise;
    };

    return calendarService;
});
