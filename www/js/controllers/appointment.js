
app.controller('AppointmentCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, $rootScope, $ionicPopup, appointmentService, $state, customerService) {

  console.log('Appointment List View!');

  $scope.rateDescription = ['', 'Disappointed', 'Below Average', 'Satisfied', 'Above Expectations', 'Absolutely Delighted'];

  function getAppointments(){
    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });

    appointmentService.getBookingsById(Parse.User.current().get('profileId'))
    .then(function(results) {
      // Handle the result
      console.log(results);
      $scope.appointments = results;
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  if(!Parse.User.current()){
    $scope.customerProfile = {};
  }else{
    $scope.customerProfile = {};
    getCustomerProfile();
  }

  $ionicModal.fromTemplateUrl('templates/review-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reviewModal = modal;
  });

  $scope.rating = {};
  $scope.rating.rate = 3;
  $scope.rating.max = 5;
  $scope.rating.title = '';
  $scope.rating.review = '';

  $scope.refresh = function(){
    getAppointments();
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.submitReview = function(){
    //
    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
    });

    var Review = Parse.Object.extend("Review");
    var review = new Review();

    review.set('bookingId', $scope.currentAppointment.id);
    review.set('ratings', parseInt($scope.rating.rate));
    review.set('description', $scope.rating.review);
    review.set('title', $scope.rating.title);
    review.set('customerInfo', $scope.customerProfile);
    review.set('artistInfo', $scope.currentAppointment.attributes.artistInfo);

    review.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Submit Review',
          template: 'Your ratings and review has been successfully submitted!'
        });

        alertPopup.then(function(res) {
          $scope.currentAppointment.set('isReviewed', true);
          $scope.currentAppointment.save(null, {
            success: function(result) {
              $scope.reviewModal.hide();
            },
            error: function(gameScore, error) {

            }
          });
        });

      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Review Error',
          template: 'Sorry, There was something wrong with the booking process.'
        });

        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
          $scope.reviewModal.hide();
        });
      }
    });
  }

  $scope.openReviewModal = function(appointment){
    $scope.currentAppointment = appointment;
    console.log($scope.currentAppointment);
    $scope.reviewModal.show();
  }

  $scope.hideReviewModal = function(){
    $scope.reviewModal.hide();
  }

  $scope.$on('$ionicView.enter', function() {
    // code to run each time view is entered
    console.log('enter in appointment');
    getAppointments();
  });

  function getCustomerProfile(){
    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });

    if(Parse.User.current()){
      customerService.getCustomerById(Parse.User.current().get('profileId'))
      .then(function(results) {
        // Handle the result
        $scope.customerProfile.id = results[0].id;
        $scope.customerProfile.firstName = results[0].get('firstName');
        $scope.customerProfile.lastName = results[0].get('lastName');
        $scope.customerProfile.avatar = results[0].get('avatar');

        $ionicLoading.hide();

        return results;
      }, function(err) {
        // Error occurred
        $ionicLoading.hide();
        console.log(err);
      }, function(percentComplete) {
        console.log(percentComplete);
      });
    }
  }


});
