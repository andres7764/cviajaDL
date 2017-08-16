var cviaja = angular.module('cviaja',["ngRoute","routes"]);
   
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
        $scope.vm.price = [0,0,0];
        $scope.weekends = getWeekends();
        
        if(JSON.parse(localStorage.getItem("checkOut")) !== null)
          $rootScope.checkOut = JSON.parse(localStorage.getItem("checkOut"));
        var directionsService,directionsDisplay;
        var activity = ($routeParams.activity.split("_").length === 2 )? $routeParams.activity.split("_") : window.location = "/";
        var idS = (activity[1].length === 24)?activity[1]:window.location = "/";
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get('/getActivity?id='+idS).then(function(result){
            
            $rootScope.activity = result.data.activity[0];
            document.title = $rootScope.activity.name;
            $scope.cantidadReal = $rootScope.activity.availablePersons;
            $scope.reserv.mount = $rootScope.activity.mount;
            $scope.image = $rootScope.activity.image;
            initAutocomplete($scope.activity.location);
        });
        
        $scope.checkCupo = function(index){
            $rootScope.checkOut = [];
            localStorage.setItem("checkOut",null);
            var dateReserv = document.getElementById('sel1').value;
            var checkOption = $rootScope.activity.options[index];
            //$rootScope.activity.options[index].numAvailabe = checkOption.numAvailabe - $scope.vm.cupos[index];
            var dataCheck = {
              name: checkOption.name,
              numAvailabe: checkOption.numAvailabe - $scope.vm.cupos[index],
              description: checkOption.description,
              price: checkOption.price * $scope.vm.cupos[index],
              qtyReserv: $scope.vm.cupos[index],
              qtyReal: checkOption.numAvailabe, 
              valueReal: checkOption.price,
              dateReserv: dateReserv,
              _id: activity,
              index: index,
              obj: $rootScope.activity.options 
              };

            $scope.vm.price[index] = dataCheck.price;
            $rootScope.checkOut.push(dataCheck);
            localStorage.setItem("checkOut",JSON.stringify(dataCheck));
        };
        
        $scope.reservA = function(value) {
          if($rootScope.checkOut.length > 0 ){
               window.location = '/#!/checkout';
          }else{
               swal("error", "Debes elegir una fecha y el número de cupos a comprar", "error");
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
        };
        $scope.contact = {name: "", mail:"" };
        $scope.suscribir =  function(){
          if($scope.contact.name !== "" && $scope.contact.mail !== ""){
            suscribe();
          }else{
            swal("error", "Debes ingresar tu nombre y correo", "error");
          }
        };

        function suscribe(){
          $http.post('/saveContact',{
                nombre:          $scope.contact.name,
                correo:          $scope.contact.mail,
                opciones:        {event: activity},
                suscribirseMail:   true,
                susCribirsePagos:  false,
            })
            .then(function(result){
              console.log(result);
              if(result.status !== 200 ){
                swal("error", "Ocurrio un error al guardar tu información intenta de nuevo o escribenos a devjs.info@gmail.com", "error");
              }else{
                swal("Bien", result.data.token, "success");
              }
            });
        }
        
        function daysInMonth(month,year) {
            return new Date(year, month, 0).getDate();
        };

        function getWeekends()
        {
            var date = new Date();
            var weekends=[],
                weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                month=date.getMonth()+1,
                year=date.getFullYear();
            for(var i=date.getDate(),l=daysInMonth(month,year);i<l;i++){
                var d = new Date(year,month-1,i);
                if((weekday[d.getDay()] === 'Saturday' || weekday[d.getDay()] === 'Sunday')){
                    weekends.push(i+' de '+getMonth(month)+' '+year);
                }    
            }
            return weekends;
        };
        
       function getMonth(month){
           var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
           return months[month-1];
       }
        
    }]);

  cviaja.controller('activitiesCtrl',function($scope,$q,$http,$timeout,$window,$location,$rootScope){
        
        $scope.views = 450;
        
        (function(){
            $http.get('/updateCount').then(function(result){
                $scope.views = result.data.count;
            });
        })();
      
        $scope.activities = [];
        $scope.contactUs = function() {
          swal({
            title: "<h3>Contactanos!</h3>",
            imageUrl: "../img/contacto.jpg"
          });
        }
        
        $scope.irA = function(id,title){
          $rootScope.idSearch = id;
          var letra = title.replace(/[^a-zA-Z 0-9.]+/g,'');
              letra = letra.replace(/ /g,'-');
          $location.url('/catalogo/'+letra+"_"+id);
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
  });
    
  cviaja.controller('checkoutCtrl',function($scope,$rootScope,$q,$http,$timeout,$window,$location){
        $scope.total = 0;
        $rootScope.transaction = {};
        $scope.showBtnPay = false;
        $scope.key = "154facda17519d661d60dc5384a5681d";
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
        
        $scope.goBack = function() {
            window.history.back();
        };
    });

    cviaja.controller('responseCtrl',function($scope,$rootScope,$q,$http,$timeout,$window,$location){
        $scope.resultTransaction = {};
        let info = JSON.parse(localStorage.getItem("checkOut"));
        var ref_payco = $location.search().ref_payco;
        //Url Rest Metodo get, se pasa la llave y la ref_payco como paremetro
        var urlapp = "https://api.secure.payco.co/validation/v1/reference/" + ref_payco;
        $http.defaults.headers.post["Content-Type"] = "application/json";
        $http.get(urlapp).then(function(result) {
            $scope.resultTransaction = result.data.data;
            if($scope.resultTransaction.x_cod_response === 1){
                createReserve($scope.resultTransaction);
                updateQty();
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
            $http.post('/saveReserva',{
                nombre: transaction.x_business,
                correo: transaction.x_customer_email,
                event:  info._id,
                quantity: info.qtyReserv,
                mount: transaction.x_amount,
                status: transaction.x_response,
                wasPayment: true,
                options: info,
                codeTransaction: transaction.x_id_invoice,
                dateReserv: info.dateReserv
            })
            .then(function(result){
            });
        }
        function updateQty(){
          $http.post('/updateQtyActivity',{
              id: info._id,
              obj: info.obj
          }).then(function(response){})
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
