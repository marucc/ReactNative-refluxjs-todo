'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
} = React;

var TodoForm = require('./TodoForm');
var TodoList= require('./TodoList');

module.exports = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <TodoForm />
        <TodoList />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
