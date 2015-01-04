(function(angular) {

  angular.module('pickadate')
    .directive('pickadate', [
      '$locale',
      'pickadateUtils',
      'pickadateUtils.indexOf',
      'dateFilter',

      function pickadateDirective($locale, dateUtils, indexOf, dateFilter) {
        return {
          require: 'ngModel',
          scope: {
            date: '=ngModel',
            minDate: '=',
            maxDate: '=',
            disabledDates: '='
          },
          templateUrl: 'pickadate/templates/pickadate.html',

          link: function(scope, element, attrs, ngModel)  {
            var minDate       = scope.minDate && dateUtils.stringToDate(scope.minDate),
              maxDate       = scope.maxDate && dateUtils.stringToDate(scope.maxDate),
              disabledDates = scope.disabledDates || [],
              currentDate   = new Date();

            scope.dayNames    = $locale.DATETIME_FORMATS['SHORTDAY'];
            scope.currentDate = currentDate;

            scope.render = function(initialDate) {
              initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);

              var currentMonth    = initialDate.getMonth() + 1,
                dayCount          = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0, 3).getDate(),
                prevDates         = dateUtils.dateRange(-initialDate.getDay(), 0, initialDate),
                currentMonthDates = dateUtils.dateRange(0, dayCount, initialDate),
                lastDate          = dateUtils.stringToDate(currentMonthDates[currentMonthDates.length - 1]),
                nextMonthDates    = dateUtils.dateRange(1, 7 - lastDate.getDay(), lastDate),
                allDates          = prevDates.concat(currentMonthDates, nextMonthDates),
                dates             = [],
                today             = dateFilter(new Date(), 'yyyy-MM-dd');

              // Add an extra row if needed to make the calendar to have 6 rows
              if (allDates.length / 7 < 6) {
                allDates = allDates.concat(dateUtils.dateRange(1, 8, allDates[allDates.length - 1]));
              }

              var nextMonthInitialDate = new Date(initialDate);
              nextMonthInitialDate.setMonth(currentMonth);

              scope.allowPrevMonth = !minDate || initialDate > minDate;
              scope.allowNextMonth = !maxDate || nextMonthInitialDate < maxDate;

              for (var i = 0; i < allDates.length; i++) {
                var className = "", date = allDates[i];

                if (date < scope.minDate || date > scope.maxDate || dateFilter(date, 'M') !== currentMonth.toString()) {
                  className = 'pickadate-disabled';
                } else if (indexOf.call(disabledDates, date) >= 0) {
                  className = 'pickadate-disabled pickadate-unavailable';
                } else {
                  className = 'pickadate-enabled';
                }

                if (date === today) {
                  className += ' pickadate-today';
                }

                dates.push({date: date, className: className});
              }

              scope.dates = dates;
            };

            scope.setDate = function(dateObj) {
              if (isDateDisabled(dateObj)) return;
              ngModel.$setViewValue(dateObj.date);
            };

            ngModel.$render = function () {
              if ((date = ngModel.$modelValue) && (indexOf.call(disabledDates, date) === -1)) {
                scope.currentDate = currentDate = dateUtils.stringToDate(date);
              } else if (date) {
                // if the initial date set by the user is in the disabled dates list, unset it
                scope.setDate({});
              }
              scope.render(currentDate);
            };

            scope.changeMonth = function (offset) {
              // If the current date is January 31th, setting the month to date.getMonth() + 1
              // sets the date to March the 3rd, since the date object adds 30 days to the current
              // date. Settings the date to the 2nd day of the month is a workaround to prevent this
              // behaviour
              currentDate.setDate(1);
              currentDate.setMonth(currentDate.getMonth() + offset);
              scope.render(currentDate);
            };

            function isDateDisabled(dateObj) {
              return (/pickadate-disabled/.test(dateObj.className));
            }
          }
        };
      }
    ]);

})(angular);
