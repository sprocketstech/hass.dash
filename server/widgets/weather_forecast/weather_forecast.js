
angular.module('hassdash.widget.weather_forecast', ['hassdash']);


angular.module('hassdash.widget.weather_forecast').controller('weatherForecastController', function($scope) {

    $scope.iconSize = 32;
    if ($scope.config.size.y === 4) {
        $scope.iconSize = 48;
    }

    $scope.dow = function(dt) {
        var m = moment(dt);
        return m.format('ddd');
    }

});

angular.module('hassdash.widget.weather_forecast').controller('weatherForecastEditController', function($scope) {

    $scope.iconSize = 32;
    if ($scope.config.size.y === 4) {
        $scope.iconSize = 48;
    }

    $scope.dow = function(dt) {
        var m = moment(dt);
        return m.format('ddd');
    }
    $scope.value = 
    { 
       "entity_id":"weather.dark_sky",
       "state":"cloudy",
       "friendly_name":"Dark Sky",
       "icon":"mdi:crosshairs-question",
       "attributes":{ 
          "temperature":58,
          "humidity":79,
          "ozone":276.7,
          "pressure":29.6,
          "wind_bearing":220,
          "wind_speed":6.38,
          "visibility":10,
          "attribution":"Powered by Dark Sky",
          "forecast":[ 
             { 
                "datetime":"2020-01-04T05:00:00+00:00",
                "temperature":59,
                "templow":33,
                "precipitation":0.2,
                "wind_speed":7.39,
                "wind_bearing":297,
                "condition":"rainy"
             },
             { 
                "datetime":"2020-01-05T05:00:00+00:00",
                "temperature":44,
                "templow":31,
                "precipitation":null,
                "wind_speed":12.34,
                "wind_bearing":301,
                "condition":"sunny"
             },
             { 
                "datetime":"2020-01-06T05:00:00+00:00",
                "temperature":47,
                "templow":26,
                "precipitation":null,
                "wind_speed":8.17,
                "wind_bearing":266,
                "condition":"sunny"
             },
             { 
                "datetime":"2020-01-07T05:00:00+00:00",
                "temperature":38,
                "templow":31,
                "precipitation":0.3,
                "wind_speed":6.86,
                "wind_bearing":204,
                "condition":"rainy"
             },
             { 
                "datetime":"2020-01-08T05:00:00+00:00",
                "temperature":34,
                "templow":17,
                "precipitation":null,
                "wind_speed":15.72,
                "wind_bearing":289,
                "condition":"windy"
             },
             { 
                "datetime":"2020-01-09T05:00:00+00:00",
                "temperature":42,
                "templow":34,
                "precipitation":null,
                "wind_speed":5.35,
                "wind_bearing":244,
                "condition":"partlycloudy"
             },
             { 
                "datetime":"2020-01-10T05:00:00+00:00",
                "temperature":55,
                "templow":51,
                "precipitation":null,
                "wind_speed":8.03,
                "wind_bearing":200,
                "condition":"cloudy"
             },
             { 
                "datetime":"2020-01-11T05:00:00+00:00",
                "temperature":67,
                "templow":47,
                "precipitation":0.7,
                "wind_speed":10.76,
                "wind_bearing":197,
                "condition":"rainy"
             }
          ],
          "friendly_name":"Dark Sky"
       }
    };
});