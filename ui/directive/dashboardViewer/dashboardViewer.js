angular.module('hassdash').directive('dashboardViewer', function(gridSize, widgetService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            items: '=',
            width: '=',
            height: '='
        },
        templateUrl: 'directive/dashboardViewer/dashboardViewer.html',
        link: function(scope, element, attrs, fn) {
            scope.customItemMap = {
                sizeX: 'item.size.x',
                sizeY: 'item.size.y',
                row: 'item.position.row',
                col: 'item.position.col'
            };

            scope.gridsterOpts = {
                isMobile: false,
                mobileModeEnabled: false,
                columns: Math.floor(scope.width / gridSize), // the width of the grid, in columns
                pushing: false,
                floating: false,
                swapping: false,
                width: scope.width,
                colWidth: gridSize,
                rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
                margins: [0, 0], // the pixel distance between each widget
                outerMargin: false, // whether margins apply to outer edges of the grid
                sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
                minColumns:  Math.floor(scope.width / gridSize),
                minRows:   Math.floor(scope.height / gridSize),
                maxRows:  Math.floor(scope.height / gridSize),
                defaultSizeX: 1, // the default width of a gridster item, if not specifed
                defaultSizeY: 1, // the default height of a gridster item, if not specified
                minSizeX: 1, // minimum column width of an item
                maxSizeX: null, // maximum column width of an item
                minSizeY: 1, // minumum row height of an item
                maxSizeY: null, // maximum row height of an item
                resizable: {
                   enabled: false,
                },
                draggable: {
                   enabled: false
                }
            };


            scope.typeOfItem = function(item) {
                return widgetService.get(item.plugin_module, item.plugin_name);
            }


        }
    };
});
