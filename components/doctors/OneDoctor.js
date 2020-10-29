import React, {Component} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native'
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import {connect} from 'react-redux'
import * as Colors from "../../utils/colors";
import commonStyles from "../../utils/commonStyles";
import InternetNotification from "../ui_components/InternetNotification";
import {TYPOGRAPHY_COLOR_DARK} from "../../utils/colors";
import GroupButtonsTitle from "../ui_components/titles/GroupButtonsTitle";
import {Image, AirbnbRating, Rating} from "react-native-elements/src/index";
import {isIphone5} from '../../utils/helpers'
import {getUIDfromFireBase} from '../../utils/API'

import HeaderAddBtn from "../ui_components/TopNavigation/HeaderAddBtn";
import EditIconBtn from "../ui_components/TopNavigation/EditIconBtn";
import withNavigation from "react-navigation/src/views/withNavigation";

class OneDoctor extends Component{

  constructor(props){
    super(props);

    this.state={
      currentDoctor: {},
      firstName: '',
      lastName: '',
      jobLocation: '',
      rating: 0,
      specializations: [],
      addCellPhone: '',
      cellPhone: '',
      comment: ''
    }

  }


  static navigationOptions = ({navigation}) => {

    let currentDoctor = '';
    let showEditBtn = false;
    const uid = getUIDfromFireBase();

    if (navigation.state.params && navigation.state.params.currentDoctor) {
      currentDoctor = navigation.state.params.currentDoctor;

      if (currentDoctor.createdByUser === uid){
         showEditBtn = true;
      }
    }

    function handleEditBtn(){
      navigation.navigate('CreateDoctor', {doctorID: currentDoctor.id});
    }

    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Карточка доктора</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      },

      headerRight: (
        <TouchableOpacity onPress={handleEditBtn}>
          <EditIconBtn show={showEditBtn}/>
        </TouchableOpacity>
        )
    }
  };


  componentDidMount() {
    const params = this.props.navigation.state.params;
    if (params && params.doctorID) {
      const doctorID = params.doctorID;
      const {doctorsList} = this.props;
      const currentDoctor = doctorsList[doctorID];

      this.setState({
        currentDoctor,
        firstName: currentDoctor.firstName,
        lastName: currentDoctor.lastName,
        jobLocation: currentDoctor.jobLocation,
        rating: currentDoctor.rating,
        specializations: currentDoctor.specializations,
        addCellPhone: currentDoctor.addCellPhone,
        cellPhone: currentDoctor.cellPhone,
        comment: currentDoctor.comment,

      })


    }
  }

  componentWillReceiveProps(nextProps) {

    console.log('New PROPS', nextProps);
    const params = this.props.navigation.state.params;
    const doctorID = params.doctorID;

    if (doctorID) {
      let updatedCurrentDoctor = nextProps.doctorsList[doctorID];
      console.log(updatedCurrentDoctor);
      this.setState({
        currentDoctor: updatedCurrentDoctor,
        firstName: updatedCurrentDoctor.firstName,
        lastName: updatedCurrentDoctor.lastName,
        jobLocation: updatedCurrentDoctor.jobLocation,
        rating: updatedCurrentDoctor.rating,
        specializations: updatedCurrentDoctor.specializations,
        addCellPhone: updatedCurrentDoctor.addCellPhone,
        cellPhone: updatedCurrentDoctor.cellPhone,
        comment: updatedCurrentDoctor.comment,
      });
    }
  }







  render(){

    const {firstName, lastName, specializations, jobLocation, cellPhone, addCellPhone, rating} = this.state;
    const {doctorSpecializations} = this.props;

    function showTwoFirstLetters(firstName, lastName){
      let firstLetters = 'Д';

      if (firstName.length) {
        const firstNameArr = firstName.split(' ');
        if (firstNameArr.length > 2) {
          firstNameArr.length = 2;
        }
        if (firstNameArr.length === 2) {
          firstLetters = firstNameArr[0].slice(0,1) +  firstNameArr[1].slice(0,1)
        } else {
          firstLetters = firstNameArr[0].slice(0,1)
        }
        return firstLetters.toUpperCase();
      }

      if (lastName.length){
        firstLetters = lastName.slice(0,2);
        return firstLetters.toUpperCase();
      }

      return firstLetters
    }
    function showSpecializations(doctorSpecializationsIDArr, specializationsArr) {
     if (doctorSpecializationsIDArr.length && specializationsArr.length){
       let doctorSpecializationsStr = '';
       doctorSpecializationsIDArr.forEach(item => {
         doctorSpecializationsStr = doctorSpecializationsStr + specializationsArr[item] + ', ';
       });

       return doctorSpecializationsStr.substring(0, doctorSpecializationsStr.length -2)
     }

    }

    return(
      <SafeAreaView style={commonStyles.container}>
          <InternetNotification/>
        <ScrollView
          contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1,}}
          scrollEnabled={isIphone5()}
        >
          <View>
            <View style={styles.nameBlock}>
              <Text style={styles.nameBlock__text}>{showTwoFirstLetters(firstName, lastName)}</Text>
            </View>
            <View>
              <Text style={{textAlign: 'center', fontSize: 24, color: Colors.BLACK_TITLE_BTN, marginTop: 24}}>{`${firstName} ${lastName}`}</Text>
              <Text style={{ textAlign: 'center', fontSize: 16, color: Colors.GRAY_TEXT, marginTop: 8}}>{showSpecializations(specializations, doctorSpecializations)}</Text>
            </View>
            <View style={{marginTop: 16}}>
              {Boolean(jobLocation.length) &&
              <View>
                <GroupButtonsTitle title={'МЕСТО РАБОТЫ (УЧЕРЕДЖЕНИЕ, АДРЕС)'} paddingLeft={40}/>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Image
                    source={require('../../assets/doctors/help_medic_briefcase.png')}
                    style={{width: 24, height: 24}}
                  />
                  <Text style={{alignSelf: 'center', marginLeft: 16, fontSize: 16, color: Colors.TYPOGRAPHY_COLOR_DARK}}>{jobLocation}</Text>
                </View>
              </View>
              }
              {Boolean(addCellPhone.length || cellPhone.length) &&
              <View>
                <GroupButtonsTitle title={'КОНТАКТНЫЕ ДАННЫЕ'} paddingLeft={40}/>
                {Boolean(cellPhone.length) &&
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Image
                    source={require('../../assets/doctors/phone.png')}
                    style={{width: 24, height: 24}}
                  />
                  <Text style={{alignSelf: 'center', marginLeft: 16, fontSize: 16, color: Colors.MAIN_GREEN, fontWeight: 'bold'}}>+380 {cellPhone}</Text>
                </View>
                }
                {Boolean(addCellPhone.length) &&
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Image
                    source={require('../../assets/doctors/phone.png')}
                    style={{width: 24, height: 24}}
                  />
                  <Text style={{alignSelf: 'center', marginLeft: 16, fontSize: 16, color: Colors.MAIN_GREEN, fontWeight: 'bold'}}>+380 {addCellPhone}</Text>
                </View>
                }
              </View>
              }

            </View>
          </View>
          <View>
            <Text>{this.state.comment}</Text>
          </View>


          <View style={{marginTop: 50, marginBottom: 70, justifyContent: 'flex-end'}}>
            <Text style={{fontSize: 16, color: Colors.BLACK_TITLE, textAlign: 'center', marginBottom: 16}}>Оценка доктора
            </Text>
            <Rating
              showRating={false}
              startingValue={rating}
              readonly
              tintColor={Colors.MAIN_BACKGROUND}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

}

function mapStateToProps(state) {
  console.log(state);
  return {
    doctorsList: state.doctors.doctorsList,
    doctorSpecializations: state.doctors.doctorSpecializations,
  }
}

// export default connect(mapStateToProps)(OneDoctor)

export default withNavigationFocus(connect(mapStateToProps)(OneDoctor))

const styles = StyleSheet.create({
  nameBlock: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.AVATAR_TEXT_BLOCK,
    alignSelf: 'center',
    marginTop: 24,
    justifyContent: 'center'
  },
  nameBlock__text: {
    color: Colors.WHITE,
    fontSize: 34,
    textAlign: 'center',
  }
});

