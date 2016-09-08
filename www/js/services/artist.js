app.service('artistService', function($q) {

	var getArtists = function(userLocation, skip) {
		var defer = $q.defer();
		var ArtistObject = Parse.Object.extend("Artist");
		var query = new Parse.Query(ArtistObject);

		if(userLocation){
			query.near("coordinates", userLocation);
		}

		if(skip){
			query.skip(skip);
		}

		query.limit(10);

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

	var getArtistById = function(id) {
		var defer = $q.defer();
		var ArtistObject = Parse.Object.extend("Artist");
		var query = new Parse.Query(ArtistObject);

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
		getArtistById : getArtistById
	};

});
