import React, {Component} from 'react'
import {View, Text, ScrollView} from 'react-native'
import {connect} from 'react-redux'
import * as Colors from "../utils/colors";
import CustomList from "./ui_components/List/CustomList";
import commonStyles from "../utils/commonStyles";
import {SafeAreaView} from "react-navigation";
import InternetNotification from "./ui_components/InternetNotification";
import HeaderAddBtn from "./ui_components/TopNavigation/HeaderAddBtn";







class ChoseDoctorSpecializations extends Component{

  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}> Специализации </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      },
      headerRight: (
        <HeaderAddBtn titleBtn={'Сохранить'} type={'doctorSpecializations'}/>
      )
    }
  };



  render() {

    // console.log(this.state);
    // console.log(this.props);

    const doctorSpecializationArr = this.props.doctorSpecializations;
    const {chosenDoctorSpecializations} = this.props;

    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0, backgroundColor: Colors.WHITE}]}>
        <InternetNotification topDimension={0}/>
        <CustomList data={doctorSpecializationArr} route={'ChoseDoctorSpecializations'} chosenItemsID={chosenDoctorSpecializations}/>
      </SafeAreaView>
    )
  }
}


function mapStateToProps (state) {
  return {
    doctorSpecializations: state.doctors.doctorSpecializations,
    chosenDoctorSpecializations: state.doctors.chosenDoctorSpecializations,
  }
}


export default connect(mapStateToProps)(ChoseDoctorSpecializations)
