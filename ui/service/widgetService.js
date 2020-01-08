angular.module('hassdash').factory('widgetService', function($q, $http, $ocLazyLoad, _) {

    var templateCache = {};
    var widgetService = {};
    widgetService.cachedWidgets = [];

    widgetService.load = function(urls) {
        var deferred = $q.defer();
        var toLoad = [];
        var htmlUrl = "";
        //TODO: At some point the URL should be configurable
        angular.forEach(urls, function(url) {
            if (url.type === "html") {
                htmlUrl = "widgets/" + url.url;
            } else {
                toLoad.push("widgets/" + url.url);
            }

        });
        //load the dependencies
        $ocLazyLoad.load(toLoad).then(function(deps) {
            //dependencies loaded succesfully, load the html
            if (templateCache.hasOwnProperty(htmlUrl)) {
                deferred.resolve(templateCache[htmlUrl]);
            } else {
                $http({
                    method: 'GET',
                    url: htmlUrl
                }).success(function(response){
                    //cache the result
                    templateCache[htmlUrl] = response;
                    deferred.resolve(response);
                }).error(function(error){
                    deferred.reject({message: error});
                });
            }
        }).catch(function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    widgetService.getAll = function() {
        var deferred = $q.defer();
        if (widgetService.cachedWidgets.length === 0) {
            $http({
                method: 'GET',
                url: 'api/widgets'
            }).success(function(response){
                //cache the result
                widgetService.cachedWidgets = response;
                deferred.resolve(widgetService.cachedWidgets);
            }).error(function(error){
                deferred.reject({message: error});
            });
        } else {
            deferred.resolve(widgetService.cachedWidgets);
        }

        return deferred.promise;
    };

    widgetService.get = function(module, name) {
        var widget = _.filter(widgetService.cachedWidgets, function(w) {
            return w.name === name && w.module === module;
        });
        return widget[0];
    };
    return widgetService;
});
