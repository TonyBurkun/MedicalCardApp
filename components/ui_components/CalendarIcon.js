import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native'
import {Icon} from 'react-native-elements'
import * as Colors from "../../utils/colors";

export default class CalendarIcon extends Component{

  handlePressCalendar = () => {
    if(Platform.OS === 'ios') {
      Linking.openURL('calshow:');
    } else if(Platform.OS === 'android') {
      Linking.openURL('content://com.android.calendar/time/');
    }
  };



  render() {
    return (
      <TouchableOpacity
        style={styles.calendarBtn}
        onPress={this.handlePressCalendar}
      >
        <Icon
          name='calendar'
          type='material-community'
          color={Colors.GRAY_TEXT}
          size={26}
          containerStyle={{position: 'absolute', right: '50%', top: '50%', marginTop: -13, marginRight: -13}}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  calendarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.DISABLED_BG,
    marginLeft: 10

  }
});


