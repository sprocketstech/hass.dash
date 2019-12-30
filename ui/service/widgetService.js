angular.module('hassdash').factory('widgetService', function($q, $http, $ocLazyLoad, _) {

    var templateCache = {}
    var widgetService = {};
    widgetService.cachedWidgets = [];

    widgetService.load = function(urls) {
        var deferred = $q.defer();
        var toLoad = [];
        var htmlUrl = "";
        //TODO: At some point the URL should be configurable
        angular.forEach(urls, function(url) {
            if (url.type == "html") {
                htmlUrl = "/widgets/" + url.url;
            } else {
                toLoad.push("/widgets/" + url.url);
            }

        });
        //load the dependencies
        $ocLazyLoad.load(toLoad).then(function(deps) {
            //dependencies loaded succesfully, load the html
            if (templateCache.hasOwnProperty(htmlUrl)) {
                deferred.resolve(templateCache[htmlUrl]);
            } else {
                $http({
                    method: 'GET',
                    url: htmlUrl
                }).success(function(response){
                    //cache the result
                    templateCache[htmlUrl] = response;
                    deferred.resolve(response);
                }).error(function(error){
                    deferred.reject({message: error});
                });
            }
        }).catch(function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    widgetService.getAll = function() {
        var deferred = $q.defer();
        if (widgetService.cachedWidgets.length === 0) {
            $http({
                method: 'GET',
                url: '/api/widgets'
            }).success(function(response){
                //cache the result
                widgetService.cachedWidgets = response;
                deferred.resolve(widgetService.cachedWidgets);
            }).error(function(error){
                deferred.reject({message: error});
            });
        } else {
            deferred.resolve(widgetService.cachedWidgets);
        }

        return deferred.promise;
    };

    widgetService.get = function(module, name) {
        var widget = _.filter(widgetService.cachedWidgets, function(w) {
            return w.name === name && w.module === module;
        });
        return widget[0];
    };
/*
    var widgets = [
        {
            name: "Clock",
            module: 'hassdash.widget.clock',
            controller: 'clockController',
            show_label: false,
            entity_filter: [
                'sensor.date_time_iso'
            ],
            availableSizes: [
                {name: "Small", value: {x: 2, y: 1}},
                {name: "Medium", value: {x: 3, y: 1}},
                {name: "Large", value: {x: 4, y: 1}},
                {name: "X-Large", value: {x: 6, y: 2}}
            ],
            options: [
                {
                    name: "Time Format",
                    key: "time_format",
                    type: "select",
                    values: [
                            {display: "8:30 PM", value: "h:mm A"},
                            {display: "8:30:33 PM", value: "h:mm:ss A"},
                            {display: "20:30", value: "HH:mm"},
                            {display: "20:30:33", value: "HH:mm:ss"}

                    ]
                },

            ],
            templateUrl: 'clock/clock.html',
            templateCss: ['clock/clock.css'],
            templateJs: ['clock/clock.js']
        },
        {
            name: "Date",
            module: 'hassdash.widget.date',
            controller: 'dateController',
            show_label: false,
            entity_filter: [
                'sensor.date_time_iso'
            ],
            availableSizes: [
                {name: "Small", value: {x: 2, y: 1}},
                {name: "Medium", value: {x: 3, y: 1}},
                {name: "Large", value: {x: 4, y: 1}}
            ],
            options: [
                {
                    name: "Date Format",
                    key: "date_format",
                    type: "select",
                    values: [
                            {display: "Friday, August 2nd 1985", value: "dddd, MMMM Do YYYY"},
                            {display: "8/2/1985", value: "M/D/YYYY"},
                            {display: "8/2/85", value: "M/D/YY"},
                            {display: "August 2, 1985", value: "MMMM D, YYYY"},
                            {display: "Aug 2, 1985", value: "MMM D, YYYY"}

                    ]
                }
            ],
            templateUrl: 'date/date.html',
            templateCss: ['date/date.css'],
            templateJs: ['date/date.js']
        },
        { name: "Weather Conditions", plugin: 'sprockets.widget.weather_conditions' },
        { name: "Weather Forecast", plugin: 'sprockets.widget.weather_forecast' },
        { name: "Button", plugin: 'sprockets.widget.button' }
    ];
*/
    return widgetService;
});
