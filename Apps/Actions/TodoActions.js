'use strict';

var Reflux = require('reflux');

module.exports = Reflux.createActions([
  'todoCreate',
  'todoUpdate',
  'todoComplete',
  'todoUndoComplete',
  'todoDestroy',
]);
