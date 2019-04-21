import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {GRAY_TEXT} from '../../utils/colors'
import PropTypes from 'prop-types'




const StepScreenTitle = (props) =>{



  const {numberStep} = props;

  return (
    <View>
      <Text style={styles.title}>Шаг {numberStep}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: GRAY_TEXT,
    marginTop: 13

  }
});

StepScreenTitle.propTypes = {
  numberStep: PropTypes.number
};

StepScreenTitle.defaultProps = {
  numberStep: null
};


export default StepScreenTitle
