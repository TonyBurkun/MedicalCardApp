import React, {Component} from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types'
import {Image} from 'react-native-elements'

class EditIconBtn extends Component{
  constructor(props) {
    super(props);

  }


  render(){

    const {show} = this.props;

    return(
      show &&
       <Image
         style={{width: 40, height: 40, borderRadius: 20, marginRight: 8, marginBottom: 5}}
         source={require('../../../assets/general/edit.png')}/>
    )
  }
}

export default EditIconBtn

EditIconBtn.propTypes = {
  show: PropTypes.bool.isRequired,
};

EditIconBtn.defaultProps = {
  show: false
};
