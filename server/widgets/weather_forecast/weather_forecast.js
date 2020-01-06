
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
