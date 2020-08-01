import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import * as Colors from './../../utils/colors'

class ChosenLabel extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {

    const {title, color} = this.props;


    return (
      <View style={{height: 30, borderRadius: 10, paddingLeft: 15, paddingRight: 15, backgroundColor: color, marginBottom: 8, marginRight: 10, justifyContent: 'center' }}>
        <Text style={{color: Colors.WHITE, fontWeight: 'bold', fontSize: 8 }}>{title.toUpperCase()}</Text>
      </View>
    )
  }


}

export default ChosenLabel

const styles = StyleSheet.create({});


ChosenLabel.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

ChosenLabel.defaultProps = {
  title: 'Метка',
  color: 'red'
};

