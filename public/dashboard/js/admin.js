
var admin = angular.module('admin',['ngRoute']);

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
        templateUrl: '../templatesAdmin/actividades.html',
        controller: 'actividadesCtrl'
      })
      .otherwise({redirectTo : '/usuarios'});
});
    
admin.controller('usuariosCtrl', ['$scope','$rootScope','$q','$http','$timeout','$routeParams',       function($scope,$rootScope,$q,$http,$timeout,$routeParams) {
        
        (function() {
            $('#contentLoader').fadeIn(100);
            $http.get('/getUsuarios').then(function(result) {
                $('#contentLoader').fadeOut(100);
                $scope.users = result.data.users;
                $scope.err = $scope.users.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
            });
        })();

        $rootScope.closeSession = function() {
            if (typeof(Storage) !== 'undefined') {
                localStorage.removeItem('firstname');
                window.location.href = '/login';
            }
        };
    }]);

admin.controller('reservasCtrl', ['$scope','$q','$http','$timeout','$routeParams', 
function($scope,$q,$http,$timeout,$routeParams) {
    
    (function() {
        $('#contentLoader').fadeIn(100);
        $http.get('/getReservas').then(function(result) {
            $('#contentLoader').fadeOut(100);
            $scope.reservas = result.data.reservas; 
            $scope.err = $scope.reservas.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
        }); 
    })();
    
}]);

admin.controller('actividadesCtrl', ['$scope','$q','$http','$timeout','$routeParams', 
function($scope,$q,$http,$timeout,$routeParams) {
    $scope.newActivity = {};
    
    (function() {
        getActivities();
    })();
    
    function getActivities(){
        $('#contentLoader').fadeIn(100);
        $http.get('/getActivities').then(function(result) {
            $('#contentLoader').fadeOut(100);
            $scope.activities = result.data.activities; 
            $scope.err = $scope.activities.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
        }); 
    }
    
    $scope.verActivity = function(id){
        $('#contentLoader').fadeIn(100);
        $http.get('/getActivity?id='+id).then(function(result) {
            $('#contentLoader').fadeOut(100);
            $scope.activity = result.data.activity[0];
            console.log($scope.activity);
            $scope.err = $scope.activities.length > 0 ? '' : 'No se encontraron, datos en la base de datos'
            $('#myModal').modal('show');
        }); 
    };
    
    $scope.crearActivity = function(){
       $('#createActivity').modal('show');          
    };
    
    $scope.createActivity =  function(){
        $('#btnCreateActivity').button('loading');
        var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
        };
        $http.post('/createActivity', $scope.newActivity, config).then(function success(result){
            $('#btnCreateActivity').button('reset');
            sweetAlert("Bien!", "Actividad creada con exito!", "success");
            $scope.newActivity = {};
            getActivities();
        }, function err(err){
            $('#btnCreateActivity').button('reset');
            sweetAlert("Oops..!", "Ocurrio un error "+err.info+" creado la actividad, intente de nuevo", "error");
            console.log(err);
        })
    };
    
}]);
