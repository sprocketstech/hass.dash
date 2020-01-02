
angular.module('hassdash.widget.clock', ['hassdash']);


angular.module('hassdash.widget.clock').controller('clockController', function($scope, $interval) {
    var currentTime = new moment();
    if ($scope.value) {
        currentTime = new moment($scope.value.state);
    }
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

    var unbind = $scope.$watch('value', function() {
        currentTime = new moment($scope.value.state);
    });

    // cancel interval on scope destroy
    $scope.$on('$destroy', function(){
        unbind();
        $interval.cancel(promise);
    });
});
