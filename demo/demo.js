(function(angular) {

  angular.module('pickadate.demo', ['pickadate'])

    .config(['pickadateOptionsProvider', function(pickadateOptionsProvider) {

    }])

    .controller('DemoController', ['$scope', function($scope) {
      var $s = $scope;

      $s.currentDate = new Date();
    }]);

})(angular);
