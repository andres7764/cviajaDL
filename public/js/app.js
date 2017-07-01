    
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
    
    cviaja.controller('activityCtrl', ['$scope','$q','$http','$timeout','$routeParams','$rootScope', function($scope,$q,$http,$timeout,$routeParams,$rootScope) {
        $rootScope.checkOut = [];
        $scope.reserv = {};
        $scope.reserv.qty0 = 1;
        $scope.reserv.complete = false;
        $scope.image = '';
        if(JSON.parse(localStorage.getItem("checkOut")) !== null)
          $rootScope.checkOut = JSON.parse(localStorage.getItem("checkOut"));
        var directionsService,directionsDisplay;
        var activity = $routeParams.activity ? $routeParams.activity : "59431cf6a2bf7c1f18aeee39";
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivity?id='+activity).then(function(result){
            $scope.activity = result.data.activity[0];
            $scope.cantidadReal = $scope.activity.availablePersons;
            $scope.reserv.mount = $scope.activity.mount;
            $scope.image = $scope.activity.image;
            initAutocomplete($scope.activity.location);
        });
        function checkRealQty(index) {
         if($scope.activity.options[index].numAvailabe > $scope.activity.options[index].qtyReal || $scope.activity.options[index].numAvailabe < 1) {
          swal('Opps','Uso indebido de las reservas ','warning');
          $scope.activity.options[index].numAvailabe = $scope.activity.options[index].qtyReal;
          $scope.activity.options[index].price = $scope.activity.options[index].valueReal;
          $scope.activity.options[index].qtyReserv = 0;
          return true;
         }
          return false;
        }

        function updateValues() {

        }

        $scope.more = function(op,index) {
           var selected = document.getElementById("selected"+index);
           if($scope.activity.options[index].qtyReserv === undefined) {
             $scope.activity.options[index].qtyReserv = 0;
             $scope.activity.options[index].qtyReal = $scope.activity.options[index].numAvailabe;
             $scope.activity.options[index].valueReal = $scope.activity.options[index].price;
           }
           checkRealQty(index);
          if(op === 1) {
           //Aumenta
           $scope.activity.options[index].numAvailabe = $scope.activity.options[index].numAvailabe-1;
           $scope.activity.options[index].qtyReserv = $scope.activity.options[index].qtyReserv+1;
          } else {
              //Disminuye
           $scope.activity.options[index].numAvailabe = $scope.activity.options[index].numAvailabe+1;
           $scope.activity.options[index].qtyReserv = $scope.activity.options[index].qtyReserv-1;
          }
          selected.innerHTML = $scope.activity.options[index].qtyReserv;
          $scope.activity.options[index].price = $scope.activity.options[index].valueReal*$scope.activity.options[index].qtyReserv;
        }
/* $http.post('/saveReserva',{
                nombre: $scope.reserv.name,
                correo: $scope.reserv.mail,
                event:  activity,
                quantity: $scope.reserv.qty,
                mount: $scope.reserv.mount
})
            .then(function(result){
                swal("Información!", result.data.token+" estaremos en contacto contigo para confirmar fecha y hora", "success");
                $scope.reserv.complete = false;
                $scope.reserv.name = $scope.reserv.mail = "";
                $scope.reserv.qty = 0;
            })
            updateQty(); */
        $scope.reservA = function(value) {
            console.log($rootScope.checkOut);
          if(!checkRealQty(value)) {
            $rootScope.checkOut = $rootScope.checkOut.push($scope.activity.options[value]); 
            //updateValues();
            console.log($rootScope.checkOut.length);
          }

        }

        $scope.show = function(){
          $scope.reserv.complete = true;
        }

        $scope.paintRoute = function(lat,lng) {
          marker = [];
            var init = new google.maps.LatLng(lat, lng);
            var destin = new google.maps.LatLng(parseFloat($scope.activity.location.lat),parseFloat($scope.activity.location.lng));
            var request = {
               origin:      init,
               destination: destin,
               travelMode: google.maps.DirectionsTravelMode['DRIVING'],
               unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
               provideRouteAlternatives: false
            };
          directionsDisplay.addListener('directions_changed', function() {
              var myroute = directionsDisplay.getDirections().routes[0];
              $scope.activity.distance = myroute.legs[0].distance.text;
              $scope.activity.distanceValue = myroute.legs[0].distance.value / 1000;
            });
            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setMap($scope.map);
                  directionsDisplay.setPanel($("#panel_ruta").get(0));
                  directionsDisplay.setDirections(response);
              }
            });
        }

       function updateQty(){
        console.log($scope.activity._id);
        $http.post('/updateQtyActivity',{
            id: $scope.activity._id,
            qty: $scope.activity.availablePersons
        }).then(function(response){
            console.log(response);
        })
       }
       function initAutocomplete(location) {
        var latLng  = {lat: parseFloat(location.lat), lng: parseFloat(location.lng)};
            $scope.map = new google.maps.Map(document.getElementById('map'), {
              zoom: 16,
              center: latLng
            });
            var marker = new google.maps.Marker({
              position: latLng,
              map: $scope.map
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        $scope.map.addListener('bounds_changed', function() {
          searchBox.setBounds($scope.map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
          $scope.paintRoute(places[0].geometry.location.lat(),places[0].geometry.location.lng());
        });
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
