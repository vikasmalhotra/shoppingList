'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ShoppingListSchema = new Schema({
  name: String,
  price: Number
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);