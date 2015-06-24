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
