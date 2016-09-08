app.service('commentService', function($q) {

	var getCommentsById = function(id) {
		var defer = $q.defer();
		var CommentsObject = Parse.Object.extend("Comment");
		var query = new Parse.Query(CommentsObject);

		if(id){
			query.equalTo("portfolioId", id);
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
		getCommentsById : getCommentsById
	};

});
