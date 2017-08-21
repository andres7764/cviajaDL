(function(){
	angular.module('services',[])

	.factory('activities', function($http,$q){
		
		function doGetRequest(URL){
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
		function doPostRequest(URL,params){
		  var defered = $q.defer();
		  var promise = defered.promise;
		   $http.defaults.headers.post["Content-Type"] = "application/json";
		   $http.post(URL,params)
		   .then(function(result){
        	  defered.resolve(result);
      	   })
      	   .catch(function(err){
      	   	 deferred.reject(err);
      	   })
      	   return promise;
		}
		return {
			doRequest: function(data,callback){
		      doGetRequest(data)
		      .then(function(res){
		      	callback(res);
		      });
			},
			doPostRequest: function(data,params,callback){
		      doPostRequest(data,params)
		      .then(function(res){
		      	callback(res);
		      });
			},
		}
	})
})();