import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, Platform, Dimensions} from 'react-native'
import {connect} from 'react-redux'
import {SafeAreaView} from "react-navigation";
import InternetNotification from "./ui_components/InternetNotification";
import * as Colors from "../utils/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isIphone5} from '../utils/helpers'

import {getDoctorSpecializations} from '../utils/API';
import {setDoctorSpecializations} from '../actions/doctorSpecializations'


class Doctors extends Component{

  constructor(props){
    super(props);

    this.state={
      doctors: [],
    }
  }


  render() {


    console.log(isIphone5());


    const {doctors} = this.state;


    return(
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>

        {!doctors.length &&
        <View style={{flex: 1, position: 'relative'}}>
          <View style={styles.mainTextWrapper}>
            <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь отображаются карточки Докторов которые есть в нашей базе и которых Вы добавили самостоятельно.</Text>
            <Text style={[!isIphone5()? styles.subText: styles.subText__smallPhone]}>Создавайте, редактируйте или удаляйте Докторов</Text>
          </View>
          <Image
            style={styles.personImage}
            source={require('../assets/person/pills.png')}/>
          <View style={styles.tipWrapper}>
            <Text style={styles.tipText}>Добавить карточку доктора</Text>
            <Image
              style={styles.tipArrow}
              source={require('../assets/vector/pills_vector.png')}/>

          </View>
        </View>
        }
      </SafeAreaView>
    )
  }
}


function mapStateToProps (state) {
  console.log(state);

  return {
    doctorSpecializations: state.doctors.doctorSpecializations
  }
}

export default connect(mapStateToProps)(Doctors);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE
  },

  submitBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.DARK_CERULEAN,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },

  firstBtn: {
    marginTop: 30,
  },

  submitBtnText: {
    ...Platform.select({
      ios: {
        textTransform: 'uppercase',
      }
    }),
    textAlign: 'center',
    color: Colors.ISABELLINE,
  },

  mainTextWrapper: {
    fontSize: 16,
    width: '100%',
    position: 'absolute',
    top: '10%',
    paddingLeft: 30,
    paddingRight: 30,
  },

  mainText: {
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  mainText__smallPhone: {
    fontSize: 12,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },

  subText__smallPhone: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },


  personImage: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    width: wp('43%'),
    height: hp('55%')
  },

  tipWrapper: {
    position: 'absolute',
    bottom: 20,
    right: '50%',
    marginRight: -140,
    width: 140,
    height: 110,
  },

  tipText: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GREEN_TIP
  },

  tipArrow: {
    width: 39,
    height: 62,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -31,
  }

});


