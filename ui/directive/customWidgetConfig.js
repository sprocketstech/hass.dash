angular.module('hassdash').directive('customWidgetConfig', function($log, $compile, $controller, widgetService) {


    var errorTemplate = '<div class="alert alert-danger">##</div>';
    var loadingTemplate = '\
      <div class="progress progress-striped active">\n\
        <div class="progress-bar" role="progressbar" style="width: 100%">\n\
          <span class="sr-only">loading ...</span>\n\
        </div>\n\
      </div>';

    function renderError(element, msg){
        $log.warn(msg);
        element.html(errorTemplate.replace(/##/g, msg));
    }


    function compileWidget(scope, element, content, controller, currentScope) {
        if (!scope.config){
            renderError(element, 'config is undefined');
            return;
        } else if (!content){
            var msg = 'widget content is undefined, please have a look at your browser log';
            renderError(element, msg);
            return;
        }

        element.html(loadingTemplate);
        //create an element from the HTML
        var el = angular.element(content);
        //create the child scope
        var configScope  = scope.$new();
        //provide the config and value to the scope
        configScope.config = scope.config;

        //create the controller
        var configCtrl = $controller(controller, {$scope: configScope});
        el.children().data('$ngControllerController', configCtrl);

        $compile(el.contents())(configScope);

        //replace the directive element with the widget element
        element.empty();
        element.append(el);
    }

    function link(scope, element, attrs, fn) {
        //load all the needed files
        var toLoad = [];
        //load the html
        toLoad.push({type: "html", url: scope.type.configUrl});
        //if any css defined, add it to the load list
        if (scope.type.hasOwnProperty('templateCss')) {
            for (var i=0; i < scope.type.templateCss.length; ++i) {
                toLoad.push({type: "css", url: scope.type.templateCss[i]});
            }
        }
        //if any js defined, add it to the load list
        if (scope.type.hasOwnProperty('templateJs')) {
            for (var j=0; j < scope.type.templateJs.length; ++j) {
                toLoad.push({type: "js", url: scope.type.templateJs[j]});
            }
        }
        var controller = scope.type.configController;
        //load the widget HTML and dependencies
        widgetService.load(toLoad).then(function(templateHtml) {
            //wrap the widget in a div so that the module is resolved correctly
            var configHTML = '<div ng-app="' + scope.type.module + '">' + templateHtml + '</div>';
            compileWidget(scope, element, configHTML, controller, null);
        }).catch(function (err) {
            renderError(element, "Error loading widget template: " + err.message);
        });
    }


    return {
        replace: true,
        restrict: 'E',
        transclude: true,
        template: '<div></div>',
        scope: {
            type: '=',
            config: '='
        },
        link: link
    };
});
