angular.module('hassdash').controller('DashboardCtrl',function($scope, $stateParams, dashboardService, deviceTypeService, gridSize){
    var dashname = $stateParams.id;
    $scope.hasError = false;

    $scope.device = {width: 320, height: 480};
    $scope.activePage = 0;

    dashboardService.get(dashname).then(function(dash) {
        $scope.dash = dash;
        deviceTypeService.get(dash.device).then(function(device) {
            $scope.device = device;
        }).catch(function(err) {
            $scope.hasError = true;
            $scope.error = err;
        });
    }).catch(function(err) {
        $scope.hasError = true;
        $scope.error = err;
    })

    $scope.dashStyle = function() {
        var gridWidth = Math.floor($scope.device.width/gridSize) * gridSize;
        var gridHeight = Math.floor($scope.device.height/gridSize) * gridSize;

        return {
            "width": gridWidth + "px",
            "height": gridHeight + "px",
            "min-width": gridWidth + "px",
            "min-height": gridHeight + "px"
        }
    };

});
