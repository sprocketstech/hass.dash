angular.module('hassdash', ['ui.bootstrap','ui.router','ngAnimate', 'ngTouch', 'oc.lazyLoad', 'ngFitText', 'gridster', 'btford.socket-io']);

angular.module('hassdash').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('editor', {
        url: '/editor',
        templateUrl: 'partial/editor/editor.html'
    });
    $stateProvider.state('dashboard', {
        url: '/dashboard/:id',
        templateUrl: 'partial/dashboard/dashboard.html'
    });
    $stateProvider.state('testwidget', {
        url: '/testwidget',
        templateUrl: 'partial/testwidget/testwidget.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/editor');

});

angular.module('hassdash').constant('_', window._);
angular.module('hassdash').constant('gridSize', 48);

angular.module('hassdash').run(function($rootScope, widgetService, entityService) {
    widgetService.getAll();
    entityService.getAll();
    $rootScope._ = window._;
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
angular.module('hassdash').factory('clientUpdates', function (socketFactory) {
    var socket = socketFactory();
    return socket;
});
