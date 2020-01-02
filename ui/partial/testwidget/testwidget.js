angular.module('hassdash').controller('TestwidgetCtrl',function($scope, $window, $timeout, widgetService){
    $scope.testValue = $window.localStorage.getItem('test_widget_value');
    $scope.value = JSON.parse($scope.testValue);
    $scope.testItem = $window.localStorage.getItem('test_widget_item');
    $scope.item = JSON.parse($scope.testItem);
    $scope.$watch('testValue', function(ni, oi) {
        if ($scope.testValue != null) {
            $scope.value = JSON.parse($scope.testValue);
            $window.localStorage.setItem('test_widget_value', $scope.testValue)
        }
    });

    $scope.$watch('testItem', function(ni, oi) {
        if ($scope.testItem != null) {
            $scope.item = JSON.parse($scope.testItem);
            $window.localStorage.setItem('test_widget_item', $scope.testItem);
            $timeout(function() { $scope.$broadcast('widgetConfigChanged'); }, 1);

        }
    });

    $scope.typeOfItem = function(item) {
        return widgetService.get(item.plugin_module, item.plugin_name);
    }
});
