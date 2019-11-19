import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {withNavigation} from 'react-navigation'
import * as Colors from '../../../utils/colors'



class AddButton extends Component{

  render(){

    const {right, bottom, left, top, color} = this.props;
    return(
      <TouchableOpacity
        onPress={this.props.handlePress}
        style={[styles.addBtn, {right: right, bottom: bottom, left: left, top: top, backgroundColor: color,} ]}>
        <Image
          source={require('../../../assets/tab_navigation_ico/add_button_plus.png')}
          style={{position: 'absolute', left: '50%', marginLeft: -10, top: '50%', marginTop: -10, width: 20, height: 20}}
        />
      </TouchableOpacity>
    )
  }
}

export default withNavigation(AddButton)


const styles = StyleSheet.create({
  addBtn: {
    width: 56,
    height: 56,
    position: 'absolute',
    borderRadius: 28,
  }
});



AddButton.propTypes = {
  right: PropTypes.number,
  bottom: PropTypes.number,
  top: PropTypes.number,
  left: PropTypes.number,
  color: PropTypes.string,
  handlePress: PropTypes.func.isRequired

};

AddButton.defaultProps = {
  right: 24,
  bottom: 56,
  color: '#F59D25',
};
