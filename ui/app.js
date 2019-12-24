angular.module('hassdash', ['ui.bootstrap','ui.router','ngAnimate']);

angular.module('hassdash').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('editor', {
        url: '/editor',
        templateUrl: 'partial/editor/editor.html'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/editor');

});

angular.module('hassdash').constant('_', window._);

angular.module('hassdash').run(function($rootScope) {
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
