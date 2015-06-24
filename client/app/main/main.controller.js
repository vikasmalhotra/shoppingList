'use strict';

//Module for Shopping List
angular.module('shoppingListApp')
  //Main controller to show/add/delete list and its items
  .controller('MainCtrl', ['$scope', '$http', '$modal', 'shoppingListFactory', '$timeout', function ($scope, $http,$modal,shoppingListFactory, $timeout) {
    //Local variables global to controller functions
    var timer;

    //Initialize controller
    $scope.init = function() {
      $scope.shoppingList = [];
      $scope.alerts = [];
      //Fetch the complete list
      shoppingListFactory.getList().success(function(list) {
        $scope.shoppingList = list;
      });
    };
    
    //Manually close alert
    $scope.closeAlert = function() {
      $scope.alerts = [];
    };

    //Delete the item
    $scope.deleteItem = function(id,index) {  
      shoppingListFactory.deleteItem(id).success(function() {
        $scope.shoppingList.splice(index,1);
        var alert = {};
        alert.msg = 'Deleted Successfully';
        $scope.alerts.push(alert);
        timer = $timeout(function() {
          //Close the alert after 3 seconds
          $scope.alerts = [];
        },3000);
        
      });
    };

    //Destroy the timeout so that it gets garbage collected efficiently
    $scope.$on('$destroy', function() {
      if(timer) {
        $timeout.cancel(timer);
      }
    });

    //Open single item in an modal
    $scope.openItem = function(id) {
      shoppingListFactory.fetchItem(id).success(function(item) {
        $modal.open({
          templateUrl: 'components/modal/singleItemModal.html',
          controller: 'SingleItemController',
          resolve: { 
            item: function () {
              return item;
            }
          }
        });
      });
    };

    //Open modal to add item
    $scope.openModal = function() {
      var modalInstance = $modal.open({
          templateUrl: 'components/modal/modal.html',
          controller: 'AddItemModalController'
        });

      modalInstance.result.then(function (item) {
        if(item === '') {
          return;
        }
        //Post the item after the modal closes on completion of form
        shoppingListFactory.postItem(item).then(function(item) {
          $scope.shoppingList.push(item.data);
        });
      });
    };

  }])
//add Item form controller
.controller('AddItemModalController', ['$scope','$modalInstance', function ($scope, $modalInstance) {
    
  $scope.item = {};

  //Add Item
  $scope.addItem = function (isValid) {
    if(isValid) {
      $modalInstance.close($scope.item);
    }
  };

  //Cancel the modal
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}])
//View single Item
.controller('SingleItemController', ['$scope','$modalInstance','item', function ($scope, $modalInstance,item) {
  $scope.item = item;

  //Cancel the modal window
  $scope.ok = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
