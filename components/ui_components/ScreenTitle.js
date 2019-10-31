import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {BLACK_TITLE} from '../../utils/colors'

const ScreenTitle = (props) => {

  const {titleText, align, marginTop} = props;

  return (
    <View>
      <Text style={[styles.title, {textAlign: align, marginTop: marginTop}]}>{titleText}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    color: BLACK_TITLE,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    // marginTop: 16,
    // marginBottom: 8,
  }
});

ScreenTitle.propTypes = {
  titleText: PropTypes.string.isRequired,
  align: PropTypes.string,
  marginTop: PropTypes.number,
};

ScreenTitle.defaultProps = {
  titleText: 'ЗАГОЛОВОК ОКНА',
  align: 'left',
  marginTop: 16,
};



export default ScreenTitle
