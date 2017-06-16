(function(){

	angular.module('cviaja',[])
	.controller('activitiesCtrl',function($scope,$q,$http,$timeout){
	$timeout(function(){
	  $http({
			method: 'post',
			url:'/getActivities',
		}).then(function(response){
		   $scope.activities = {};
		   console.log(response.data);
		   $scope.activities = response.data.data;
		})
	  })
	},1000)
}());
