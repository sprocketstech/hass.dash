angular.module('hassdash').factory('widgetService', function($q) {

    var widgetService = {};

    widgetService.getAll = function() {
        var deferred = $q.defer();
        deferred.resolve([
            {name: "Clock" },
            {name: "Weather Conditions" },
            {name: "Weather Forecast" },
            {name: "Button" }
        ]);

        return deferred.promise;
    };
    return widgetService;
});
