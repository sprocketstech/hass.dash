
angular.module('hassdash.widget.date', ['hassdash']);


angular.module('hassdash.widget.date').controller('dateController', function($scope, $interval) {
    var currentTime = new moment();
    
    if (!$scope.config.date_format) {
        $scope.config.date_format = 'dddd, MMMM Do YYYY';
    }
    function setDate(){
        currentTime = currentTime.add(1, 'second');
        $scope.date = currentTime.format($scope.config.date_format);
    }

    setDate();
    // refresh every second
    var promise = $interval(setDate, 1000);

    // cancel interval on scope destroy
    $scope.$on('$destroy', function(){
        $interval.cancel(promise);
    });
});
