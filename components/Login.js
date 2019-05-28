import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Button,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import * as Colors from '../utils/colors'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper'
import validationChecker from '../utils/validationChecker'
import {facebookLogin} from '../utils/facebook'
import {twitterLogin} from '../utils/twitter'
import {
  addUserTokenToAsyncStorage,
  signInWithEmailAndPassword,
  handleUserData,
  sentVerificationEmail,
  getUIDfromFireBase,
  isUserExistInDB,
  checkSetUpParamInUser,
  signOut,
  createUserbyIDinDB,
} from '../utils/API'
import {USER_TOKEN_LOCAL_STORAGE_KEY} from '../utils/textConstants'
import {ACCOUNT_NOT_FOUND, LOGIN_FAILED} from '../utils/systemMessages'
import commonStyles from '../utils/commonStyles'

import InternetNotification from '../components/ui_components/InternetNotification'

const validationRules = {
  email: {required: true, isEmail: true},
  password: {required: true},
};

const {height} = Dimensions.get('window');


class Login extends Component {

  constructor(props) {
    super(props);

    const statusBarHeight = getStatusBarHeight();
    const bottomSpace = getBottomSpace();

    this.state = {
      formField: {
        email: '',
        password: '',
      },
      isButtonDisabled: false,
      screenHeight: statusBarHeight + bottomSpace,
    };

  }

  static navigationOptions = {
    title: 'Login',
  };

  handleSubmitLogin = () => {
    let {navigation} = this.props;

    const currentState = this.state.formField;
    const {email, password} = currentState;
    const isFormValid = validationChecker.validateForm(currentState, validationRules);
    this.forceUpdate();

    console.log('LOGIN FORM IS VALID: ', isFormValid);

    if (isFormValid) {
      signInWithEmailAndPassword(email, password)
        .then(async (data) => {
          console.log('AUTH DATA: ', data);
          const isEmailVerified = data.user._user.emailVerified;
          const refreshToken = data.user._user.refreshToken;
          const uid = getUIDfromFireBase();


          if (isEmailVerified) {

            const userInDB = await isUserExistInDB();

            if (!userInDB) {
              createUserbyIDinDB();
            }


            const userTokenWasSaved = await addUserTokenToAsyncStorage(USER_TOKEN_LOCAL_STORAGE_KEY, 'true');

            console.log(userTokenWasSaved);
            if (userTokenWasSaved) {
              const setUpParam = await checkSetUpParamInUser();

              setUpParam ? navigation.navigate('App') : navigation.navigate('setUpOneProfile');
            }

          } else {
            signOut();
            this.setState({
              formField: {
                ...this.state.formField,
                password: ''
              }
            });
            Alert.alert(
              `Email Confirmation`,
              `We have sent email to ${email} to confirm the validity of our email address. Please follow the link provided to complete your registration.`,
              [
                {
                  text: 'Resend the confirmation mail', onPress: () => {
                    sentVerificationEmail()
                  }
                },
                {text: 'Ok'}
              ],
              {cancelable: false}
            );

            return false
          }
        })
        .catch(function (error) {
          // Handle Errors here.
          console.log(error);
          console.log(error.code);
          console.log(error.message);

          let errorCode = error.code;

          switch (errorCode) {
            case 'auth/user-not-found':
              Alert.alert(
                ACCOUNT_NOT_FOUND.title,
                ACCOUNT_NOT_FOUND.message,
                [
                  {text: ACCOUNT_NOT_FOUND.buttonText}
                ],
                {cancelable: false}
              );
              break;

            case 'auth/wrong-password':
              Alert.alert(
                LOGIN_FAILED.title,
                `${error.message}`,
                [
                  {text: LOGIN_FAILED.buttonText}
                ],
                {cancelable: false}
              );
              break;

            default:
              break;
          }
        });
    }

  };

  handleFacebookLogin = () => {

    facebookLogin()
      .then(async (data) => {
        const {navigation} = this.props;

        const userInDB = await isUserExistInDB();

        if (userInDB) {
          const userTokenWasSaved = await addUserTokenToAsyncStorage(USER_TOKEN_LOCAL_STORAGE_KEY, 'true');

          if (userTokenWasSaved) {
            const setUpParam = await checkSetUpParamInUser();
            setUpParam ? navigation.navigate('App') : navigation.navigate('setUpOneProfile');
          }

        } else {
          handleUserData(data);
          navigation.navigate('setUpOneProfile');
        }

      });

  };

  handleTwitterLogin = () => {
    twitterLogin()
      .then(async (data) => {
        const {navigation} = this.props;

        const userInDB = await isUserExistInDB();

        if (userInDB) {
          const userTokenWasSaved = await addUserTokenToAsyncStorage(USER_TOKEN_LOCAL_STORAGE_KEY, 'true');

          if (userTokenWasSaved) {
            const setUpParam = await checkSetUpParamInUser();
            setUpParam ? navigation.navigate('App') : navigation.navigate('setUpOneProfile');
          }

        } else {
          handleUserData(data);
          navigation.navigate('setUpOneProfile');
        }

      });
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      ...this.state,
      screenHeight: this.state.screenHeight + contentHeight
    })
  };


  render() {

    const scrollEnabled = this.state.screenHeight > height;
    const {email, password} = this.state.formField;

    const isEnabled = email.length > 0 && password.length > 0;

    return (
      <SafeAreaView style={commonStyles.container}>
        <InternetNotification/>
        <KeyboardAwareScrollView
          alwaysBounceVertical={false}
          contentContainerStyle={{flex: 1, justifyContent: 'space-between'}}
        >
          <ScrollView
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
          >
            <View>
              <View style={commonStyles.logoBigWrap}>
                <Image
                  style={commonStyles.logoBigIMG}
                  source={require('../assets/logo/heart.png')}/>
                <Text style={[commonStyles.screenTitle, {marginBottom: 63, marginTop: 16}]}>ВХОД</Text>
              </View>
              <TextInput
                placeholder="Ваш Email"
                style={commonStyles.formInput}
                value={email}
                onChangeText={(text) => {
                  this.setState({
                    formField: {
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
                style={[commonStyles.formInput, commonStyles.formInput__last]}
                value={password}
                onChangeText={(text) => {
                  this.setState({
                    formField: {
                      ...this.state.formField,
                      password: text
                    }
                  });
                }}
              />
              <Text>{validationChecker.getErrorsInField('password')}</Text>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Recovery')
                }}
                style={styles.forgotPass}
              >
                <Text style={styles.forgotPass__text}>Забыли пароль?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!isEnabled}
                onPress={this.handleSubmitLogin}
                style={isEnabled ? commonStyles.submitBtn : [commonStyles.submitBtn, commonStyles.disabledSubmitBtn]}
              >
                <Text
                  style={isEnabled ? commonStyles.submitBtnText : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}
                >ВОЙТИ</Text>
              </TouchableOpacity>

              <Text style={styles.separationText}>ИЛИ</Text>

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
            </View>
            <View
              style={[commonStyles.lineTextBtn, {...Platform.select({android: {marginBottom: 25}}), marginTop: 50}]}>
              <Text style={commonStyles.lineTextBtn__text}>Нет аккаунта? </Text>
              <TouchableOpacity
                onPress={() => {
                  validationChecker.destroy();
                  this.props.navigation.navigate('Register')
                }}
              >
                <Text style={commonStyles.lineTextBtn__textBtn}>Регистрация</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

export default Login;


const styles = StyleSheet.create({

  forgotPass: {
    width: '50%',
    marginTop: 20,
    marginBottom: 23,
  },

  forgotPass__text: {
    color: Colors.DARK_GREEN,
    fontSize: 16,
  },

  separationText: {
    color: Colors.GRAY_TEXT,
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: 43,
    marginBottom: 16,
    textAlign: 'center',
  },

  socialBtnBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  }


});
