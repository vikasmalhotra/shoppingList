/**
 * Using REST naming convention for endpoints.
 * GET     /list              ->  index
 * POST    /list              ->  create
 * GET     /list/:id          ->  show
 * PUT     /list/:id          ->  update
 * DELETE  /list/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var List = require('./shoppingList.model');

// Get list of list
exports.index = function(req, res) {
  List.find(function (err, list) {
    if(err) { return handleError(res, err); }
    return res.json(200, list);
  });
};

// Get a single item from list
exports.show = function(req, res) {
  List.findById(req.params.id, function (err, list) {
    if(err) { return handleError(res, err); }
    if(!list) { return res.send(404); }
    return res.json(list);
  });
};

// Creates a new item in the DB.
exports.create = function(req, res) {
  List.create(req.body, function(err, item) {
    if(err) { return handleError(res, err); }
    return res.json(201, item);
  });
};

// Updates an existing item in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  List.findById(req.params.id, function (err, item) {
    if (err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    var updated = _.merge(item, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, item);
    });
  });
};

// Deletes an iten from the DB.
exports.destroy = function(req, res) {
  List.findById(req.params.id, function (err, item) {
    if(err) { return handleError(res, err); }
    if(!item) { return res.send(404); }
    item.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}