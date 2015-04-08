'use strict';

var React = require('react-native');
var {
  ListView,
  StyleSheet,
} = React;
var Reflux = require('reflux');

var TodoStore = require('../Stores/TodoStore');
var TodoItem = require('./TodoItem');

module.exports = React.createClass({
  mixins: [Reflux.listenTo(TodoStore, 'handlerTodoUpdate')],

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      todoDataSource: ds,
    };
  },

  componentDidMount : function() {
    this.handlerTodoUpdate()
  },

  handlerTodoUpdate: function(err) {
    if (err) {
        return
    }
    TodoStore.getAll().then((rows) => {
      this.setState({
        todoDataSource: this.state.todoDataSource.cloneWithRows(rows),
      });
    })
  },

  render: function() {
    return (
      <ListView
        dataSource={this.state.todoDataSource}
        renderRow={(rowData) => <TodoItem todo={rowData} />}
      />
    );
  },
});

var styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#0FF',
  },
});
