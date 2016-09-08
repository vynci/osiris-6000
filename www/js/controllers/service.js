
app.controller('ServiceCtrl', function($scope, $ionicHistory, $ionicModal, $timeout, serviceService, $ionicLoading, $cordovaGeolocation, $state, $rootScope) {

  var nearbyArtists = $rootScope.nearbyArtists;
  var currentPosition;
  $scope.artistCount;

  $scope.$on('$ionicView.enter', function(e) {
    $scope.artistCount = 0;
    loadMap();
  });

  $scope.$on('$ionicView.leave', function(e) {
    map.remove();
  });

  var map;

  function loadMap(){
    plugin.google.maps.Map.isAvailable(function(isAvailable, message) {
      currentPosition = $rootScope.currentUserPosition;

      // var currentPosition = new Parse.GeoPoint({latitude: 10.349792530358712, longitude: 123.90758514404297});
      $rootScope.side_menu.style.visibility = "hidden";

      if (isAvailable) {
        initMap(currentPosition);
      }

    });
  }

  function initMap(currentPosition){
    map = plugin.google.maps.Map.getMap(document.getElementById("map_canvas"), {
      'backgroundColor': '#F9F2E7',
      'mapType': plugin.google.maps.MapTypeId.ROADMAP,
      'controls': {
        'compass': false,
        'myLocationButton': false,
        'indoorPicker': false,
        'zoom': false
      },
      'gestures': {
        'scroll': true,
        'tilt': false,
        'rotate': false,
        'zoom': true,
      },
      'camera': {
        'latLng': new plugin.google.maps.LatLng(currentPosition._latitude, currentPosition._longitude),
        'zoom': 15,
      }
    });

    map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
      initMarkers();
    });
 }

 function initMarkers(){
   $ionicLoading.show({
     template: 'Loading :)'
   }).then(function(){
   });

   map.addMarker({
     'position': new plugin.google.maps.LatLng(currentPosition._latitude, currentPosition._longitude),
     'title': 'You',
     'icon': {
       'url': 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/green.png'
     }
   }, function(marker) {
     marker.showInfoWindow();
   });

   nearbyArtists.forEach(function(artist) {
     var locObj = new plugin.google.maps.LatLng(artist.get('coordinates')._latitude, artist.get('coordinates')._longitude);

     map.addMarker({
       'position': locObj,
       'title': artist.get('firstName') + ' ' + artist.get('lastName'),
       'snippet': artist.get('serviceType'),
       'icon' : {
         url : artist.get('icon'),
         size : {
           width : 48,
           height : 48
         }
       },
       infoClick: function(marker) {
         $state.go('app.artist', {artistId: artist.id});
       }
     }, function(marker) {
       // marker.showInfoWindow(); // Show infowindow
       $scope.artistCount += 1;

       if($scope.artistCount === nearbyArtists.length){
         $ionicLoading.hide();
       }
     });

   });
 }

 $rootScope.$ionicGoBack = function(backCount) {
   if($scope.artistCount === nearbyArtists.length){
     $ionicHistory.goBack(backCount);
   }
 };

});
