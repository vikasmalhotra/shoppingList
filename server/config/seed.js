/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var List = require('../api/list/shoppingList.model');


List.find({}).remove(function() {
  List.create({
    name : 'Reebok Shoe',
    price : 80
  }, {
    name : 'Calvin Klein Shirt',
    price : 200
  }, {
    name : 'Casio Watch',
    price : 89
  },  {
    name : 'Guess Watch',
    price : 103
  },  {
    name : 'Levis Jeans',
    price : 20
  },{
    name : 'Iphone 6 plus',
    price : 799
  });
});