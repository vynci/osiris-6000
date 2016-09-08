
app.controller('DiscoverCtrl', function($scope, $ionicModal, $ionicLoading, $ionicPopup, portfolioService, $state, commentService, customerService) {

  console.log('Discvoer List View!');
  $scope.spiral = 'img/placeholder.png';
  $scope.cardInfo = {};
  $scope.pageCount = 10;

  getPortfolios();

  $ionicLoading.show({
    template: 'Loading :)'
  }).then(function(){
    console.log("The loading indicator is now displayed");
  });

  $ionicModal.fromTemplateUrl('templates/comment-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.commentModal = modal;
  });

  if(!Parse.User.current()){
    $scope.customerProfile = {};
  }else{
    $scope.customerProfile = {};
    getCustomerProfile();
  }

  function getPortfolios(skip){
    portfolioService.getPortfolios(skip)
    .then(function(results) {
      // Handle the result
      if(skip){
        console.log('skip');
        var tmp = $scope.cards;
        $scope.cards = tmp.concat(results);
      } else{
        console.log('not skip');
        $scope.cards = results;
      }
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  function getCommentsById(id){
    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
    });

    commentService.getCommentsById(id)
    .then(function(results) {
      // Handle the result
      console.log(results);
      $scope.comments = results;
      $ionicLoading.hide();
    }, function(err) {
      $ionicLoading.hide();
      // Error occurred
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });
  }

  $scope.refresh = function(){
    getPortfolios();
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.addLike = function(card){
    if(!arrayContains.call(card.attributes.likes, Parse.User.current().id)){
      card.add('likes', Parse.User.current().id);

      card.save(null,{
        success: function(result) {
          // save succeeded
        },
        error: function(testObject, error) {
          // inspect error
        }
      });
    } else {
      card.remove('likes', Parse.User.current().id);

      card.save(null,{
        success: function(result) {
          // save succeeded
          console.log(result);
        },
        error: function(testObject, error) {
          // inspect error
        }
      });
    }
  }

  $scope.getComments = function(card){
    $scope.currentCard = card;
    $scope.cardInfo.portfolioId = card.id;
    getCommentsById(card.id);
    $scope.commentModal.show();
  }

  $scope.hideComments = function(){
    $scope.comments = [];
    $scope.commentModal.hide();
  }

  $scope.postComment = function(id){
    console.log($scope.cardInfo);

    $ionicLoading.show({
      template: 'Loading :)'
    }).then(function(){
    });

    var Comment = Parse.Object.extend("Comment");
    var comment = new Comment();

    comment.set('portfolioId', $scope.cardInfo.portfolioId);
    comment.set('commenterInfo', $scope.customerProfile);
    comment.set('comment', $scope.cardInfo.comment);

    comment.save(null, {
      success: function(result) {
        // Execute any logic that should take place after the object is saved.
        getCommentsById($scope.cardInfo.portfolioId);
        $scope.cardInfo.comment = '';

        $scope.currentCard.add('comments', result.id);

        $scope.currentCard.save(null,{
          success: function(result) {
            // save succeeded
            $ionicLoading.hide();
          },
          error: function(testObject, error) {
            // inspect error
            $ionicLoading.hide();
          }
        });


      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        getCommentsById($scope.cardInfo.portfolioId);
        $ionicLoading.hide();
      }
    });
  }

  $scope.loadMorePosts = function(){
    getPortfolios($scope.pageCount);
    $scope.pageCount += 10;
  }

  function arrayContains(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function(needle) {
        var i = -1, index = -1;

        for(i = 0; i < this.length; i++) {
          var item = this[i];

          if((findNaN && item !== item) || item === needle) {
            index = i;
            break;
          }
        }

        return index;
      };
    }

    return indexOf.call(this, needle) > -1;
  };

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
