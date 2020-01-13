
angular.module('hassdash.widget.calendar', ['hassdash', 'ui.calendar']);



angular.module('hassdash.widget.calendar').factory('calendarWidgetService', function() {
   var svc = {};

   svc.eventRender = function(event, element) {
      var icon = event.icon;
      if (icon) {
         element.find(".fc-content").prepend("<i class='mdi mdi-" + icon +"'></i>&nbsp;");
         element.find(".fc-list-item-time").prepend("<i class='mdi mdi-" + icon +"'></i>&nbsp;");   
      }   
      var view = event.view;
      if (view === 'listMonth' && event.description) {
         element.find(".fc-list-item-title").append("<span> - " + event.description + "</span>");
      }
   }

   return svc;
});

angular.module('hassdash.widget.calendar').controller('calendarController', function($scope, $interval, calendarWidgetService, calendarService) {
   
   $scope._outstanding = 0;
   $scope.calendarOptions = {
         height: $scope.config.size.y * 48,
         themeSystem: 'bootstrap4',
         defaultView: $scope.config.view,
         editable: false,
         header:{
         left: '',
         center: 'title',
         right: ''
      },
      eventRender: calendarWidgetService.eventRender
   };

   $scope.eventSources = [];
   function configureSources() {
      $scope.eventSources.splice(0, $scope.eventSources.length);
      $scope.eventsById = {};
      for (var k in $scope.config.styles) {
         var evt = {
            events: [],
            backgroundColor: $scope.config.styles[k].background
         };
         //TODO: Foreground color
         $scope.eventsById[k] = evt;
         $scope.eventSources.push(evt);
      }   
   }

   
   function loadCalendar(calendar_id) {
      var start, end;
      if ($scope.config.view === 'month') {
         start = new moment().startOf('month');
         end = new moment().endOf("month");
      } else {
         start = new moment();
         end = new moment().add(30, 'days');
      }
      calendarService.getEvents(calendar_id, start, end).then(function (events) {
            $scope.eventsById[calendar_id].events.splice(0, $scope.eventsById[calendar_id].events.length);
            for (var i=0; i < events.length; ++i) {
               $scope.eventsById[calendar_id].events.push({
                  title: events[i].summary,
                  description: $scope.config.x > 5 ? events[i].description : '',
                  start: events[i].start.date ? events[i].start.date : events[i].start.dateTime,
                  end: events[i].end.date ? events[i].end.date : events[i].end.dateTime,
                  icon: $scope.config.styles[calendar_id].icon,
                  backgroundColor: $scope.config.styles[calendar_id].background,
                  view: $scope.config.view
               });
               //TODO: Description
            }
            
            $scope._outstanding--;
         });
   }

   function loadCalendars() {
      if ($scope._outstanding === 0) {
         for (var i=0; i < $scope.config.entities.length; ++i) {
            $scope._outstanding++;
            loadCalendar($scope.config.entities[i]);
         }   
      }
   }
   
   configureSources();

   var watches = [];
   watches.push($scope.$watch('values', function() {
      loadCalendars();
   }, true));

   watches.push($scope.$watch('config', function() {
      configureSources();
      loadCalendars();
   }, true));

   // refresh every 15 minutes so that the calendar is up to date
   var promise = $interval(loadCalendars, 1000 * 60 * 15);
      
   // cancel interval on scope destroy
   $scope.$on('$destroy', function(){
      $interval.cancel(promise);
      for (var i=0; i < watches.length; ++i) {
         watches[i]();
      }
   });

});

angular.module('hassdash.widget.calendar').controller('calendarConfigController', function($scope, _, entityService) {
   $scope.availableViews = [
      {display: "Month", value: "month"},
      {display: "Agenda", "value": "listMonth"}
   ];
   if (!$scope.config.view) {
      $scope.config.view = 'month';
   }

   $scope.colorPickerOptions = {
      required: true,
      disabled: false,
      allowEmpty: false,
      // color
      format: 'rgb',
      // sliders
      hue: true,
      saturation: true,
      lightness: true,
      alpha: true,
      // swatch
      swatch: true,
      swatchPos: 'left',
      swatchBootstrap: true,
      swatchOnly: true,
      // popup
      round: false,
      pos: 'bottom left',
   };
   $scope.selectedEntities = {};
   $scope.$watch('config.entities', function() {
      var oldStyles = $scope.config.styles;
      $scope.config.styles = {}
      $scope.selectedEntities = {};
      for (var i=0; i < $scope.config.entities.length; ++i) {
         entityService.getEntity($scope.config.entities[i]).then(function (ent) {
            $scope.selectedEntities[ent.entity_id] = ent;
            if (oldStyles.hasOwnProperty(ent.entity_id)) {
               $scope.config.styles[ent.entity_id] = oldStyles[ent.entity_id];
            } else {
               $scope.config.styles[ent.entity_id] = {
                  background: '#2196F3',
                  icon: 'calendar-blank',
                  display: ent.friendly_name
               };
            }
         });
      }
   }, true);
});



angular.module('hassdash.widget.calendar').controller('calendarEditController', function($scope, calendarWidgetService) {
   var now = moment();

   function randomDate() {
      return moment().add(Math.random() * 720, 'hours');
   }
   $scope.eventSources = [];
   for (var k in $scope.config.styles) {
      var evts = {
         events: [],
         backgroundColor: $scope.config.styles[k].background
      };
      //generate 20 random events
      for (var i=0; i < 20; ++i) {
         evts.events.push({
            title: $scope.config.styles[k].display + ' ' + i,
            start: randomDate().toISOString(),
            sourceIndex: 0,
            icon: $scope.config.styles[k].icon
         });
      }
      $scope.eventSources.push(evts);
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
        eventRender: calendarWidgetService.eventRender
   };

   $scope.$watch('config.view', function() {
      $scope.calendarOptions.defaultView = $scope.config.view;
   });


});