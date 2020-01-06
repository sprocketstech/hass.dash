
angular.module('hassdash.widget.weather_conditions', ['hassdash']);


angular.module('hassdash.widget.weather_conditions').controller('weatherConditionsController', function($scope) {
    $scope.iconSize = 48;
    if ($scope.config.size.y === 1) {
        $scope.iconSize = 22;
        if ($scope.config.size.x === 2) {
            $scope.iconSize = 48;
        }
        if ($scope.config.size.x === 3) {
            $scope.iconSize = 48;
        }
    } else if ($scope.config.size.y === 2) {
        $scope.iconSize = 96;
    } else if ($scope.config.size.y === 3) {
        $scope.iconSize = 144;
    }
});
