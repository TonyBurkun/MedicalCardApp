import React, {Component} from 'react'
import {View, Text, TextInput, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import commonStyles from '../../../utils/commonStyles'
import * as Colors from '../../../utils/colors'
import {MAIN_BACKGROUND} from "../../../utils/colors";
import {MAIN_GREEN} from "../../../utils/colors";


export default class PhoneLabelInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      isFocused: false,
      isEmpty: true,
      emptyFieldText: '(00) 000 - 00 - 00'
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
        emptyFieldText: '(00) 000 - 00 - 00',
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
      <View style={[commonStyles.tableBlockItem, { paddingTop: 18, paddingLeft: 16 }]}>
        <Text style={labelStyle}>
          {label}
        </Text>
       <View style={{flexDirection: 'row', paddingTop: 8.7, paddingBottom: 10}}>
         <Text style={{fontSize: 16, fontWeight: 'bold', color: Colors.TYPOGRAPHY_COLOR_DARK}}>+380</Text>
         <TextInput
           {...props}
           style={[{fontSize: 16, marginLeft: 5, flexGrow: 2},
             isEmpty ? {color: Colors.TABLE_TITLE} : {color: Colors.TYPOGRAPHY_COLOR_DARK},
             isFocused ? {color: Colors.MAIN_GREEN} : {},
           ]}
           maxLength={9}
           keyboardType={'number-pad'}
           onFocus={this.handleFocus}
           onBlur={this.handleBlur}
           blurOnSubmit
           value={value}
         />
       </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


PhoneLabelInput.propTypes = {
  value: PropTypes.string.isRequired,
};

PhoneLabelInput.defaultProps = {
  value: '',
};
