import React, { Component } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import * as Colors from '../../utils/colors'

import InternetNotification from '../ui_components/InternetNotification'
import CalendarIcon from "../ui_components/CalendarIcon";
import Avatar from "../ui_components/Avatar";
import commonStyles from "../../utils/commonStyles";

class CreateTest extends Component{

  static navigationOptions = ({navigation}) => {

    return {
      // headerLeft: (
      //   <CalendarIcon/>
      // ),
      headerTitle: 'Создать Анализ',
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
        <Text>Create Test component</Text>
      </SafeAreaView>
    )
  }
}

export default CreateTest;

const styles = StyleSheet.create({});
