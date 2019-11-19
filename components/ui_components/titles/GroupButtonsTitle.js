import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../../utils/colors";
import PropTypes from 'prop-types'
import ScreenTitle from "./ScreenTitle";

class GroupButtonsTitle extends Component{
  render() {

    const {title, topMargin, paddingLeft} = this.props;

    return (
      <View>
        <Text style={[styles.groupButtonsTitle, {marginTop: topMargin, paddingLeft: paddingLeft} ]}>{title}</Text>
      </View>
    )
  }
}

export default GroupButtonsTitle


const styles = StyleSheet.create({
  groupButtonsTitle: {
    fontSize: 12,
    color: Colors.TABLE_TITLE,
    marginBottom: 8,
    fontWeight: 'bold',

  }
});


GroupButtonsTitle.propTypes = {
  title: PropTypes.string.isRequired,
  topMargin: PropTypes.number,
  paddingLeft: PropTypes.number,
};

GroupButtonsTitle.defaultProps = {
  title: 'ЗАГОЛОВОК БЛОКА КНОПОК',
  topMargin: 24,
  paddingLeft: 0,

};
