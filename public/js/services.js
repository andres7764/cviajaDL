(function(){
	angular.module('services',[])

	.factory('activities', function($http,$q){
		
		function getActivitiesInfo(URL,params){
		  URL = (params !== 'empty')? URL+"?id="+params: URL;
		  var defered = $q.defer();
		  var promise = defered.promise;
		   $http.defaults.headers.post["Content-Type"] = "application/json";
		   $http.get(URL)
		   .then(function(result){
        	  defered.resolve(result);
      	   })
      	   .catch(function(err){
      	   	 deferred.reject(err);
      	   })
      	   return promise;
		}
		return {
			doRequest: function(data,params,callback){
		      getActivitiesInfo(data,params)
		      .then(function(res){
		      	callback(res);
		      });
			}
		}
	})
})();