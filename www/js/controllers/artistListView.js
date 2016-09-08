
app.controller('ArtistListViewCtrl', function($scope, $ionicModal, $timeout, serviceService, $ionicLoading, $rootScope, $ionicPopup, artistService, $state, $cordovaGeolocation) {
  $scope.spiral = 'img/placeholder.png';
  $scope.position = {
    search : ''
  };
  $scope.filter = {
    hair : true,
    makeup : true,
    sort : ''
  }

  $scope.pageCount = 10;
  $scope.isListEmpty = false;

  var map;
  var point;
  getCurrentLocation();

  $ionicModal.fromTemplateUrl('templates/filterModal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.filterModal = modal;
  });

  function getArtists(currentUserPosition, skip, nextPage){
    var loadingMsg = 'Finding Artists Near You :)';
    if(nextPage){
      loadingMsg = 'Loading More Artists...'
    }
    $ionicLoading.show({
      template: loadingMsg
    }).then(function(){

    });

    artistService.getArtists(currentUserPosition, skip)
    .then(function(results) {
      // Handle the result
      if(!nextPage){
        $scope.fromCloudActiveArtists = results;
        $rootScope.nearbyArtists = results;
      } else {
        var tmp = $scope.fromCloudActiveArtists;
        $scope.fromCloudActiveArtists = tmp.concat(results);
        $rootScope.nearbyArtists = $scope.fromCloudActiveArtists;
      }
      $scope.isListEmpty = false;
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  function parsePriceRange(artists){
    angular.forEach(artists, function(artist){
      var services= artist.get('services');

      var priceRange = [];
      angular.forEach(services, function(service){
        var price = service.price;
        priceRange.push(price);
      });
      // console.log(priceRange);
      artist.set('priceRange', priceRange);
    });
  }

  function getCurrentLocation() {
    // point = new Parse.GeoPoint({latitude: 10.349792530358712, longitude: 123.90758514404297});
    // getArtists(point);

    map = plugin.google.maps.Map.getMap(document.getElementById("map_canvas1"));

    map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
      map.getMyLocation({enableHighAccuracy: true }, function(location) {
        point = new Parse.GeoPoint({latitude: location.latLng.lat, longitude: location.latLng.lng});
        $rootScope.currentUserPosition = point;
        getArtists(point);

      }, function(err){
        var options = {timeout: 10000, enableHighAccuracy: false };
        $ionicLoading.show({
          template: 'Finding Artists Near You :)'
        }).then(function(){
        });

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
          var point = new Parse.GeoPoint({latitude: position.coords.latitude, longitude: position.coords.longitude});
          $rootScope.currentUserPosition = point;
          getArtists(point);

        }, function(error){
          $ionicLoading.hide();
          $scope.isListEmpty = true;
          var alertPopup = $ionicPopup.alert({
            title: 'Find Location',
            template: "Sorry we couldn't get your current location. <br><br> Please input your location in the search box above. <br><br> Sorry for the inconvenience."
          });

          alertPopup.then(function(res) {

          });
        });
      });
    });
  }

  $scope.loadMoreArtists = function(){
    getArtists(point, $scope.pageCount, true);
    $scope.pageCount += 10;
  }

  $scope.changeToMapView = function(){
    $state.go('app.service');
  }

  // Triggered in the login modal to close it
  $scope.hideFilters = function() {
    $scope.filterModal.hide();
  };

  $scope.showFilters = function(){
    $scope.filterModal.show();
  }

  $scope.filterArtist = function(artist){
    // console.log(artist);
    var response;

    if($scope.filter.hair && !$scope.filter.makeup){
      response = artist.get('serviceType') === 'Hair Stylist';
    }
    else if(!$scope.filter.hair && $scope.filter.makeup){
      response = artist.get('serviceType') === 'Makeup Artist';
    }
    else if(!$scope.filter.hair && !$scope.filter.makeup){
      response = false;
    }
    else{
      response = artist.get('serviceType') === 'Hair Stylist' || artist.get('serviceType') === 'Makeup Artist';
    }

    return response;
  };

  $scope.$watch('position.search', function(value, old) {
    if(value.geometry){
      var point = new Parse.GeoPoint({latitude: value.geometry.location.lat(), longitude: value.geometry.location.lng()});
      $rootScope.currentUserPosition = point;
      getArtists(point);
    }
  });

  $scope.$on('$ionicView.leave', function(e) {
    map.remove();
  });

});
