'use strict';

var Reflux = require('reflux');
var _ = require("underscore");

var COUCH_URL = "http://lite.couchbase./todos3/";

class TodoCouch {
  constructor(url) {
    this.url = url
    this.db = false;
  }
  ensureDB() {
    if (this.db) {
      return Promise.resolve(true)
    }

    return fetch(this.url).then((response) => {
      if (response.status !== 200) {
        return fetch(this.url,{method:"PUT"})
        .then((response) => response.json()).then((data) => {
          // console.log("ensureDB", data)
          this.db = true;
          return data;
        }).catch()
      }
    })
  }
  getItems() {
    this.ensureDB();
    return fetch(this.url + "_all_docs?include_docs=true").then((response) => response.json()).then((data) => {
      // console.log("all", data)
      return data.rows.reduce((all, row) => {
        all[row.id] = row.doc; 
        return all
      }, {});
    })
  }
  getItem(id) {
    return fetch(this.url + id).then((response) => response.json()).then((data) => {
      // console.log("getItem", data)
      return data;
    })
  }
  saveItem(id, item) {
    // return Promise.resolve(console.log("no save"))
    // console.log("try save")
    return fetch(this.url + id,{
      method:"PUT", 
      body : JSON.stringify(item)})
    .then((response) => response.json()).then((data) => {
      // console.log("saved", data)
      return data;
    }).catch((e)=> console.log(e))
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
      return couch.saveItem(id, updatedTodo).then((ok)=>this.trigger(null))
    }).done()
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
