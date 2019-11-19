import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../../utils/colors";
import PropTypes from 'prop-types'

class GreenTitle extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {
    return (
      <View>
        <Text style={{color: Colors.MAIN_GREEN, fontSize: 12, textTransform: 'uppercase'}}>{this.props.title}</Text>
      </View>
    )
  }


}

export default GreenTitle

GreenTitle.propTypes = {
  title: PropTypes.string.isRequired,

};

GreenTitle.defaultProps = {
 title: 'Название раздела'
};


const styles = StyleSheet.create({});
