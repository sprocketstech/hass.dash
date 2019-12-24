angular.module('hassdash').factory('deviceTypeService',function($q) {

    var deviceTypeService = {};
    deviceTypeService.getAll = function() {
        var deferred = $q.defer();

        deferred.resolve([
            {name: "Sprocket X2", width: 320, height: 240, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "Sprocket X5", width: 480, height: 272, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "Sprocket X7", width: 800, height: 480, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "Sprocket X10", width: 1024, height: 600, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "Galaxy S5", width: 640, height: 360, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "Galaxy Tab A", width: 1024, height: 760, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "1080P Monitor", width: 1920, height: 1080, margin_top: 16, margin_bottom: 16, customizable: false },
            {name: "Other", width: 1920, height: 1080, margin_top: 16, margin_bottom: 16, customizable: true }
        ]);

        return deferred.promise;
    };
    return deviceTypeService;
});
