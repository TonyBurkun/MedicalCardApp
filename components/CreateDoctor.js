import React, {Component} from 'react'
import {View, Text, ScrollView} from 'react-native'
import * as Colors from "../utils/colors";
import commonStyles from "../utils/commonStyles";
import {SafeAreaView} from "react-navigation";
import InternetNotification from "./ui_components/InternetNotification";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import ScreenTitle from "./ui_components/ScreenTitle";
import GroupButtonsTitle from "./ui_components/GroupButtonsTitle";
import ProfileListBtn from "./ui_components/ProfileListBtn";
import FloatingLabelInput from "./ui_components/FloatingLabelInput";
import {Icon} from "react-native-elements";
import {connect} from 'react-redux'
import {getDoctorSpecializations} from "../utils/API";
import {setDoctorSpecializations} from "../actions/doctorSpecializations";



class CreateDoctor extends Component{

  constructor(props) {
    super(props);

    this.state = {
      formField: {
        firstName: '',
        lastName: '',
        specialization: '',
        jobLocation: '',
        cellPhone: '',
        addCellPhone: ''
      }
    }
  }


  static navigationOptions = ({navigation}) => {


    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}> Создать Доктора </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      }
    }
  };

  componentDidMount(){
    getDoctorSpecializations()
      .then(data => {
        console.log(data);
        this.props.dispatch(setDoctorSpecializations(data));
      })
  }

  componentWillReceiveProps(newProps){
    console.log(newProps);
  }





  handleFirstNameChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        firstName: newText,
      }
    })
  };

  handleLastNameChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        lastName: newText,
      }
    })
  };

  showItemsList = (param, screenTitle) => {



    this.props.navigation.navigate('ChoseDoctorSpecializations', {listType: param, screenTitle: screenTitle, prevData: this.props.chosenDoctorSpecializations});

  };



  render(){

    console.log(this.state);



    const {doctorSpecializations, chosenDoctorSpecializations} = this.props;

    // console.log(doctorSpecializations);
    console.log(chosenDoctorSpecializations);
    let chosenDoctorSpecializationsTitle = chosenDoctorSpecializations.map((item) => {
        return doctorSpecializations[item];

    });


    console.log(this.props);



    function getChosenTitleStr (specializations) {
      let chosenTitlesStr = '';

      if (specializations.length) {
        specializations.forEach((item) => {
          chosenTitlesStr = chosenTitlesStr + item + ', '
        });
        chosenTitlesStr = chosenTitlesStr.substr(0, chosenTitlesStr.length - 2);
      }
      return chosenTitlesStr;
    }




    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0}]}>
        <InternetNotification/>
        <KeyboardAwareScrollView>
          <ScrollView>

            <View>
              <GroupButtonsTitle title={'ОСНОВНЫЕ ДАННЫЕ'} paddingLeft={16}/>
              <FloatingLabelInput
                label="Имя, Отчество"
                value={this.state.formField.firstName}
                onChangeText={this.handleFirstNameChange}
              />
              <FloatingLabelInput
                label="Фамилия (обязательно)"
                value={this.state.formField.lastName}
                onChangeText={this.handleLastNameChange}
              />
              <View
                style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                <Text style={{
                  position: 'absolute',
                  left: 12,
                  top: 5,
                  fontSize: 14,
                  color: Colors.GRAY_TEXT,
                }}> {getChosenTitleStr(chosenDoctorSpecializationsTitle).length > 0 && 'Специализация (обязательно)'}</Text>
                <Text
                  onPress={() => {
                    this.showItemsList('doctorSpecializations', 'Специализации')
                  }}
                  style={!getChosenTitleStr(chosenDoctorSpecializationsTitle).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                    paddingTop: 26,
                    paddingBottom: 10,
                    fontSize: 16,
                    color: Colors.TYPOGRAPHY_COLOR_DARK
                  }]}>
                  {!getChosenTitleStr (chosenDoctorSpecializationsTitle).length ? 'Специализация (обязательно)' : getChosenTitleStr(chosenDoctorSpecializationsTitle)}
                </Text>
                <Icon
                  name='chevron-right'
                  type='evilicon'
                  color={Colors.GRAY_TEXT}
                  size={40}
                  containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                  onPress={() => {
                    this.showItemsList('doctorSpecializations', 'Специализации')
                  }}
                />
              </View>

              <GroupButtonsTitle title={'ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ'} paddingLeft={16}/>





            </View>


          </ScrollView>

        </KeyboardAwareScrollView>

      </SafeAreaView>
    )
  }
}


function mapStateToProps (state) {

  console.log(state);


  return {
    doctorSpecializations: state.doctors.doctorSpecializations,
    chosenDoctorSpecializations: state.doctors.chosenDoctorSpecializations,
  }
}

export default connect(mapStateToProps)(CreateDoctor)



