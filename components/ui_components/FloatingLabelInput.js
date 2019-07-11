import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import commonStyles from '../../utils/commonStyles'
import * as Colors from '../../utils/colors'
import {MAIN_BACKGROUND} from "../../utils/colors";
import {MAIN_GREEN} from "../../utils/colors";


export default class FloatingLabelInput extends Component {
  state = {
    isFocused: false,
    isEmpty: true,
  };

  handleFocus = () => this.setState({
    isEmpty: false,
    isFocused: true
  });
  handleBlur = () => {

    // console.log('IN BLUR');
    const {value} = this.props;

    this.setState({
      isFocused: false
    });

    if (!value) {
      this.setState({
        isEmpty: true,
      })
    }


  };

  render() {
    const { label, ...props } = this.props;
    const { isEmpty, isFocused } = this.state;

    // console.log('IS FOCUSED: ', isFocused);
    const labelStyle = {
      position: 'absolute',
      left: 16,
      top: isEmpty ? 20 : 5,
      fontSize: 14,
      color: isEmpty ? Colors.BLACK_TITLE : Colors.GRAY_TEXT,
    };
    return (
      <View style={[commonStyles.tableBlockItem, { paddingTop: 18 }]}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
          style={[commonStyles.tableBlockItemText, {fontSize: 16, paddingTop: 8.7, paddingBottom: 10}, isFocused ? {color: Colors.MAIN_GREEN} : {color: Colors.TYPOGRAPHY_COLOR_DARK}]}
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
