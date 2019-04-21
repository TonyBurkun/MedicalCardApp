import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import ScreenTitle from './ui_components/ScreenTitle'
import * as Colors from '../utils/colors'
import commonStyles from '../utils/commonStyles'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';




class MedicalCardCreate extends Component {



  handleSubmitForm = () => {
    console.log('sumbit form');


  };

  handleLogOut = () => {
    const {navigation} = this.props;
    signOut(navigation);
  };

  handlePassBtn= () => {
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View>
          <ScreenTitle titleText={'МЕДИЦИНСКАЯ КАРТА'} marginTop={48}/>
          <Text style={[commonStyles.subTitle, {textAlign: 'left', marginTop: 10}]}>Вы можете заполнить только подходящие для Вас блоки</Text>

        </View>
      </SafeAreaView>
    )
  }
}

export default MedicalCardCreate

const styles = StyleSheet.create({});
