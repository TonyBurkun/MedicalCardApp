import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import commonStyles from "../../../utils/commonStyles";
import {ifIphoneX} from "react-native-iphone-x-helper";
import PropTypes from 'prop-types'
import * as Colors from '../../../utils/colors'

class RemoveButton extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {

    const {title} = this.props;
    return (
      <TouchableOpacity
        onPress={() => {this.props.handleRemove()}}
        style={[styles.removeBtn, commonStyles.firstBtn, {...ifIphoneX({marginBottom: 0},{marginBottom: 20})}]}
      >
        <Text style={[styles.removeBtnText]}>{title}</Text>
      </TouchableOpacity>
    )
  }


}


RemoveButton.propTypes = {
  handleRemove: PropTypes.func.isRequired,
  title: PropTypes.string
};

RemoveButton.defaultProps = {

  title: 'УДАЛИТЬ'
};

export default RemoveButton



const styles = StyleSheet.create({
  removeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 14,
    fontWeight: 'bold',
  },

  removeBtnText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 14,
    color: Colors.REMOVE_BTN
  }
});
