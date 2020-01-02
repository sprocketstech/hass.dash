angular.module('hassdash').controller('EditorCtrl',function($scope, _, $uibModal, $timeout, $q, gridSize, dashboardService, deviceTypeService, widgetService) {
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
            device: $scope.deviceTypes[0].name,
            pages: []
        };
        $scope.boards.push(newBoard);
        $scope.selectedBoard = newBoard;
    };

    $scope.saveBoard = function() {
        dashboardService.save($scope.boards);
    };

    $scope.addPage = function() {
        $scope.selectedBoard.pages.push({
            widgets: []
        });
    };

    $scope.editWidget = function(item) {
        var deferred = $q.defer();
        var widgetType = widgetService.get(item.plugin_module, item.plugin_name);
        var modalInstance = $uibModal.open({
            templateUrl: 'editWidget.html',
            controller: 'EditWidgetCtrl',
            controllerAs: '$ctrl',
            size: 'xl',
            resolve: {
              items: function () {
                return {
                    type: widgetType,
                    item: item
                };
              }
            }
          });

          modalInstance.result.then(function (widgetConfig) {
              deferred.resolve(item);
          });

        return deferred.promise;
    };

    $scope.newWidget = function(page, widgetType) {
        var modalInstance = $uibModal.open({
            templateUrl: 'editWidget.html',
            controller: 'EditWidgetCtrl',
            controllerAs: '$ctrl',
            size: 'xl',
            resolve: {
              items: function () {
                return {
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
        var gridWidth = Math.floor($scope.selectedBoard.width/gridSize) * gridSize;
        var gridHeight = Math.floor($scope.selectedBoard.height/gridSize) * gridSize;

        return {
            "width": gridWidth + "px",
            "height": gridHeight + "px",
            "min-width": gridWidth + "px",
            "min-height": gridHeight + "px"
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
        if (ni != oi) {
            //swap the width and height
            var w = $scope.selectedBoard.width;
            $scope.selectedBoard.width = $scope.selectedBoard.height;
            $scope.selectedBoard.height = w;
            refreshPages();
        }
    });
    $scope.$watch("selectedBoard.height", function(ni, oi) {
        if (ni != oi) {
            refreshPages();
        }
    });
});

angular.module('hassdash').controller('EditWidgetCtrl', function ($scope, $uibModalInstance, items, entityService) {
    var $ctrl = this;
    $ctrl.type = items.type;
    if (items.item) {
        $ctrl.model = items.item;
        $ctrl.isNew = false;
    } else {
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
        $ctrl.isNew = true;
    }

    entityService.get($ctrl.type.entity_filter).then(function(results) {
        $ctrl.entities = results;
        if (!$ctrl.model.entity) {
            $ctrl.model.entity = $ctrl.entities[0].entity_id;
        }
    });

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
