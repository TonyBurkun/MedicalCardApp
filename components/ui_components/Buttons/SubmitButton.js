import React, {Component} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import commonStyles from "../../../utils/commonStyles";
import {ifIphoneX} from "react-native-iphone-x-helper";


class SubmitButton extends Component{


  render() {

    const {isEnabled, title} = this.props;


    return (
      <TouchableOpacity
        onPress={() => {this.props.handleSubmitForm()}}
        style={isEnabled
          ? [commonStyles.submitBtn, commonStyles.firstBtn, {...ifIphoneX({marginBottom: 0},{marginBottom: 20})}]
          : [commonStyles.submitBtn, commonStyles.firstBtn, commonStyles.disabledSubmitBtn, {...ifIphoneX({marginBottom: 0},{marginBottom: 20})}]}
        disabled={!isEnabled}
      >
        <Text style={isEnabled
          ? commonStyles.submitBtnText
          : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}>{title}</Text>
      </TouchableOpacity>
    )
  }
}

SubmitButton.propTypes = {
  isEnabled: PropTypes.bool,
  handleSubmitForm: PropTypes.func.isRequired,
  title: PropTypes.string
};

SubmitButton.defaultProps = {
  isEnabled: true,
  title: 'СОХРАНИТЬ'
};

export default SubmitButton;
