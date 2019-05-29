import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Button,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import * as Colors from '../utils/colors'
import commonStyles from '../utils/commonStyles'
import {signOut, getUIDfromFireBase, readUserData, writeUserDataToDB, updateCurrentUserInDB, updateUserData, saveUserAvatarToStorage} from '../utils/API'
import validationChecker from '../utils/validationChecker'
import DatePicker from 'react-native-datepicker'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper'

import StepScreenTitle from './ui_components/StepScreenTitle'
import ScreenTitle from './ui_components/ScreenTitle'

import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import InternetNotification from '../components/ui_components/InternetNotification'




const validationRules = {
  userAvatar: {required: true},
  name: {required: true},
  surname: {required: false},
  date: {required: true},
  gender: {required: true, isRadioBtn: true}
};

const radio_props = [
  {label: 'Женский', value: 'female'},
  {label: 'Мужской', value: 'male'}
];

const {height} = Dimensions.get('window');

export default class StepOne extends Component {
  constructor(props) {
    super(props);

    const statusBarHeight = getStatusBarHeight();
    const bottomSpace = getBottomSpace();

    this.state = {
      avatarSource: '',
      avatarSelected: false,
      needToUploadAvatar: false,
      defaultAvatar: '../assets/photo.png',
      formField: {
        userAvatar: '',
        name: '',
        surname: '',
        date: '',
        gender: -1,
      },
      screenHeight: statusBarHeight + bottomSpace,


    }
  }

  componentDidMount(){
    let photoURL = firebase.auth().currentUser.providerData[0].photoURL;

    if (photoURL) {
      photoURL = photoURL + '?width=300&height=300';

      this.setState({
        avatarSelected: true,
        defaultAvatar: photoURL,
        formField:{
          ...this.state.formField,
          userAvatar: photoURL
        }
      });
    }
  }

  selectImage = () => {
    console.log('in select Image');

    ImagePicker.showImagePicker({noData: true, mediaType: 'photo'}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {


        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSelected: true,
          needToUploadAvatar: true,
          formField:{
            ...this.state.formField,
            userAvatar: response.uri,
          }
        });
      }
    });
  };


  // handleLogOut = () => {
  //   const {navigation} = this.props;
  //   signOut(navigation);
  // };

  handleSubmitForm = () => {
    let {navigation} = this.props;

    const currentState = this.state.formField;
    // const {email, password} = currentState;
    const isFormValid = validationChecker.validateForm(currentState, validationRules);
    this.forceUpdate();

    console.log('LOGIN FORM IS VALID: ', isFormValid);

    if (isFormValid) {

      //  TODO: update permission for the camera and gallery


      const formDataObj = {};
      formDataObj.name = this.state.formField.name;
      formDataObj.surname = this.state.formField.surname;
      formDataObj.date = this.state.formField.date;
      formDataObj.gender = this.state.formField.gender;

      const localUri = this.state.formField.userAvatar;

      if (this.state.needToUploadAvatar) {
        Promise.all([saveUserAvatarToStorage(localUri), updateUserData(formDataObj)])
          .then(success => {
            const imgData = success[0];
            const {downloadURL} = imgData;

            updateUserData({avatarURL: downloadURL});

          })
          .catch(error => {
            console.log('Upload user data and img to server was rejected with error: ', error);
          })
      } else {
        updateUserData(formDataObj);
      }

      updateUserData({setUpProfile: true});
      navigation.navigate('setUpTwoProfile');
    }

  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      ...this.state,
      screenHeight: this.state.screenHeight + contentHeight
    })
  };


  render() {

    const scrollEnabled = this.state.screenHeight > height;
    const {userAvatar, name, surname, date, gender} = this.state.formField;


    const isEnabled = userAvatar.length > 0 && name.length > 0 && date.length > 0 && gender !== -1;

    return (
      <SafeAreaView style={commonStyles.container}>
        <InternetNotification/>
        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          contentContainerStyle={{flexGrow: 1,justifyContent: 'space-between'}}
        >
          <View>
            <StepScreenTitle numberStep={1}/>
            <ScreenTitle titleText={'О СЕБЕ'}/>


            <View style={styles.uploadAvatarBlock}>
              <Text style={styles.uploadAvatarBlock__text}>
                Загрузить самую лучшую фотографию
              </Text>

              <TouchableOpacity
                onPress={this.selectImage}
                style={{flexDirection: 'row', justifyContent: 'flex-end', borderRadius: 40}}
              >
                {this.state.avatarSelected ?
                  <Image
                    style={styles.uploadImage}
                    resizeMode='cover'
                    source={{uri: userAvatar}}
                  />
                  :
                  <Image
                    style={styles.uploadImage}
                    resizeMode='cover'
                    source={require('../assets/photo.png')}
                  />

                }
              </TouchableOpacity>


            </View>

            <Text>{validationChecker.getErrorsInField('userAvatar')}</Text>
            <View style={styles.formGroup}>
              <TextInput
                placeholder="Имя (обязательное поле)"
                placeholderTextColor={Colors.GRAY_TEXT}
                style={commonStyles.formInput}
                value={name}
                onChangeText={(text) => {
                  this.setState({
                    formField: {
                      ...this.state.formField,
                      name: text
                    }
                  });
                }}
              />
              <Text>{validationChecker.getErrorsInField('name')}</Text>
              <TextInput
                placeholder="Фамилия"
                placeholderTextColor={Colors.GRAY_TEXT}
                style={commonStyles.formInput}
                value={surname}
                onChangeText={(text) => {
                  this.setState({
                    formField: {
                      ...this.state.formField,
                      surname: text
                    }
                  });
                }}
              />
              <Text>{validationChecker.getErrorsInField('surname')}</Text>

              <DatePicker
                style={commonStyles.datePicker}
                date={date} //initial date from state
                // mode="date" //The enum of date, datetime and time
                placeholder="Дата рождения (обязательное поле)"
                format="DD-MM-YYYY"
                minDate="01-01-1930"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconSource={require('../assets/datepicker-icon.png')}
                customStyles={{
                  dateIcon: {

                    // display: 'none',
                    position: 'absolute',
                    width: 14,
                    height: 16,
                    right: 16,
                    top: '50%',
                    // marginTop: -2,

                  },
                  dateInput: {
                    alignItems: 'flex-start',
                    paddingLeft: 16,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: Colors.BORDER_COLOR,
                    backgroundColor: Colors.WHITE,
                    height: 55.5,
                    marginTop: 14,
                  },
                  dateText: {
                    fontSize: 16,
                    color: Colors.BLACK_TITLE,
                  },
                  placeholderText: {
                    fontSize: 16,
                    color: Colors.GRAY_TEXT
                  },

                }}
                onDateChange={(value) => {
                  this.setState({
                    formField: {
                      ...this.state.formField,
                      date: value
                    }
                  })
                }}
              />
              <Text>{validationChecker.getErrorsInField('date')}</Text>

              <View style={styles.radioButtons}>
                <Text style={styles.radioButtons__title}>Пол: </Text>
                <RadioForm
                  initial={-1}
                  radio_props={radio_props}
                  buttonColor={Colors.GRAY_TEXT}
                  labelColor={Colors.GRAY_TEXT}
                  selectedButtonColor={Colors.MAIN_GREEN}
                  selectedLabelColor={Colors.MAIN_GREEN}
                  labelStyle={{fontSize: 16, marginLeft: '6%'}}
                  formHorizontal={true}
                  buttonSize={10}
                  buttonOuterSize={20}
                  onPress={(value) => {
                    this.setState({
                      formField: {
                        ...this.state.formField,
                        gender: value
                      }
                    })
                  }}
                />
              </View>
              <Text>{validationChecker.getErrorsInField('gender')}</Text>

            </View>
          </View>
          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            {/*<TouchableOpacity*/}
            {/*  onPress={this.handleLogOut}*/}
            {/*  style={[commonStyles.submitBtn, commonStyles.firstBtn]}*/}
            {/*>*/}
            {/*  <Text style={commonStyles.submitBtnText}>Log Out</Text>*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity
              onPress={this.handleSubmitForm}
              style={ isEnabled
                ? [commonStyles.submitBtn, commonStyles.firstBtn]
                : [commonStyles.submitBtn, commonStyles.firstBtn, commonStyles.disabledSubmitBtn ]}
              disabled={!isEnabled}
            >
              <Text style={ isEnabled
                ? commonStyles.submitBtnText
                : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}>СОХРАНИТЬ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }

}


const styles = StyleSheet.create({

  formGroup: {
    marginTop: 30
  },

  uploadAvatarBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
    // borderWidth: 2,
    // borderColor: 'red',
  },

  uploadAvatarBlock__text: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    marginRight: 20,
    color: Colors.GRAY_TEXT,
    // borderWidth: 2,
    // borderColor: 'red',
  },

  uploadAvatarBlock__imageBtn: {},

  uploadImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // borderWidth: 2,
    // borderColor: 'red',

  },

  radioButtons: {
    flexDirection: 'row',
    fontSize: 16,
    color: Colors.GRAY_TEXT,
    paddingLeft: 17,
    marginTop: 34,
  },

  radioButtons__title: {
    alignSelf: 'center',
    color: Colors.GRAY_TEXT,
    fontSize: 16,
    marginRight: '4%',
    marginTop: -5

  },


});
