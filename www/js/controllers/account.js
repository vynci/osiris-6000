
app.controller('AccountCtrl', function($scope, $ionicModal, $timeout, customerService, $ionicLoading, $rootScope, $ionicPopup) {

  $scope.customerProfile = {};

  getCustomerProfile();

  function getCustomerProfile(){
    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
      console.log("The loading indicator is now displayed");
    });

    if($rootScope.currentUser){
      customerService.getCustomerById($rootScope.currentUser.get('profileId'))
      .then(function(results) {
        // Handle the result
        console.log(results);
        $scope.currentCustomerProfile = results[0];

        $scope.customerProfile.firstName = results[0].get('firstName');
        $scope.customerProfile.lastName = results[0].get('lastName');
        $scope.customerProfile.email = results[0].get('email');
        $scope.customerProfile.birthDate = results[0].get('birthDate') || new Date();
        $scope.customerProfile.gender = results[0].get('gender') || 'female';
        $scope.customerProfile.address = results[0].get('address');
        $scope.customerProfile.contactNumber = results[0].get('contactNumber');

        $scope.customerProfile.oldPassword = 'helloworld';
        $scope.customerProfile.newPassword = 'helloworld';

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

  $scope.updateProfile = function(){



    $scope.currentCustomerProfile.set("firstName", $scope.customerProfile.firstName);
    $scope.currentCustomerProfile.set("lastName", $scope.customerProfile.lastName);
    $scope.currentCustomerProfile.set("email", $scope.customerProfile.email);
    $scope.currentCustomerProfile.set("gender", $scope.customerProfile.gender);
    $scope.currentCustomerProfile.set("contactNumber", $scope.customerProfile.contactNumber);
    $scope.currentCustomerProfile.set("address", $scope.customerProfile.address);
    console.log($scope.customerProfile.birthDate);
    $scope.currentCustomerProfile.set("birthDate",$scope.customerProfile.birthDate);

    console.log($scope.currentCustomerProfile.attributes);

    $scope.currentCustomerProfile.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        var alertPopup = $ionicPopup.alert({
          title: 'Account Update',
          template: 'Your account profile has been successfully updated.'
        });

        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });

      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log(error);
      }
    });
  }

});
