angular.module('hassdash').controller('DashboardCtrl',function($rootScope, $scope, $timeout, $stateParams, dashboardService, deviceTypeService, gridSize){
    var dashname = $stateParams.id;
    $scope.hasError = false;
    $scope.device = {width: 320, height: 480};
    $scope.activePage = 0;
    function loadDashboard() {
        dashboardService.get(dashname).then(function(dash) {
            $scope.dash = dash;
            $rootScope.dashbg = $scope.dash.background;
            deviceTypeService.get(dash.device).then(function(device) {
                $scope.device = device;
            }).catch(function(err) {
                $scope.hasError = true;
                $scope.error = err;
            });
        }).catch(function(err) {
            $scope.hasError = true;
            $scope.error = err;
        });
    }

    dashboardService.onDashboardsUpdated($scope, loadDashboard);

    loadDashboard();


    $scope.dashStyle = function() {
        var gridWidth = 320;
        var gridHeight = 240;

        if ($scope.dash) {
            gridWidth = Math.floor($scope.dash.width/gridSize) * gridSize;
            gridHeight = Math.floor($scope.dash.height/gridSize) * gridSize;

        }

        return {
            "width": gridWidth + "px",
            "height": gridHeight + "px",
            "min-width": gridWidth + "px",
            "min-height": gridHeight + "px"
        };
    };


    function refreshPages() {
        if (!$scope.pageBackup) {
            $scope.pageBackup = $scope.dash.pages;
            $scope.dash.pages = [];
            $timeout(function() {
                $scope.dash.pages = $scope.pageBackup;
                $scope.pageBackup = null;
            }, 1);
        }
    }

    $scope.$watch("dash.height", function(ni, oi) {
        if (ni !== oi) {
            console.log("Height changed to :" + $scope.dash.height);
            refreshPages();
        }
    });

});
