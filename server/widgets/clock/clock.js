
angular.module('hassdash.widget.clock', ['hassdash']);


angular.module('hassdash.widget.clock').controller('clockController', function($scope, $interval) {
    var currentTime = new moment();
    if (!$scope.config.time_format) {
        $scope.config.time_format = 'h:mm A';
    }

    function setTime(){
        currentTime = currentTime.add(1, 'second');
        $scope.time =  currentTime.format($scope.config.time_format);
    }

    setTime();
    // refresh every second
    var promise = $interval(setTime, 1000);
    
    // cancel interval on scope destroy
    $scope.$on('$destroy', function(){
        $interval.cancel(promise);
    });
});

angular.module('hassdash.widget.clock').controller('clockEditController', function($scope, $interval) {
    var currentTime = new moment();
    if (!$scope.config.time_format) {
        $scope.config.time_format = 'h:mm A';
    }

    function setTime(){
        currentTime = currentTime.add(1, 'second');
        $scope.time =  currentTime.format($scope.config.time_format);
    }

    setTime();
    // refresh every second
    var promise = $interval(setTime, 1000);


    // cancel interval on scope destroy
    $scope.$on('$destroy', function(){
        $interval.cancel(promise);
    });
});
