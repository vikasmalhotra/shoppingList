'use strict';

angular.module('shoppingListApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
])
  .config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  }]);
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

'use strict';

angular.module('shoppingListApp')
	//Factory methods to make api calls regarding shopping list
	.factory('shoppingListFactory', ['$http', function($http) {
		return {
			//Fetch the complete list
			getList: function() {
				return $http.get('/api/list');
			},
			//Delete the item
			deleteItem: function(id) {
				return $http.delete('/api/list/' + id);
			},
			//Fetch single item
			fetchItem: function(id) {
				return $http.get('/api/list/' + id);
			},
			//Post a single item
			postItem: function(item) {
				return $http.post('/api/list', { price: item.price,name: item.name });
			}
		};
	}]);
'use strict';

angular.module('shoppingListApp')
  .config(["$stateProvider", function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  }]);
'use strict';

angular.module('shoppingListApp')
  .controller('NavbarCtrl', ["$scope", "$location", function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);
angular.module('shoppingListApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/main/main.html',
    "<div ng-init=init()><div ng-include=\"'components/navbar/navbar.html'\"></div><header class=hero-unit id=banner><div class=container><img src=assets/images/slide1-bg.jpg alt=\"Lets Go Shopping\"></div></header><div class=addItem><button class=\"btn btn-primary\" ng-click=openModal()>Add Item</button></div><div class=container><div class=row><h1 class=page-header>Shopping Items</h1><table class=table><tr class=repeat-animation ng-repeat=\"item in shoppingList\"><td><a href=javascript:void(0) ng-click=deleteItem(item._id,$index) class=close>&times;</a> <a href=javascript:void(0) ng-click=openItem(item._id)>{{::item.name}} - $&nbsp;{{::item.price}}</a></td></tr></table></div></div><alert type=success ng-repeat=\"alert in alerts\" close=closeAlert()>{{alert.msg}}</alert><footer class=footer><div class=container><p>Example of Angular</p></div></footer></div>"
  );


  $templateCache.put('components/modal/modal.html',
    "<div class=modal-header><button type=button ng-click=cancel() class=close>&times;</button><h4>Add shopping Item</h4></div><div class=modal-body><form name=listItem ng-submit=addItem(listItem.$valid) novalidate><div class=form-group><label>Item Name:</label><input class=form-control ng-maxlength=20 required name=itemName ng-model=\"item.name\"></div><div class=form-group><label>Item Price:</label><input type=number class=form-control required name=itemPrice ng-model=\"item.price\"></div><button class=\"btn btn-primary\" ng-disabled=listItem.$invalid type=submit>Add Item</button> <button class=\"btn btn-default\" ng-click=cancel()>Cancel</button></form></div>"
  );


  $templateCache.put('components/modal/singleItemModal.html',
    "<div class=modal-header><h4>View Item</h4></div><div class=modal-body><div><label>Item Name:</label><label>{{::item.name}}</label></div><div><label>Item Price:</label><label>{{::item.price}}</label></div><button class=\"btn btn-primary\" ng-click=ok()>Ok</button></div>"
  );


  $templateCache.put('components/navbar/navbar.html',
    "<div class=\"navbar navbar-default navbar-static-top\" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click=\"isCollapsed = !isCollapsed\"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href=\"/\" class=navbar-brand>Shopping List</a></div><div collapse=isCollapsed class=\"navbar-collapse collapse\" id=navbar-main><ul class=\"nav navbar-nav\"><li ng-repeat=\"item in menu\" ng-class=\"{active: isActive(item.link)}\"><a ng-href={{item.link}}>{{item.title}}</a></li></ul></div></div></div>"
  );

}]);

