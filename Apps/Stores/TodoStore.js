'use strict';

var Reflux = require('reflux');
var _ = require("underscore");

var COUCH_URL = "http://localhost:5984/todos/";

class TodoCouch {
  constructor(url) {
    this.url = url
  }
  getItems() {
    return fetch(this.url + "_all_docs?include_docs=true").then((response) => response.json()).then((data) => {
      return data.rows.reduce((all, row) => {
        all[row.id] = row.doc; 
        return all
      }, {});
    })
  }
  getItem(id) {
    return fetch(this.url + id).then((response) => response.json())
  }
  saveItem(id, item) {
    return fetch(this.url + id,{
      method:"PUT", 
      body : JSON.stringify(item)})
    .then((response) => response.json()).then((data) => {
      return data;
    })
  }
};

var couch = new TodoCouch(COUCH_URL);

module.exports = Reflux.createStore({
  listenables: [require('../Actions/TodoActions')],

  onTodoCreate: function(text) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    couch.saveItem(id, {
      id : id,
      complete: false,
      text: text,
    }).then((saved) => this.trigger(null)).done();
  },
  onTodoUpdate: function(id, updates) {
    return couch.getItem(id).then((savedTodo) => {
      var updatedTodo = _.extend({}, savedTodo, updates)
      return couch.saveItem(id, updatedTodo).then((ok)=>this.trigger(null)).done()
    })
  },
  onTodoComplete: function(id) {
    this.onTodoUpdate(id, {complete: true});
  },
  onTodoUndoComplete: function(id) {
    this.onTodoUpdate(id, {complete: false});
  },
  onTodoDestroy: function(id) {
    this.onTodoUpdate(id, {_deleted: true});
  },

  getAll: function() {
    return couch.getItems()
  },
});
