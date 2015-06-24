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