angular.module('hassdash').factory('widgetService', function($q) {

    var widgetService = {};

    widgetService.getAll = function() {
        var deferred = $q.defer();
        deferred.resolve([
            {
                name: "Clock",
                plugin: 'sprockets.widget.clock',
                show_label: false,
                entity_filter: [
                    'sensor.date_time_iso'
                ],
                availableSizes: [
                    {name: "Small", value: {width: 1, height: 1}},
                    {name: "Medium", value: {width: 1, height: 2}},
                    {name: "Large", value: {width: 1, height: 3}}
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
                    {
                        name: "Show Date?",
                        key: "show_date",
                        type: "boolean"
                    },
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
                    },
                ]
            },
            { name: "Weather Conditions", plugin: 'sprockets.widget.weather_conditions' },
            { name: "Weather Forecast", plugin: 'sprockets.widget.weather_forecast' },
            { name: "Button", plugin: 'sprockets.widget.button' }
        ]);

        return deferred.promise;
    };
    return widgetService;
});
