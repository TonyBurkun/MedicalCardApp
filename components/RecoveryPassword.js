import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput, Platform, TouchableOpacity, Alert, Image} from 'react-native'
import * as Colors from '../utils/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import validationChecker from '../utils/validationChecker'
import {sendPasswordResetEmail} from '../utils/API'
import commonStyles from '../utils/commonStyles'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const validationRules = {
  email: {required: true, isEmail: true}
};

export default class RecoveryPassword extends Component {
  constructor(props){
    super(props);

    this.state = {
      formField: {
        email: '',
      },
    };

  }


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
      sendPasswordResetEmail(email, actionCodeSettings, navigation);
    }
  };

  render() {
    const {email} = this.state.formField;

    const isEnabled = email.length > 0;
    return (
      <View style={commonStyles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={{flex: 1, justifyContent: 'flex-start'}}>

          <View style={[commonStyles.logoBigWrap, {marginTop: 60}]}>
            <Image
              style={commonStyles.logoSmallIMG}
              source={require('../assets/logo/heart.png')}/>
            <Text style={[commonStyles.screenTitle, {marginBottom: hp('4%'), marginTop: 16}]}>ВОССТАНОВЛЕНИЕ ПАРОЛЯ</Text>
          </View>
          <TextInput
            placeholder="Введите Ваш Email адрес"
            style={[commonStyles.formInput, {marginTop: hp('10%'), marginBottom: hp('8.5%')}]}
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
          {/*<TouchableOpacity*/}
          {/*style={[commonStyles.submitBtn, commonStyles.firstBtn]}*/}
          {/*onPress={this.handleSubmitBtn}*/}
          {/*>*/}
          {/*<Text style={commonStyles.submitBtnText}>Reset password</Text>*/}
          {/*</TouchableOpacity>*/}

            <TouchableOpacity
              disabled={!isEnabled}
              onPress={this.handleSubmitBtn}
              style={ isEnabled ? commonStyles.submitBtn : [commonStyles.submitBtn, commonStyles.disabledSubmitBtn ]}
            >
              <Text
                style={ isEnabled ? commonStyles.submitBtnText : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}
              >ВОССТАНОВИТЬ ПАРОЛЬ</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>

      </View>
    )

  }
}

const styles = StyleSheet.create({});
