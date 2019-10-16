import React, { Component } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {CheckBox} from 'react-native-elements'
import PropTypes from 'prop-types'
import * as Colors from '../../utils/colors'



class OneLabel extends Component{

  constructor(props){
    super(props);
  }


  render() {

    const {labelData, hasCheckBox} = this.props;


    return(
        <TouchableOpacity
          onPress={() => {this.props.handleChoosingLabel(labelData.id, hasCheckBox)}}
          style={[styles.labelBody, {backgroundColor: labelData.color, position: 'relative'}, !hasCheckBox ? {paddingLeft: 18} : {paddingLeft: 38} ]}>
          {hasCheckBox &&
          <CheckBox
            onPress={() => {this.props.handleChoosingLabel(labelData.id, hasCheckBox)}}
            checked={labelData.checked}
            iconType='material-community'
            checkedIcon='check-circle'
            uncheckedIcon='checkbox-blank-circle-outline'
            uncheckedColor={Colors.WHITE}
            checkedColor={Colors.WHITE}
            size={20}
            containerStyle={{margin: 0, padding: 0, alignSelf: 'center', position: 'absolute', left: 0, top: '50%', marginTop: -10}}
          />
          }
          <Text style={styles.labelText}>{labelData.title}</Text>
        </TouchableOpacity>
    )
  }
}

export default OneLabel

const styles = StyleSheet.create({
  labelBody: {
    borderRadius: 10,
    height: 56,
    // paddingRight: 18,
    marginLeft: 16,
    // marginRight: 16,
    flexDirection: 'row',
    marginBottom: 8
  },

  labelText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase'

  }
});


OneLabel.propTypes = {
  labelData: PropTypes.object.isRequired,
  handleChoosingLabel: PropTypes.func.isRequired,
  hasCheckBox: PropTypes.bool.isRequired,

};

OneLabel.defaultProps = {
  labelData: {
    id: 'label-id',
    title: 'Название метки',
    color: '#8BC34A',
    checked: false,
  },
  hasCheckBox: false
};
