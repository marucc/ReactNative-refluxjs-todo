'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TextInput,
  View,
} = React;

var TodoActions = require('../Actions/TodoActions');
var TodoStore = require('../Stores/TodoStore');

module.exports = React.createClass({
  propTypes: {
    value: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      value: '',
    };
  },

  render: function() {
    return (
      <View style={styles.header}>
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => this.setState({value: text})}
          onBlur={this._save}
          placeholder={'What needs to be done?'}
          value={this.state.value}
        />
      </View>
    );
  },

  _save: function() {
    var text = this.state.value;
    if (text) {
      TodoActions.todoCreate(text);
      this.setState({
        value: ''
      });
    }
  },
});

var styles = StyleSheet.create({
  header: {
    marginTop: 21,
  },
  textInput: {
    height: 40,
    backgroundColor: '#EEEEEE',
    padding: 10,
    fontSize: 16
  },
});
