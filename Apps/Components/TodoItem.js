'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;
var Reflux = require('reflux');

var TodoActions = require('../Actions/TodoActions');

module.exports = React.createClass({
  render: function() {
    var todo = this.props.todo;
    var styleTodoItemComplete = (todo.complete) ? styles.todoItemComplete : null;
    return (
      <View>
        <View style={[styles.todoItem, styleTodoItemComplete]}>
          <Text style={styles.text}>{todo.text}</Text>
          <Text style={styles.text}>{todo.complete}</Text>
          <Text onPress={() => this._onToggleComplete(todo)}>[完了]</Text>
          <Text onPress={() => this._onDestroy(todo)}>[削除]</Text>
        </View>
        <View style={styles.separator} />
      </View>
    );
  },

  _onToggleComplete: function(todo) {
    if (todo.complete) {
      TodoActions.todoUndoComplete(todo.id);
    } else {
      TodoActions.todoComplete(todo.id);
    }
  },
  _onDestroy: function(todo) {
    TodoActions.todoDestroy(todo.id);
  }
});

var styles = StyleSheet.create({
  todoItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    height: 58,
  },
  todoItemComplete: {
    opacity: 0.3,
  },
  text: {
    flex: 1,
    textAlign: 'left',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});
