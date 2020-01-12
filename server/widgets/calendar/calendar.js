
angular.module('hassdash.widget.calendar', ['hassdash', 'ui.calendar']);


angular.module('hassdash.widget.calendar').controller('calendarController', function($scope) {
});

angular.module('hassdash.widget.calendar').controller('calendarEditController', function($scope) {
   var now = moment();

   function randomDate() {
      return moment().add(Math.random() * 720, 'hours');
   }

   var aEvents = {
      events: [

      ],
      backgroundColor: $scope.config.styles ? $scope.config.styles[0].background : '#2196F3'
   };
   //generate 100 random events
   for (var i=0; i < 100; ++i) {
      aEvents.events.push({
         title: 'event' + i,
         start: randomDate().toISOString(),
         sourceIndex: 0
      })   
   }

   var bEvents = {
      events: [

      ],
      backgroundColor: $scope.config.styles ? $scope.config.styles[1].background : '#2196F3'
   };
   //generate 100 random events
   for (var i=0; i < 100; ++i) {
      bEvents.events.push({
         title: 'event' + i,
         start: randomDate().toISOString(),
         sourceIndex: 1
      })   
   }

   function eventRender(event, element) {
      if ($scope.config.styles) {
         var icon = $scope.config.styles[event.sourceIndex].icon;
         if (icon) {
            element.find(".fc-time").prepend("<i class='mdi mdi-" + icon +"'></i>&nbsp;");
            element.find(".fc-list-item-time").prepend("<i class='mdi mdi-" + icon +"'></i>&nbsp;");   
         }   
      }
   }
      
   $scope.calendarOptions ={
        height: $scope.config.size.y * 48,
        themeSystem: 'bootstrap4',
        defaultView: $scope.config.view,
        editable: false,
        header:{
          left: '',
          center: 'title',
          right: ''
        },
        eventRender: eventRender
      };
      $scope.eventSources = [aEvents, bEvents];
});