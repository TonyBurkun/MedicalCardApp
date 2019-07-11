import React, { Component } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import * as Colors from '../utils/colors'

import InternetNotification from '../components/ui_components/InternetNotification'
import CalendarIcon from "./ui_components/CalendarIcon";
import Avatar from "./Avatar";
import commonStyles from "../utils/commonStyles";

class CreateNote extends Component{

  static navigationOptions = ({navigation}) => {

    return {
      // headerLeft: (
      //   <CalendarIcon/>
      // ),
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Создать запись</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.MAIN_BACKGROUND,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
      // headerRight: (
      //   <Avatar/>
      // ),
      // headerStyle: commonStyles.topHeader,

    }
  };


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>
        <Text>Create Note component</Text>
      </SafeAreaView>
    )
  }
}

export default CreateNote;

const styles = StyleSheet.create({});
