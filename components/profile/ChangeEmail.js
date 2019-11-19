import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper";
import * as Colors from "../../utils/colors";
import commonStyles from "../../utils/commonStyles";
import InternetNotification from "../ui_components/InternetNotification";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import validationChecker from "../../utils/validationChecker";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {sendPasswordResetEmail} from "../../utils/API";
import SubmitButton from "../ui_components/Buttons/SubmitButton";
import firebase from "react-native-firebase";

const validationRules = {
  email: {required: true, isEmail: true}
};

class ChangeEmail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      formField: {
        email: ''
      }
    }

  }

  static navigationOptions = ({navigation}) => {

    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Изменить Email</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 1,
        borderTopColor: Colors.TAB_NAVIGATION_BORDER,

      }
    }
  };

  handleSubmitBtn = () => {
    const currentState = this.state.formField;
    const {email} = currentState;
    const {navigation} = this.props;
    const isFormValid = validationChecker.validateForm(currentState, validationRules);
    this.forceUpdate();

    const actionCodeSettings = {
      iOS: ({
        bundleId: 'com.burkunantoncompany.medicalcard'
      })
    };

    if (isFormValid) {
      console.log('FORM VALID');
      firebase.auth().currentUser.updateEmail(this.state.formField.email)
        .then(success => {
          console.log(success);
        })
        .catch(error => {
          console.log(error);
        })
    }
  };


  render() {
    const {email} = this.state.formField;
    const isEnabled = email.length > 0;


    return (
      <SafeAreaView style={commonStyles.container}>
        <InternetNotification topDimension={0}/>
        <KeyboardAwareScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}>
        <View style={{marginTop: hp('10%'),}}>
          <TextInput
            placeholder="Введите Ваш Email адрес"
            style={[commonStyles.formInput]}
            value={email}
            onChangeText={(text) => {
              this.setState({
                formField:{
                  ...this.state.formField,
                  email: text.toLowerCase()
                }
              });
            }}
          />
          <Text>{validationChecker.getErrorsInField('email')}</Text>
        </View>

        <View>
          <SubmitButton isEnabled={isEnabled}  title={"СОХРАНИТЬ"}   handleSubmitForm={this.handleSubmitBtn}/>
        </View>
        </KeyboardAwareScrollView>

      </SafeAreaView>
    )
  }


}

export default ChangeEmail

const styles = StyleSheet.create({});
