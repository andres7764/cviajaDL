
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
        .when('/checkout', {
          templateUrl: '../templates/checkout.html',
          controller: 'checkoutCtrl'
        })
        .when('/response', {
          templateUrl: '../templates/response.html',
          controller: 'responseCtrl'
        })
        
        .otherwise({ redirectTo : "/catalogo" });
    }); 
    
    cviaja.controller('activityCtrl', ['$scope','$q','$http','$timeout','$routeParams','$rootScope', '$location','$window',function($scope,$q,$http,$timeout,$routeParams,$rootScope,$location,$window) {
        $window.scrollTo(0, 0);
        $rootScope.checkOut = [];
        $scope.reserv = {};
        $scope.reserv.qty0 = 1;
        $scope.reserv.complete = false;
        $scope.image = '';
        $rootScope.qtyCheckOut = 0;
        $scope.vm ={}; 
        $scope.vm.cupos = [0,0,0];
        $scope.vm.price = [0,0,0]
        
        
        if(JSON.parse(localStorage.getItem("checkOut")) !== null)
          $rootScope.checkOut = JSON.parse(localStorage.getItem("checkOut"));
        var directionsService,directionsDisplay;
        var activity = $routeParams.activity ? $routeParams.activity : "59431cf6a2bf7c1f18aeee39";
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivity?id='+activity).then(function(result){
            $rootScope.activity = result.data.activity[0];
            $scope.cantidadReal = $rootScope.activity.availablePersons;
            $scope.reserv.mount = $rootScope.activity.mount;
            console.log( $rootScope.activity );
            $scope.image = $rootScope.activity.image;
            initAutocomplete($scope.activity.location);
        });
        
        $scope.checkCupo = function(index){
            $rootScope.checkOut = [];
            var checkOption = $rootScope.activity.options[index];
            var dataCheck = {
                                name: checkOption.name,
                                numAvailabe: checkOption.numAvailabe - $scope.vm.cupos[index],
                                description: checkOption.description,
                                price: checkOption.price * $scope.vm.cupos[index],
                                qtyReserv: $scope.vm.cupos[index],
                                qtyReal: checkOption.numAvailabe, 
                                valueReal: checkOption.price,
                            };
            $scope.vm.price[index] = dataCheck.price;
            $rootScope.checkOut.push(dataCheck);
            
            console.log($rootScope.checkOut);
        };
        
        
        function checkRealQty(index) {
             var activity = $rootScope.activity.options[index];
             if(activity.numAvailabe > activity.qtyReal || activity.numAvailabe < 1) {
              swal('Opps','Uso indebido de las reservas ','warning');
              $rootScope.activity.options[index].numAvailabe = $rootScope.activity.options[index].qtyReal;
              $rootScope.activity.options[index].price = $rootScope.activity.options[index].valueReal;
              $rootScope.activity.options[index].qtyReserv = 0;
              return true;
             }
              return false;
            }

        $scope.more = function(op,index) {
           var selected = document.getElementById("selected"+index);
           if($scope.activity.options[index].qtyReserv === undefined) {
             $rootScope.activity.options[index].qtyReserv = 0;
             $rootScope.activity.options[index].qtyReal = $rootScope.activity.options[index].numAvailabe;
             $rootScope.activity.options[index].valueReal = $rootScope.activity.options[index].price;
           }
           checkRealQty(index);
          if(op === 1) {
           //Aumenta
           $rootScope.activity.options[index].numAvailabe = $rootScope.activity.options[index].numAvailabe-1;
           $rootScope.activity.options[index].qtyReserv = $rootScope.activity.options[index].qtyReserv+1;
          } else {
              //Disminuye
           $rootScope.activity.options[index].numAvailabe = $rootScope.activity.options[index].numAvailabe+1;
           $rootScope.activity.options[index].qtyReserv = $rootScope.activity.options[index].qtyReserv-1;
          }
          selected.innerHTML = $rootScope.activity.options[index].qtyReserv;
          $rootScope.activity.options[index].price = $rootScope.activity.options[index].valueReal*$scope.activity.options[index].qtyReserv;
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
        /*$scope.reservA = function(value) {
            var activity =  $rootScope.activity.options[value];
          if(!checkRealQty(value) && activity.qtyReserv) {
                $rootScope.checkOut.push(activity); 
                $rootScope.qtyCheckOut = $rootScope.checkOut.length;
                saveLocalStorage($rootScope.checkOut);
                confirmAddToCart();
          }
        };*/
        
        $scope.reservA = function(value) {
          if($rootScope.checkOut.length > 0 ){
               window.location = '/#!/checkout';
          }else{
               swal("error", "Debes elegir una fecha y el número de cupos a comprar", "error");
          }
        };
        
        function saveLocalStorage(checkOut){
            window.localStorage.setItem('checkout',JSON.stringify(checkOut));
            window.localStorage.setItem('activity',JSON.stringify($rootScope.activity));
        };

        function confirmAddToCart() {
            swal({
                text: "El plan se ha agregado correctamente al carrito !",
                imageUrl: "../img/dplan.png",
                showCancelButton: true,
                confirmButtonColor: '#64dd17',
                confirmButtonText: 'Pagar',
                cancelButtonText: "Ver más",
            }).then(function (isPagar) {
              console.log(isPagar);
                $scope.toCheckOut();
            },function(){ });
        };

        $scope.show = function(){
          $scope.reserv.complete = true;
        };
        
        $scope.toCheckOut = function(){
            if($rootScope.qtyCheckOut > 0){
                window.location = '/#!/checkout';
            }
        };

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
              $rootScope.activity.distance = myroute.legs[0].distance.text;
              $rootScope.activity.distanceValue = myroute.legs[0].distance.value / 1000;
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
            id: $rootScope.activity._id,
            qty: $rootScope.activity.availablePersons
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
      };
        
        $scope.range = function(min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };
        
        $scope.openRnt =  function(img){
            swal({
                  title: 'Registro Nacional De Turismo',
                  html: '<img src="'+img+'" style="width: 100%;height: 280px;">',
                  showCancelButton: false
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
    
  cviaja.controller('checkoutCtrl',function($scope,$rootScope,$q,$http,$timeout,$window,$location){
        $scope.user = {};
        $scope.total = 0;
        $rootScope.transaction = {};
        $scope.showBtnPay = false;
        $scope.key = "54a93a6995c167b0a1bbc32cb5ada5b1";  
        (function(){
            getCheckOut();  
        })();

        function getCheckOut() {
            if(!$rootScope.checkOut && !$rootScope.activity){
                var checkout = window.localStorage.getItem('checkout');
                var activity = window.localStorage.getItem('activity');
                $rootScope.checkOut = checkout ? JSON.parse(checkout) : [];
                $rootScope.activity = activity ? JSON.parse(activity) : {};
                calculateTotal();
            } else {
                calculateTotal();
            }
        };
        
        $scope.deletePlan = function(index){
            $rootScope.checkOut.splice(index,1);
            calculateTotal();
            updateLocalStorage();
        };
        
        function calculateTotal(){
            if($rootScope.checkOut && $rootScope.checkOut.length > 0 ){
                for(i in $rootScope.checkOut){
                    $scope.total += $rootScope.checkOut[i].price;
                }
            }else{
                $scope.total = 0;
                $rootScope.qtyCheckOut = $rootScope.checkOut ? $rootScope.checkOut.length : 0;
                console.log($rootScope.qtyCheckOut);
            } 
        };
        
        function updateLocalStorage(){
            if($rootScope.checkOut.length === 0){
                window.localStorage.setItem('checkout', null);
                window.localStorage.setItem('activity',null);
            }else{
                window.localStorage.setItem('checkout', JSON.stringify($rootScope.checkOut));
            }
        };

        $scope.pay = function(formValid){ 
            if(formValid){
                sendEpayco();
            }else{
                swal(
                  'Oops...',
                  'Debes ingresar tu nombre y un correo valido!',
                  'error'
                );
            }
        };
        
        function sendEpayco() {
             $rootScope.transaction = {
                 user: $scope.user,
                 activity: $rootScope.activity,
                 checkout: $rootScope.checkOut
             };
            $scope.showBtnPay = true;
        };
        
        $scope.goBack = function() {
            window.history.back();
        };
    });

    cviaja.controller('responseCtrl',function($scope,$rootScope,$q,$http,$timeout,$window,$location){
        console.log($location.search());
        $scope.resultTransaction = {};
        var ref_payco = $location.search().ref_payco;
        console.log(ref_payco);
        //Url Rest Metodo get, se pasa la llave y la ref_payco como paremetro
        var urlapp = "https://api.secure.payco.co/validation/v1/reference/" + ref_payco;
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get(urlapp).then(function(result){
            $scope.resultTransaction = result.data.data;
            console.log($rootScope.transaction);
            if($rootScope.transaction){
                createReserve($rootScope.transaction);
            }
        });
        
        $scope.goBack = function() {
            window.history.back();
        };
        
        function createReserve(transaction){
            $http.post('/saveReserva',{
                nombre: transaction.user.name,
                correo: transaction.user.mail,
                event:  transaction.activity._id,
                quantity: 2, // Pendiente revisar
                mount: $scope.resultTransaction.x_amount,
                status: $scope.resultTransaction.x_response,
                options: transaction.checkout
            })
            .then(function(result){
                console.log(result);
            });
        }
        
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
