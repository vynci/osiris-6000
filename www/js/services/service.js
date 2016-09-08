app.service('serviceService', function($q) {

	var getServices = function() {
		var defer = $q.defer();
		var ServiceObject = Parse.Object.extend("Service");
		var query = new Parse.Query(ServiceObject);

		query.find({
			success: function(results) {
				defer.resolve(results);
			},
			error: function(error) {
				defer.reject(error);
			}
		});
		return defer.promise;
	};

	var getServiceById = function(id) {
		var defer = $q.defer();
		var ServiceObject = Parse.Object.extend("Service");
		var query = new Parse.Query(ServiceObject);

		if(id){
			query.equalTo("ownerId", id);
		}

		query.find({
			success: function(results) {
				defer.resolve(results);
			},
			error: function(error) {
				defer.reject(error);
			}
		});
		return defer.promise;
	};

	return {
		getServices: getServices,
		getServiceById : getServiceById
	};
});
