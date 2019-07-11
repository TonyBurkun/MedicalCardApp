import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../utils/colors";
import PropTypes from 'prop-types'
import ScreenTitle from "./ScreenTitle";

class GroupButtonsTitle extends Component{
  render() {

    const {title, topMargin} = this.props;

    return (
      <View>
        <Text style={[styles.groupButtonsTitle, {marginTop: topMargin} ]}>{title}</Text>
      </View>
    )
  }
}

export default GroupButtonsTitle


const styles = StyleSheet.create({
  groupButtonsTitle: {
    fontSize: 12,
    color: Colors.TABLE_TITLE,
    marginBottom: 7.32,
    fontWeight: 'bold',

  }
});


GroupButtonsTitle.propTypes = {
  title: PropTypes.string.isRequired,
  topMargin: PropTypes.number,
};

GroupButtonsTitle.defaultProps = {
  title: 'ЗАГОЛОВОК БЛОКА КНОПОК',
  topMargin: 24,

};
