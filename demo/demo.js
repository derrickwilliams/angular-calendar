(function(angular) {

  angular.module('pickadate.demo', ['pickadate'])

    .controller('DemoController', ['$scope', function($scope) {
      var $s = $scope;

      $s.currentDate = new Date();
    }]);

})(angular);
