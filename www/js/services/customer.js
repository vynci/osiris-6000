app.service('customerService', function($q) {

	var getArtists = function() {
		var defer = $q.defer();
		var ArtistObject = Parse.Object.extend("Artist");
		var query = new Parse.Query(ArtistObject);

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

	var getCustomerById = function(id) {
		var defer = $q.defer();
		var CustomerObject = Parse.Object.extend("Customer");
		var query = new Parse.Query(CustomerObject);

		if(id){
			query.equalTo("objectId", id);
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
		getArtists: getArtists,
		getCustomerById : getCustomerById
	};

});
