import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../utils/colors";
import PropTypes from 'prop-types'

class DateLabel extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {
    return (
      <View>
        <Text style={{fontSize: 12, fontWeight: 'bold', color: Colors.GRAY_TEXT, marginBottom: 16}}>{this.props.date}</Text>
      </View>
    )
  }


}

export default DateLabel


DateLabel.propTypes = {
  date: PropTypes.string.isRequired,
};

DateLabel.defaultProps = {
 date: 'Дата'
};

const styles = StyleSheet.create({});


