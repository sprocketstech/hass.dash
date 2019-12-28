angular.module('hassdash').controller('EditorCtrl',function($scope, _, $uibModal, $timeout, dashboardService, deviceTypeService, widgetService) {
    $scope.deviceWidth = 1920;
    $scope.deviceHeight = 1080;
    $scope.deviceTopMargin = 16;
    $scope.deviceBottomMargin = 16;
    $scope.deviceCustomizable = false;

    dashboardService.getAll().then(function(res) {
        $scope.boards = res;
        $scope.selectedBoard = $scope.boards[0];
    });

    deviceTypeService.getAll().then(function(res) {
        $scope.deviceTypes = res;
    });

    widgetService.getAll().then(function(res) {
        $scope.availableWidgets = res;
    });


    $scope.loadBoard = function(name) {
        $scope.selectedBoard = _.first(_.filter($scope.boards, {name: name}));
    };

    $scope.addBoard = function() {
        var newBoard = {
            name: "New Board",
            device: $scope.deviceTypes[0].name
        };
        $scope.boards.push(newBoard);
        $scope.selectedBoard = newBoard;
    };

    $scope.addPage = function() {
        $scope.selectedBoard.pages.push({
            widgets: []
        });
    };

    $scope.newWidget = function(page, widgetType) {
        var modalInstance = $uibModal.open({
            templateUrl: 'newWidget.html',
            controller: 'NewWidgetCtrl',
            controllerAs: '$ctrl',
            size: 'xl',
            resolve: {
              items: function () {
                return {
                    page: page,
                    type: widgetType
                };
              }
            }
          });

          modalInstance.result.then(function (widgetConfig) {
            page.widgets.push(widgetConfig);
          });
    };


    $scope.canvasStyle = function() {
        return {
            "width": $scope.selectedBoard.width + "px",
            "height": $scope.selectedBoard.height + "px",
            "min-width": $scope.selectedBoard.width + "px",
            "min-height": $scope.selectedBoard.height + "px"
        }
    }

    function computeSelectedBoardSize() {
        var device = _.first(_.filter($scope.deviceTypes, {name : $scope.selectedBoard.device}));
        if ($scope.selectedBoard.portrait) {
            $scope.selectedBoard.width = device.height;
            $scope.selectedBoard.height = device.width;
        } else {
            $scope.selectedBoard.width = device.width;
            $scope.selectedBoard.height = device.height;
        }
        $scope.selectedBoard.margin_top = device.margin_top;
        $scope.selectedBoard.margin_bottom = device.margin_bottom;
        $scope.selectedBoard.customizable = device.customizable;
    }

    function refreshPages() {
        if (!$scope.pageBackup) {
            $scope.pageBackup = $scope.selectedBoard.pages;
            $scope.selectedBoard.pages = [];
            $timeout(function() {
                $scope.selectedBoard.pages = $scope.pageBackup;
                $scope.pageBackup = null;
            }, 1);
        }
    }

    $scope.$watch("selectedBoard.device", function(ni, oi) {
        computeSelectedBoardSize();
        refreshPages();

    });

    $scope.$watch("selectedBoard.portrait", function(ni, oi) {
        computeSelectedBoardSize();
        refreshPages();
    });

});

angular.module('hassdash').controller('NewWidgetCtrl', function ($scope, $uibModalInstance, items, entityService) {
    var $ctrl = this;
    $ctrl.type = items.type;
    $ctrl.model = {
        name: $ctrl.type.name,
        plugin_module: $ctrl.type.module,
        plugin_name: $ctrl.type.name,
        size: $ctrl.type.availableSizes[0].value,
        position: {
            row: 0,
            col: 0
        },
        show_label: $ctrl.type.show_label
    };

    entityService.get($ctrl.type.entity_filter).then(function(results) {
        $ctrl.entities = results;
        if (!$ctrl.model.entity) {
            $ctrl.model.entity = $ctrl.entities[0].entity_id;
        }
    });

    $ctrl.entityValue = function() {
        return entityService.getValue($ctrl.model.entity);
    };

    $ctrl.ok = function () {
      $uibModalInstance.close($ctrl.model);
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.$watch(function() {
        return $ctrl.model;
    }, function() {
        $scope.$broadcast('widgetConfigChanged', $ctrl.model);
    }, true);
  });
