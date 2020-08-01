import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import ScreenTitle from '../ui_components/titles/ScreenTitle'
import * as Colors from '../../utils/colors'
import commonStyles from '../../utils/commonStyles'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  addMedicalCardIDtoCurrentUser,
  createMedicalCardInDB,
  generateUniqID,
  getUIDfromFireBase,
  updateMedicalCardInDB
} from "../../utils/API";




class MedicalCardStart extends Component {



  handleSubmitForm = () => {
    this.props.navigation.navigate('MedicalCardCreate');
  };


  handlePassBtn= () => {

    const medicalCardDataObj = {
      dateModified: new Date().getTime(),
    };


    const UID = getUIDfromFireBase();
    const generatedID = generateUniqID();
    createMedicalCardInDB(generatedID, {uid: UID});
    updateMedicalCardInDB(generatedID, medicalCardDataObj);
    addMedicalCardIDtoCurrentUser(generatedID);
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View>
          <ScreenTitle titleText="МЕДИЦИНСКАЯ КАРТА" align="center" marginTop={48}/>
          <Image
            style={styles.medicalCardImg}
            source={require('../../assets/medical-card-img.png')}
            resizeMode="contain"
          />

          <Text style={[styles.darkText, {textAlign: 'center'}]}>Вы можете сейчас заполнить данные Вашей медицинской карты, такие “Прививки”, “Аллергии” и тд.</Text>
          <Text style={[styles.greyText, {textAlign: 'center'}]}>Если Вы хотите пропустить этот шаг, Вы всегда можете добавить данные когда у Вас будет свободное время.</Text>
          <Text style={[styles.blueText, {textAlign: 'center'}]}>Аккаунт > Профиль > Медицинская карта</Text>

        </View>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            onPress={this.handleSubmitForm}
            style={[commonStyles.submitBtn, commonStyles.firstBtn]}
          >
            <Text style={commonStyles.submitBtnText}>ПРОДОЛЖИТЬ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handlePassBtn}
            style={[commonStyles.captionBtn, {marginTop: 20}]}
          >
            <Text style={commonStyles.captionBtn__text}>ПРОПУСТИТЬ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

export default MedicalCardStart

const styles = StyleSheet.create({
  medicalCardImg: {
    width: wp('27.4%'),
    height: hp('14.7%'),
    alignSelf: 'center',
    marginTop: hp('4.9%'),
  },

  darkText: {
    color: Colors.BLACK_TITLE,
    fontSize: 16,
    marginTop: hp('4.9%'),
  },

  greyText: {
    color: Colors.GRAY_TEXT,
    fontSize: 15,
    marginTop: hp('3.69%'),
  },
  blueText: {
    color: Colors.BLUE,
    fontSize: 15,
    marginTop: hp('0.61%'),
  }
});
