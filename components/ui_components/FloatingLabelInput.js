import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import commonStyles from '../../utils/commonStyles'
import * as Colors from '../../utils/colors'
import PropTypes from 'prop-types'
import {MAIN_BACKGROUND} from "../../utils/colors";
import {MAIN_GREEN} from "../../utils/colors";


export default class FloatingLabelInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      isFocused: false,
      isEmpty: true,
      emptyFieldText: this.props.placeholder
    };

  }


  componentWillReceiveProps(newProps){

    this.setState({
      isEmpty: !newProps.value.length
    })
  }



  handleFocus = () => {
    // console.log('is focus');

    this.setState({
      isEmpty: false,
      isFocused: true,
      emptyFieldText: ''
    })
  };

  handleBlur = () => {

    // console.log('IN BLUR');
    let {value} = this.props;

    if (!value){
      this.setState({
        emptyFieldText: this.props.placeholder,
        isEmpty: true
      });
    }

    this.setState({
      isFocused: false,
    });
  };

  render() {

    const { label, ...props} = this.props;
    const { isEmpty, isFocused } = this.state;

    let {value} = this.props;

    if (!value) {
      value = this.state.emptyFieldText
    }

    const labelStyle = {
      position: 'absolute',
      left: 16,
      top: isEmpty ? 5 : 5,
      fontSize: 14,
      color: isEmpty ? Colors.BLACK_TITLE : Colors.GRAY_TEXT,
    };
    return (
      <View style={[commonStyles.tableBlockItem, { paddingTop: 25 }]}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
          multiline={this.props.multiline}
          style={[commonStyles.tableBlockItemText,
            {fontSize: 16, paddingTop: 8.7, paddingBottom: 10},
            isEmpty ? {color: Colors.TABLE_TITLE} : {color: Colors.TYPOGRAPHY_COLOR_DARK},
            isFocused ? {color: Colors.MAIN_GREEN} : {},
          ]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          value={value}
          maxLength={this.props.maxLength}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


FloatingLabelInput.propTypes = {
  maxLength: PropTypes.number,
  value: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  placeholder: PropTypes.string,
};

FloatingLabelInput.defaultProps = {
  value: '',
  multiline: false,
  placeholder: 'Введите текст'
};

