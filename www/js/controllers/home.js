
app.controller('HomeCtrl', function($scope, $ionicHistory, customerService, $ionicLoading, $state, $rootScope) {

	$scope.$on('$ionicView.beforeEnter', function(){
		if(!Parse.User.current()){
			$scope.isLogged = false;
		}else{
			console.log('before enter!');
			$scope.isLogged = true;
			getCustomerProfile();
		}
	});

	function getCustomerProfile(){
		if($rootScope.currentUser){
			customerService.getCustomerById($rootScope.currentUser.get('profileId'))
			.then(function(results) {
				// Handle the result
				console.log(results);
				$scope.currentCustomer = results[0].get('firstName');
				$ionicLoading.hide();
			}, function(err) {
				// Error occurred
				console.log(err);
			}, function(percentComplete) {
				console.log(percentComplete);
			});
		}
		else{
			$ionicLoading.hide();
		}
	}

	$scope.redirect = function(state){
		if(state === 'app.artist'){
			$ionicHistory.nextViewOptions({
				disableAnimate: true
			});
			$state.go(state, {artistId: 'bflcr0Hv99'});
		}else {
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
			});
			$state.go(state, {location: 'replace'});
		}
	}

});
