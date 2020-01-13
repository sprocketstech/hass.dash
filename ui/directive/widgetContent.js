angular.module('hassdash').directive('widgetContent', function($log, _, widgetService, entityService, $compile, $controller, gridSize) {


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

    function monitorEntities(widgetScope) {

        if (widgetScope.config.entities && widgetScope.config.entities.length > 0) {
            entityService.onStateChange(widgetScope, function(event) {
                if (_.includes(widgetScope.config.entities, event.entity_id)) {
                    //this update matches and entity we are watching, push it
                    //to the widget
                    widgetScope.values[event.entity_id] = event;
                }
            });
            //set the initial values
            widgetScope.values = {};
            for (var i=0; i < widgetScope.config.entities.length; ++i) {
                (function(index, e, w) {
                    e.getEntity(w.config.entities[index]).then(function (val) {
                        w.values[w.config.entities[index]]= val;
                   });
                })(i, entityService, widgetScope);
            }
        }
    }

    function monitorEntity(widgetScope) {
        entityService.onStateChange(widgetScope, function(event) {
            if (event.entity_id === widgetScope.config.entities[0]) {
                //this update matches the entity we are watching, push it
                widgetScope.value = event;
            }
        });
        //set the initial value
        entityService.getEntity(widgetScope.config.entities[0]).then(function (val) {
            widgetScope.value = val;
        });
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
        var widgetScope  = scope.$new();
        //provide the config and value to the scope
        widgetScope.config = scope.config;

        //start the value updater
        if (scope.editable === false || scope.editable === "false") {
            if (scope.type.num_entities === 'one') {
                widgetScope.value = scope.value;
                monitorEntity(widgetScope);
            } else if (scope.type.num_entities === 'many') {
                monitorEntities(widgetScope);
            }

        }

        widgetScope.foregroundColor = scope.foreground;
        widgetScope.backgroundColor = scope.background;
        //create the controller
        var widgetCtrl = $controller(controller, {$scope: widgetScope});
        el.children().data('$ngControllerController', widgetCtrl);

        $compile(el.contents())(widgetScope);

        //replace the directive element with the widget element
        element.empty();
        element.append(el);
        // destroy old scope
        if (currentScope) {
            currentScope.$destroy();
        }
        currentScope = widgetScope;

        return currentScope;
    }

    function link(scope, element, attrs, fn) {
        //load all the needed files
        var toLoad = [];
        //load the html
        toLoad.push({type: "html", url: scope.type.templateUrl});
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
        var controller = scope.editable === true || scope.editable === "true" ? scope.type.editController : scope.type.controller;
        if (!controller) {
            controller = scope.type.controller;
        }
        //load the widget HTML and dependencies
        widgetService.load(toLoad).then(function(templateHtml) {
            //wrap the widget in a div so that the module is resolved correctly
            var widgetHTML = '<div ng-app="' + scope.type.module + '">' + templateHtml + '</div>';

            var currentScope = compileWidget(scope, element, widgetHTML, controller, null);

            scope.$on('widgetConfigChanged', function() {
                element.width(scope.config.size.x * gridSize + 'px');
                element.height(scope.config.size.y * gridSize + 'px');
                currentScope = compileWidget(scope, element, widgetHTML, controller, currentScope);
            });

        }).catch(function (err) {
            renderError(element, "Error loading widget template: " + err.message);
        });

        element.width(scope.config.size.x * 48 + 'px');
        element.height(scope.config.size.y * 48 + 'px');
    }


    return {
        replace: true,
        restrict: 'E',
        transclude: true,
        template: '<div></div>',
        scope: {
            type: '=',
            config: '=',
            value: '=',
            foreground: '=',
            background: '=',
            editable: '@'
        },
        link: link
    };

});
