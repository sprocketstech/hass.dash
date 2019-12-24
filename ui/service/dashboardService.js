angular.module('hassdash').factory('dashboardService', function($q) {

    var dashboardService = {};

    dashboardService.getAll = function() {
        var deferred = $q.defer();

        deferred.resolve([
            {
                name: "Main",
                device: "Sprocket X2",
                portrait: true,
                pages: [
                    {widgets: []},
                    {widgets: []}
                ]
            },
            {name: "Test 1", device: "1080P Monitor"},
            {name: "Test 2", device: "Sprocket X5"},
            {name: "Test 3", device: "Sprocket X7"},
            {name: "Test 4", device: "Sprocket X10"},
            {name: "Test 5", device: "Other"},
            {name: "Test 6", device: "Galaxy Tab A"}
        ]);

        return deferred.promise;
    };

    return dashboardService;
});
