angular.module('hassdash').directive('dashboardCanvas', function($timeout) {
    var direc = {
        restrict: 'E',
        replace: true,
        scope: {

        },
        templateUrl: 'directive/dashboardCanvas/dashboardCanvas.html',
        gridSize: 48,
        link: function(scope, element, attrs, fn) {
            scope.grid = [];
            element.ready(function () {
                var height, width;
                $timeout(function () {
                  height  = element.height();
                  width  = element.width();
                  direc.layout(scope, width, height);
                });
            });
            element.resize(function(e) {
                height  = $(e.target).height();
                width  = $(e.target).width();
                scope.$apply(direc.layout(scope, width, height));
            });
        },
        layout: function(scope, width, height) {
            var columns = Math.floor(width / direc.gridSize);
            var rows = Math.floor(height / direc.gridSize);
            var lmargin = (width % direc.gridSize)/2;
            var tmargin = (height % direc.gridSize)/2;
            var totalElements = columns * rows;
            scope.rows = rows;
            scope.columns = columns;
            scope.margins = {
                "margin-left": lmargin + "px",
                "margin-top": tmargin + "px"
            };
        }
    };
    return direc;
});
