    
    var admin = angular.module('admin',["ngRoute"]);
    
    admin.config(function($routeProvider) {
      $routeProvider.
        when('/usuarios', {
          templateUrl: '../templatesAdmin/home.html',
          controller: 'usuariosCtrl'
        })
        .when('/reservas', {
          templateUrl: '../templatesAdmin/reservas.html',
          controller: 'reservasCtrl'
        })
        .when('/actividades', {
          templateUrl: '../templatesAdmin/reservas.html',
          controller: 'actividadesCtrl'
        })
        .otherwise({ redirectTo : "/usuarios" });
    }); 
    
    admin.controller('usuariosCtrl', ['$scope','$q','$http','$timeout','$routeParams', function($scope,$q,$http,$timeout,$routeParams) {
        (function(){
            $("#contentLoader").fadeIn(100);
            $http.get('/getUsuarios').then(function(result){
                $("#contentLoader").fadeOut(100);
                $scope.users = result.data.users; 
                $scope.err = $scope.users.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
            }); 
        })();
    }]);

    admin.controller('reservasCtrl', ['$scope','$q','$http','$timeout','$routeParams', function($scope,$q,$http,$timeout,$routeParams) {
        (function(){
            $("#contentLoader").fadeIn(100);
            $http.get('/getReservas').then(function(result){
                $("#contentLoader").fadeOut(100);
                $scope.reservas = result.data.reservas; 
                $scope.err = $scope.reservas.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
            }); 
        })();
        
    }]);

    admin.controller('actividadesCtrl', ['$scope','$q','$http','$timeout','$routeParams', function($scope,$q,$http,$timeout,$routeParams) {
        (function(){
            $("#contentLoader").fadeIn(100);
            $http.get('/getReservas').then(function(result){
                $("#contentLoader").fadeOut(100);
                $scope.reservas = result.data.reservas; 
                $scope.err = $scope.reservas.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
            }); 
        })();
        
    }]);
    