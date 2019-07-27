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

  handleFirstNameChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        firstName: newText,
      }

    })
  };


  static navigationOptions = ({navigation}) => {


    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}> Создать доктора </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      }
    }
  };


  render(){

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

              <GroupButtonsTitle title={'ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ'} paddingLeft={16}/>
            </View>


          </ScrollView>

        </KeyboardAwareScrollView>

      </SafeAreaView>
    )
  }
}

export default CreateDoctor
