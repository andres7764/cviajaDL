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
            $scope.image = $rootScope.activity.image;
            initAutocomplete($scope.activity.location);
        });
        
        $scope.checkCupo = function(index){
            $rootScope.checkOut = [];
            localStorage.setItem("checkOut",null);
            var checkOption = $rootScope.activity.options[index];
            var dataCheck = {
              name: checkOption.name,
              numAvailabe: checkOption.numAvailabe - $scope.vm.cupos[index],
              description: checkOption.description,
              price: checkOption.price * $scope.vm.cupos[index],
              qtyReserv: $scope.vm.cupos[index],
              qtyReal: checkOption.numAvailabe, 
              valueReal: checkOption.price,
              _id: activity
              };
            $scope.vm.price[index] = dataCheck.price;
            $rootScope.checkOut.push(dataCheck);
            localStorage.setItem("checkOut",JSON.stringify(dataCheck));
        };
        
        
/*        function checkRealQty(index) {
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
*/        
        $scope.reservA = function(value) {
          if($rootScope.checkOut.length > 0 ){
               window.location = '/#!/checkout';
          }else{
               swal("error", "Debes elegir una fecha y el número de cupos a comprar", "error");
          }
        };
        
/*        function saveLocalStorage(checkOut){
            window.localStorage.setItem('checkout',JSON.stringify(checkOut));
            window.localStorage.setItem('activity',JSON.stringify($rootScope.activity));
        };*/

/*        function confirmAddToCart() {
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
        };*/

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
        $scope.map.addListener('bounds_changed', function() {
          searchBox.setBounds($scope.map.getBounds());
        });
        var markers = [];
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
        
        /*function sendEpayco() {
          $rootScope.transaction = {
            activity: $rootScope.activity,
            checkout: $rootScope.checkOut
          };
        };*/
        
        $scope.goBack = function() {
            window.history.back();
        };
    });

    cviaja.controller('responseCtrl',function($scope,$rootScope,$q,$http,$timeout,$window,$location){
        $scope.resultTransaction = {};
        let info = JSON.parse(localStorage.getItem("checkOut"));
        console.log(info);
        var ref_payco = $location.search().ref_payco;
        //Url Rest Metodo get, se pasa la llave y la ref_payco como paremetro
        var urlapp = "https://api.secure.payco.co/validation/v1/reference/" + ref_payco;
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get(urlapp).then(function(result) {
            $scope.resultTransaction = result.data.data;
            if($scope.resultTransaction.x_cod_response === 1){
            console.log($scope.resultTransaction);
                //createReserve($scope.resultTransaction);
                //updateQty();
                swal("¡Compra exitosa!","Tu transacción ha sido satisfactoria, a tu correo hemos enviado la información completa sobre tu actividad, Disfrútala!!", "success");
            } else if ($scope.resultTransaction.x_cod_response === 2) {
                swal("¡Compra rechazada!","Tu transacción ha sido rechazada, valida esta información con tu banco y vuelve a intentarlo, no te quedes con las ganas de hacer este plan.", "error");
            } else if ($scope.resultTransaction.x_cod_response === 3) {
                swal("¡Compra Pendiente!","Tu transacción está en estado Pendiente, te informaremos a vuelta de correo una vez cambie el estado de tu compra.", "warning");
            } else {
                swal("¡Compra fallida!","Ha ocurrido un error con tu compra, verifica con tu entidad financiera para mas información", "error");
            }
        });
        
        $scope.goBack = function() {
          localStorage.setItem("checkOut",null);
            window.history.back();
        };
        
        function createReserve(transaction){
            console.log($rootScope.checkout);
            $http.post('/saveReserva',{
                nombre: transaction.x_business,
                correo: transaction.x_customer_email,
                event:  transaction.x_id_invoice,
                quantity: info.qtyReserv,
                mount: transaction.x_amount,
                status: transaction.x_response,
                options: transaction.checkout
            })
            .then(function(result){
                console.log(result);
            });
        }
        function updateQty(){
          console.log(info);
          $http.post('/updateQtyActivity',{
              id: info._id,
              qty: info.numAvailabe
          }).then(function(response){
              console.log(response);
          })
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