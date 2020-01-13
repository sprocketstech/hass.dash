angular.module('hassdash').directive('mdiIconPicker', function($http) {
    return {
        require: '?ngModel',
        transclude: true,
        restrict: 'A',
        templateUrl: 'directive/mdiIconPicker/mdiIconPicker.html',
        link: function(scope, element, attrs, ngModel) {
            element.addClass('dropdown');
            element.addClass('mdi-picker');
            scope.iconData = [];
            scope.icons = [];
            scope.selected = 'mdi-vector-square';
            ngModel.$render = function () {
              scope.selected = ngModel.$viewValue ? 'mdi-' + ngModel.$viewValue : 'mdi-vector-square';
            };
            var http = $http.get('//cdn.materialdesignicons.com/1.8.36/meta.json');
            http.then(function (resp) {
              scope.iconData = resp.data;
              scope.icons = resp.data.map(function (v) {
                return v.name;
              }).slice(0, 301);
            });
            scope.focusInput = function () {
              if(element.find('input').length > 0) {
                setTimeout(function () {
                element.find('input')[0].focus();
                }, 100);
              }
            };
            scope.searchTerm = '';
            scope.selectIcon = function (icon) {
              scope.selected = 'mdi-' + icon;
              ngModel.$setViewValue(icon);
            };
            scope.$watch('searchTerm', function (term) {
              if (typeof term === 'undefined' ||
                        term === null ||
                        term === '' ||
                        term.length < 2) {
                scope.icons = scope.iconData.map(function (v) {
                  return v.name;
                }).slice(0, 301);
              } else {
                scope.icons = scope.iconData.filter(function (v) {
                  if (v.name.match(term)) {
                    return true;
                  } else {
                    for (var i = 0, c = v.aliases.length; i < c; i++) {
                      if (v.aliases[i].match(term)) {
                        return true;
                      }
                    }
                    return false;
                  }
                }).map(function (v) {
                  return v.name;
                }).slice(0, 301);
              }
            });

        }
    };
});
