    
    var cviaja = angular.module('cviaja',["ngRoute"]);
    
    cviaja.config(function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: 'templates/home.html',
          controller: 'activityCtrl'
        })
        .when('/catalogo/:activity', {
          templateUrl: 'templates/activity.html',
          controller: 'activityCtrl'
        })
        .otherwise({ redirectTo : "/" });
    }); 
    
    cviaja.controller('activityCtrl', ['$scope','$q','$http','$timeout','$routeParams', function($scope,$q,$http,$timeout,$routeParams) {
        $scope.actividad = {};
        $scope.image = '';
        console.log($routeParams.activity);
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivity?id='+$routeParams.activity).then(function(result){
            $scope.activity = result.data.activity[0];
            $scope.image = $scope.activity.image;
            createMap($scope.activity.location);
            console.log(  $scope.activity  );
        });
        
        function createMap(location){
            var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 12,
              center: location
            });
            var marker = new google.maps.Marker({
              position: location,
              map: map
            });
        };
        
    }]);

	cviaja.controller('activitiesCtrl',function($scope,$q,$http,$timeout,$window,$location){
        
        $scope.activities = {};
        
        $scope.irA = function(){
            $location.url('/catalogo/594315bb5c00d02b14f4fd96');
        }
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivities').then(function(result){
            $scope.activities = result.data.activities; 
        });
	/*$timeout(function(){
	  $http({
			method: 'post',
			url:'/getActivities',
		}).then(function(response){
		   $scope.activities = {};
		   console.log(response.data);
		   $scope.activities = response.data.data;
		})
	  },1000);*/
	});
    
    cviaja.directive('dynamicElement', ['$compile', function ($compile) {
      return { 
        restrict: 'E', 
        scope: {
            message: "="
        },
        replace: true,
        link: function(scope, element, attrs) {
            var template = $compile(scope.message)(scope);
            element.replaceWith(template);               
        },
        controller: ['$scope', function($scope) {
           $scope.clickMe = function(){
                alert("hi")
           };
        }]
      }
  }]);
