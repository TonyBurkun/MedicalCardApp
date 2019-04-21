import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import * as Colors from '../utils/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import validationChecker from '../utils/validationChecker'
import {registrationWithEmailAndPassword} from '../utils/API'
import commonStyles from '../utils/commonStyles'




const validationRules = {
  firstName: {required: false,},
  secondName: {required: false},
  email: {required: true, isEmail: true},
  password: {required: true, duplicate: 'confirmPassword', minLength: 6, maxLength: 20},
  confirmPassword: {required: true, duplicate: 'password', minLength: 6, maxLength: 20}
};

const {height} = Dimensions.get('window');

class Registration extends Component {
  constructor(props){
    super(props);

    this.state = {
      formField: {
        email: '',
        password: '',
        confirmPassword: '',
      },
      screenHeight: 0,
    };

  }

  static navigationOptions = {
    title: 'Registration',
  };

  handleSubmitRegistration = () => {
    const currentState = this.state.formField;
    const {email, password} = currentState;
    let {navigation} = this.props;
    const isFormValid = validationChecker.validateForm(currentState, validationRules);
    this.forceUpdate();

    console.log('REGISTER FORM IS VALID: ', isFormValid);


    if (isFormValid) {
      registrationWithEmailAndPassword(email, password, navigation);
    }

  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      screenHeight: contentHeight
    })
  };



  render() {

    const scrollEnabled = this.state.screenHeight > height;
    const {email, password, confirmPassword} = this.state.formField;
    const isEnabled = email.length > 0 && password.length > 0 && confirmPassword.length >0;

    return (
      <SafeAreaView style={commonStyles.container}>

        <KeyboardAwareScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{flex: 1, justifyContent: 'center'}}>

          <ScrollView
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
            contentContainerStyle={{flexGrow: 1,justifyContent: 'space-between'}}
          >
            <View>

              <View style={commonStyles.logoBigWrap}>
                <Image
                  style={commonStyles.logoBigIMG}
                  source={require('../assets/logo/heart.png')}/>
                <Text style={[commonStyles.screenTitle, {marginBottom: 36, marginTop: 16}]}>РЕГИСТРАЦИЯ</Text>
                <Text style={commonStyles.subTitle}>Зарегистрироваться через Email адрес</Text>
              </View>


              <TextInput
                placeholder="Ваш Email"
                style={commonStyles.formInput}
                value={this.state.email}
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
              <TextInput
                placeholder="Пароль"
                secureTextEntry={true}
                style={commonStyles.formInput}
                value={this.state.password}
                onChangeText={(text) => {
                  this.setState({
                    formField:{
                      ...this.state.formField,
                      password: text
                    }
                  });
                }}
              />
              <Text>{validationChecker.getErrorsInField('password')}</Text>
              <TextInput
                placeholder="Подтверждение пароля"
                secureTextEntry={true}
                style={[commonStyles.formInput, commonStyles.formInput__last]}
                value={this.state.confirmPassword}
                onChangeText={(text) => {
                  this.setState({
                    formField:{
                      ...this.state.formField,
                      confirmPassword: text
                    }
                  });
                }}
              />
              <Text>{validationChecker.getErrorsInField('confirmPassword')}</Text>

              <TouchableOpacity
                disabled={!isEnabled}
                onPress={this.handleSubmitRegistration}
                style={ isEnabled ? commonStyles.submitBtn : [commonStyles.submitBtn, commonStyles.disabledSubmitBtn ]}
              >
                <Text
                  style={ isEnabled ? commonStyles.submitBtnText : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}
                >ЗАРЕГИСТРИРОВАТЬСЯ</Text>
              </TouchableOpacity>

              <Text style={[commonStyles.subTitle, {marginTop: 40}]}>Или присоединиться через социальную сеть:</Text>

              <View style={[commonStyles.socialBtnBlock]}>
                <TouchableOpacity
                  onPress={this.handleFacebookLogin}
                  style={[commonStyles.submitBtn, commonStyles.facebookBtn]}
                >
                  <Text style={[commonStyles.submitBtnText, commonStyles.facebookBtn__Text]}>FaceBook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.handleTwitterLogin}
                  style={[commonStyles.submitBtn, commonStyles.twitterBtn]}
                >
                  <Text style={[commonStyles.submitBtnText, commonStyles.twitterBtn__Text]}>Twitter</Text>
                </TouchableOpacity>
              </View>

              {/*<Text style={styles.termsText}>*/}
              {/*<Text>*/}
              {/*By registering you agree to our*/}
              {/*</Text>*/}
              {/*<Text*/}
              {/*onPress={() => Linking.openURL('http://google.com')}*/}
              {/*style={{color: 'blue'}}> Terms.</Text>*/}
              {/*</Text>*/}
            </View>

            <View style={[commonStyles.lineTextBtn, {...Platform.select({android: {marginBottom: 25}}), marginTop: 50}]}>
              <Text style={commonStyles.lineTextBtn__text}>Есть аккаунт? </Text>
              <TouchableOpacity
                onPress={() => {
                  validationChecker.destroy();
                  this.props.navigation.navigate('Login')
                }}
              >
                <Text style={commonStyles.lineTextBtn__textBtn}>Вход</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </KeyboardAwareScrollView>

      </SafeAreaView>
    );
  }
}

export default Registration;

const styles = StyleSheet.create({

  termsText: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  }

});
