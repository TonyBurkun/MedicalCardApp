import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import commonStyles from '../../utils/commonStyles'
import * as Colors from '../../utils/colors'


export default class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
  };

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => {
    const {value} = this.props;

    if (!value) {
      this.setState({ isFocused: false })
    }


  };

  render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: 'absolute',
      left: 16,
      top: !isFocused ? 20 : 5,
      fontSize: !isFocused ? 14 : 14,
      color: !isFocused ? Colors.BLACK_TITLE : Colors.BLACK_TITLE,
    };
    return (
      <View style={[commonStyles.tableBlockItem, { paddingTop: 18 }]}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
          style={[commonStyles.tableBlockItemText, {fontSize: 16, color: Colors.MAIN_GREEN, paddingTop: 8.7, paddingBottom: 10}]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
