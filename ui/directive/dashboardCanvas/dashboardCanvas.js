angular.module('hassdash').directive('dashboardCanvas', function($timeout, widgetService, entityService, gridSize, _) {
    var direc = {
        restrict: 'E',
        replace: true,
        scope: {
            items: '=',
            width: '=',
            height: '=',
            foreground: '=',
            background: '=',
            onEdit: '&'
        },
        templateUrl: 'directive/dashboardCanvas/dashboardCanvas.html',
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
                pushing: true,
                floating: false,
                swapping: true,
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
                   enabled: true,
                   handle: '.drag-handle'
                }
            };


            scope.overlayStyle = function(item) {
                var itemHeight = item.size.y * gridSize;

                return {
                    "line-height": itemHeight + "px"
                };
            };


            scope.typeOfItem = function(item) {
                return widgetService.get(item.plugin_module, item.plugin_name);
            };

            scope.hoverIn = function(item) {
                item.$element.find('.widget-content-overlay').css('display', 'block');
            };
            scope.hoverOut = function(item) {
                item.$element.find('.widget-content-overlay').css('display', 'none');
            };

            scope.remove = function(item) {
                scope.items = _.remove(scope.items, function(o) { return o !== item; });
            };

            scope.edit = function(item) {
                var editItem = _.cloneDeep(item);
                scope.onEdit()(editItem).then(function(res) {
                    scope.remove(item);
                    scope.items.push(res);
                    $timeout(function() {
                        scope.$broadcast('widgetConfigChanged');
                    },1);

                });
            };

            scope.$watch('width', function() {
                scope.gridsterOpts.columns = Math.floor(scope.width / gridSize);
                scope.gridsterOpts.minColumns = Math.floor(scope.width / gridSize);
                //move any item now out of bounds to column 0
                for (var i=0; i < scope.items.length; ++i) {
                    if (scope.items[i].position.col + scope.items[i].size.x > scope.gridsterOpts.columns) {
                        scope.items[i].position.col = 0;
                    }
                }
            });
            scope.$watch('height', function() {
                scope.gridsterOpts.minRows = Math.floor(scope.height / gridSize);
                scope.gridsterOpts.maxRows = Math.floor(scope.height / gridSize);
                //move any item now out of bounds to row 0
                for (var i=0; i < scope.items.length; ++i) {
                    if (scope.items[i].position.row + scope.items[i].size.y > scope.gridsterOpts.maxRows) {
                        scope.items[i].position.row = 0;
                    }
                }
            });
            scope.$watch('background', function() {
                $timeout(function() {
                    scope.$broadcast('widgetConfigChanged');
                },1);
            });

        }
    };
    return direc;
});
