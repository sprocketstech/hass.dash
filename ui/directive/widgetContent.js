angular.module('hassdash').directive('widgetContent', function($log, $q, $window, widgetService, $compile, $controller, $injector) {
    var errorTemplate = '<div class="alert alert-danger">##</div>';
    var loadingTemplate = '\
      <div class="progress progress-striped active">\n\
        <div class="progress-bar" role="progressbar" style="width: 100%">\n\
          <span class="sr-only">loading ...</span>\n\
        </div>\n\
      </div>';

    return {
        replace: true,
        restrict: 'E',
        transclude: true,
        template: '<div></div>',
        scope: {
            type: '=',
            config: '=',
            value: '='
        },
        link: link
    };


    function renderError(element, msg){
        $log.warn(msg);
        element.html(errorTemplate.replace(/##/g, msg));
    }

    function compileWidget(scope, element, content, controller, currentScope) {
        var config = scope.config;
        var value = scope.value;
        var newScope = currentScope;
        var model = {
            config: config,
            value: value
        }
        if (!config){
            renderError(element, 'config is undefined')
        } else if (!content){
            var msg = 'widget content is undefined, please have a look at your browser log';
            renderError(element, msg);
        } else {
            newScope = renderWidget(scope, element, currentScope, model, controller, content);
        }
        return newScope;
    }

    function renderWidget(scope, element, currentScope, model, controller, content) {
        element.html(loadingTemplate);
        //add the template
        var el = angular.element(content);
        //create the child scope
        var templateScope  = scope.$new();
        //provide the config to the scope
        if (!model.config) {
            model.config = {};
        }
        templateScope.config = model.config;
        var locals = {
            $scope: templateScope,
            config: model.config
        };
        if (controller) {
            var templateCtrl = $controller(controller, locals);
            el.children().data('$ngControllerController', templateCtrl);
        }
        $compile(el.contents())(templateScope);
        //$compile(el)(templateScope);
        element.empty();
        element.append(el);
        // destroy old scope
        if (currentScope) {
            currentScope.$destroy();
        }
        return templateScope;
    }

    function link(scope, element, attrs, fn) {
        //load all the needed files
        var toLoad = [];
        //html
        toLoad.push({type: "html", url: scope.type.templateUrl});
        if (scope.type.hasOwnProperty('templateCss')) {
            for (var i=0; i < scope.type.templateCss.length; ++i) {
                toLoad.push({type: "css", url: scope.type.templateCss[i]});
            }
        }
        if (scope.type.hasOwnProperty('templateJs')) {
            for (var i=0; i < scope.type.templateJs.length; ++i) {
                toLoad.push({type: "js", url: scope.type.templateJs[i]});
            }
        }

        //load the widget HTML
        widgetService.load(toLoad).then(function(templateHtml) {
            //wrap the widget in a div so that the module is resolved correctly
            var widgetHTML = '<div ng-app="' + scope.type.module + '">' + templateHtml + '</div>';

            var currentScope = compileWidget(scope, element, widgetHTML, scope.type.controller, null);
            scope.$on('widgetConfigChanged', function() {
                element.width(scope.config.size.width * 48 + 'px');
                element.height(scope.config.size.height * 48 + 'px');
                currentScope = compileWidget(scope, element, widgetHTML, scope.type.controller, currentScope);
            });
            scope.$on('widgetReload', function() {
                currentScope = compileWidget(scope, element, widgetHTML, scope.type.controller, currentScope);
            });
        }).catch(function (err) {
            renderError(element, "Error loading widget template: " + err.message);
        });

        element.width(scope.config.size.width * 48 + 'px');
        element.height(scope.config.size.height * 48 + 'px');
    }
});
