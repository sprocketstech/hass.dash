angular.module('hassdash').controller('TestwidgetCtrl',function($scope, $window, $timeout, widgetService){
    $scope.testItem = $window.localStorage.getItem('test_widget_item');
    $scope.item = JSON.parse($scope.testItem);
    $scope.foreground = 'black';
    $scope.background = 'white';

    $scope.$watch('testItem', function(ni, oi) {
        if ($scope.testItem != null) {
            $scope.item = JSON.parse($scope.testItem);
            $window.localStorage.setItem('test_widget_item', $scope.testItem);
            $timeout(function() { $scope.$broadcast('widgetConfigChanged'); }, 1);

        }
    });


    $scope.$watch("background", function(ni, oi) {
        $scope.foreground = $scope.background === 'white' ? 'black' : 'white';
    });

    $scope.typeOfItem = function(item) {
        return widgetService.get(item.plugin_module, item.plugin_name);
    };
});
