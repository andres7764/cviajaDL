    
    var cviaja = angular.module('cviaja',["ngRoute"]);
    
    cviaja.config(function($routeProvider) {
      $routeProvider.
        when('/', {
          templateUrl: '../templates/home.html',
          controller: 'activitiesCtrl'
        })
        .when('/catalogo/', {
          templateUrl: '../templates/catalog.html',
          controller: 'activitiesCtrl'
        })
        .when('/catalogo/:activity', {
          templateUrl: '../templates/activity.html',
          controller: 'activityCtrl'
        })
        .otherwise({ redirectTo : "/" });
    }); 
    
    cviaja.controller('activityCtrl', ['$scope','$q','$http','$timeout','$routeParams', function($scope,$q,$http,$timeout,$routeParams) {
        $scope.actividad = {};
        $scope.reserv = {};
        $scope.reserv.qty = 1;
        $scope.reserv.complete = false;
        $scope.image = '';
        var activity = $routeParams.activity ? $routeParams.activity : "59431cf6a2bf7c1f18aeee39";
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivity?id='+activity).then(function(result){
            $scope.activity = result.data.activity[0];
            $scope.reserv.mount = $scope.activity.mount;
            $scope.image = $scope.activity.image;
            createMap($scope.activity.location);
        });
        
        function createMap(location){
            var latLng  = {lat: parseFloat(location.lat), lng: parseFloat(location.lng)};
            var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 16,
              center: latLng
            });
            var marker = new google.maps.Marker({
              position: latLng,
              map: map
            });
        };
        
        $scope.more = function(op){
            $scope.reserv.qty = (op === 1)?$scope.reserv.qty+1:$scope.reserv.qty-1;
            $scope.reserv.mount = $scope.activity.mount*$scope.reserv.qty;
        }

        $scope.reservA = function(){
            console.log(activity);
            $http.post('/saveReserva',{
                nombre: $scope.reserv.name,
                correo: $scope.reserv.mail,
                event:  activity,
                quantity: $scope.reserv.qty,
                mount: $scope.reserv.mount
            })
            .then(function(result){
                swal("Información!", result.data.token+" estaremos en contacto contigo para confirmar fecha y hora", "success");
                $scope.reserv.complete = false;
            })
        }

        $scope.show = function(){
          $scope.reserv.complete = true;
        }
    }]);

	cviaja.controller('activitiesCtrl',function($scope,$q,$http,$timeout,$window,$location){
        
        $scope.activities = {};
        
        $scope.irA = function(id){
            console.log(id);
            $location.url('/catalogo/'+id);
        }
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivities').then(function(result){
            $scope.activities = result.data.activities; 
        });
            
        var modal = document.getElementById('modalReservar');
        // Get the button that opens the modal
        var btn = document.getElementById("btnOpenModal");
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks on the button, open the modal 
        /*btn.onclick = function() {
            modal.style.display = "block";
        } 

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }*/
        
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
