app.service('reviewService', function($q) {

	var getReviews = function() {
		var defer = $q.defer();
		var ReviewObject = Parse.Object.extend("Review");
		var query = new Parse.Query(ReviewObject);

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

	var getReviewsById = function(id) {
		var defer = $q.defer();
		var ReviewObject = Parse.Object.extend("Review");
		var query = new Parse.Query(ReviewObject);

		if(id){
			query.equalTo("artistInfo.id", id);
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
		getReviews: getReviews,
		getReviewsById : getReviewsById
	};

});
