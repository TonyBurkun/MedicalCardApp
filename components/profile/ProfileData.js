import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native'
import {Image, Overlay} from 'react-native-elements'
import {connect} from 'react-redux'
import * as Colors from "../../utils/colors";
import {SafeAreaView} from "react-navigation";
import GroupButtonsTitle from '../ui_components/titles/GroupButtonsTitle';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import commonStyles from "../../utils/commonStyles";
import validationChecker from "../../utils/validationChecker";
import DatePicker from "react-native-datepicker";
import RadioButtons from "../ui_components/Buttons/RadioButtons";
import SelectList from "../ui_components/SelectList";
import {getMetricsByTitle, saveUserAvatarToStorage, updateUserData} from "../../utils/API";
import SubmitButton from "../ui_components/Buttons/SubmitButton";
import ImagePicker from "react-native-image-picker";
import {updateUserDataFields} from "../../utils/helpers";
import {updateCurrentUserData} from "../../actions/authedUser";



const validationRules = {
  avatarURL: {required: true},
  name: {required: true},
  surname: {required: false},
  date: {required: true},
  gender: {required: true, isRadioBtn: true}
};

const radio_props = [
  {text: 'Женский', key: 'female'},
  {text: 'Мужской', key: 'male'}
];


class ProfileData extends Component {

  constructor(props) {
    super(props);
    const {currentUserData} = this.props;
    console.log(currentUserData);


    this.state = {
      bloodTypes: [
        {
          value: '1+',
          selected: false

        },
        {
          value: '1-',
          selected: false

        },
        {
          value: '2+',
          selected: false

        },
        {
          value: '2-',
          selected: false

        },
        {
          value: '3+',
          selected: false

        },
        {
          value: '3-',
          selected: false

        },
        {
          value: '4+',
          selected: false

        },
        {
          value: '4-',
          selected: false

        }

      ],
      weightOptions: [],
      heightOptions: [],
      needUploadImage: false,
      showLoader: false,

      formField: {
        avatarURL: currentUserData.avatarURL,
        name: currentUserData.name,
        surname: currentUserData.surname || '',
        date: currentUserData.date || '',
        gender: currentUserData.gender || '',

        bloodType: currentUserData.bloodType,
        weight: currentUserData.weight || '',
        height: currentUserData.height || '',
      },
    };

    const chosenBloodType = currentUserData.bloodType;
    let bloodTypesArr = this.state.bloodTypes;




    bloodTypesArr.forEach((item, index) => {
      if (item.value && item.value === chosenBloodType) {
        bloodTypesArr[index].selected = true;
      }
    });







  }

 static navigationOptions = ({navigation}) => {
   const userName = navigation.state.params.username;
    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>{userName}</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 1,
        borderTopColor: Colors.TAB_NAVIGATION_BORDER,

      },
    }
 };

  componentDidMount(){


    getMetricsByTitle('weight')
      .then(result => {
        this.setState({
          weightOptions: result
        })
      });

    getMetricsByTitle('height')
      .then(result => {
        this.setState({
          heightOptions: result
        })
      });
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
          needUploadImage: true,
          formField:{
            ...this.state.formField,
            avatarURL: response.uri,
          }
        });
      }
    });
  };


  updateRadioBtnState = (key) => {
    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        gender: key
      }
    })
  };

  handleBloodTypeChoice(index) {

    const clickedBtnIndex = index;

    let bloodTypesArr = this.state.bloodTypes;
    const bloodTypesActiveVal = bloodTypesArr[clickedBtnIndex].value;

    bloodTypesArr.forEach((currentVal) => {
      currentVal.selected = false;
    });

    bloodTypesArr[clickedBtnIndex].selected = true;


    this.setState({
      ...this.state,
      ...this.state.bloodTypes.bloodTypesArr,
      formField: {
        ...this.state.formField,
        bloodType: bloodTypesActiveVal

      }
    })

  }

  handleSelectValue = (selectValInState, selectValue) => {
    this.setState({
      formField: {
        ...this.state.formField,
        [selectValInState]: selectValue
      }

    })
  };


  handleSubmitForm = () => {
    console.log('SUBMIT PROFILE DATA');

    const currentState = this.state.formField;

    const isFormValid = validationChecker.validateForm(currentState, validationRules);
    this.forceUpdate();

    if (isFormValid) {
      const {needUploadImage} = this.state;

      if (needUploadImage) {
        const {avatarURL} = this.state.formField;
        this.setState({
          showLoader: true
        });

        saveUserAvatarToStorage(avatarURL)
          .then(success => {
            this.setState({
              ...this.state,
              showLoader: false,
              formField:{
                ...this.state.formField,
                avatarURL: success.downloadURL,
              }

            });
            const {currentUserData} = this.props;
            const {formField} = this.state;
            updateUserData(formField);
            const updatedUserData = updateUserDataFields(formField, currentUserData);
            this.props.dispatch(updateCurrentUserData(updatedUserData));
            this.props.navigation.goBack();

          })
          .catch(error => {
            console.log('The error occur while image uploading process with the: ', error);
          })
      } else {
        const {currentUserData} = this.props;
        const {formField} = this.state;
        updateUserData(formField);
        const updatedUserData = updateUserDataFields(formField, currentUserData);
        this.props.dispatch(updateCurrentUserData(updatedUserData));
        this.props.navigation.goBack();
      }


    }
  };

  render() {
    const {name, surname, date, avatarURL, gender, height, weight} = this.state.formField;
    const {weightOptions, heightOptions} = this.state;

    let weightValueIndex = weightOptions.indexOf(weight);
    let heightValueIndex = heightOptions.indexOf(height);


    let initWeightValueIndex = ~weightValueIndex || 80;
    let initHeightValueIndex =  ~heightValueIndex || 150;

    const isEnabled = avatarURL.length > 0 && name.length > 0 && date.length > 0 && gender !== -1;

    return (
      <SafeAreaView style={styles.container}>
        <Overlay
          isVisible={this.state.showLoader}
          width="auto"
          height="auto">
          <ActivityIndicator/>
        </Overlay>
        <KeyboardAwareScrollView>
          <GroupButtonsTitle title={'ОБЯЗАТЕЛЬНЫЕ ДАННЫЕ'} topMargin={16} paddingLeft={16}/>

          <View style={[styles.blockBody]}>
            <TouchableOpacity
              onPress={this.selectImage}
              style={{alignSelf: 'center', marginTop: 16, marginBottom: 16}}
            >
              {Boolean(avatarURL.length) ?
                <Image
                  style={styles.avatar}
                  resizeMode='cover'
                  source={{uri: avatarURL + '?width=100&height=100'}}
                  PlaceholderContent={<ActivityIndicator />}
                />
                :
                <Image
                  style={styles.avatar}
                  resizeMode='cover'
                  source={require('../../assets/photo.png')}
                  PlaceholderContent={<ActivityIndicator />}
                />

              }
            </TouchableOpacity>
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
                iconSource={require('../../assets/datepicker-icon.png')}
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
              
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
              <Text style={{color: Colors.GRAY_TEXT, fontSize: 16, alignSelf: 'center'}}>Пол:</Text>
              <RadioButtons options={radio_props} updateRadioBtnState={this.updateRadioBtnState} defaultValue={gender}/>
              <Text>{validationChecker.getErrorsInField('gender')}</Text>
            </View>

            </View>
          </View>

          <GroupButtonsTitle title={'ОБЩАЯ ИНФОРМАЦИЯ'} topMargin={24} paddingLeft={16}/>
          <View style={[styles.blockBody]}>
            <Text style={styles.bloodTypeBlock__title}>Группа крови</Text>
            <View style={styles.bloodTypeBlock}>
              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(0)}}
                style={!this.state.bloodTypes[0].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[0].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[0].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(1)}}
                style={!this.state.bloodTypes[1].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[1].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[1].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(2)}}
                style={!this.state.bloodTypes[2].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[2].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[2].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(3)}}
                style={!this.state.bloodTypes[3].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[3].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[3].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(4)}}
                style={!this.state.bloodTypes[4].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[4].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[4].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(5)}}
                style={!this.state.bloodTypes[5].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[5].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[5].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(6)}}
                style={!this.state.bloodTypes[6].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[6].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[6].value}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {this.handleBloodTypeChoice(7)}}
                style={!this.state.bloodTypes[7].selected
                  ? styles.bloodTypeBtn
                  : [styles.bloodTypeBtn, styles.bloodTypeBtnActive]}
              >
                <Text style={!this.state.bloodTypes[7].selected
                  ? styles.bloodTypeBtn__text
                  : [styles.bloodTypeBtn__text, styles.bloodTypeBtn__textActive]}>{this.state.bloodTypes[7].value}</Text>
              </TouchableOpacity>

            </View>

              <View style={{marginBottom: 16}}>
                <SelectList updateSelectVal={this.handleSelectValue}
                            selectVal={'weight'} selectTitle={'Вес'}
                            options={weightOptions} initValIndex={initWeightValueIndex}
                            defaultVal={weight}
                />
              </View>
              <View>
                <SelectList updateSelectVal={this.handleSelectValue}
                            selectVal={'height'} selectTitle={'Рост'}
                            options={heightOptions} initValIndex={initHeightValueIndex}
                            defaultVal={height}
                />
              </View>

          </View>


        <View style={[commonStyles.containerIndents, {paddingBottom: 22}]}>
          <SubmitButton handleSubmitForm={this.handleSubmitForm} isEnabled={isEnabled}/>
        </View>
        </KeyboardAwareScrollView>


      </SafeAreaView>
    )
  }


}

function mapStateToProps (state) {
  console.log(state);
  const {currentUserUID, currentUserData} = state.authedUser;
  const {avatarURL} = currentUserData;

  return {
    currentUserPhotoURL: avatarURL || '',
    currentUserData: currentUserData,
  }
}

export default connect(mapStateToProps)(ProfileData)

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.MAIN_BACKGROUND,
    flex: 1,
  },
  blockBody: {
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 26,

    shadowColor: Colors.BLACK_TITLE,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },

  // radioButtons: {
  //   flexDirection: 'row',
  //   fontSize: 16,
  //   color: Colors.GRAY_TEXT,
  //   paddingLeft: 17,
  //   marginTop: 34,
  // },
  //
  // radioButtons__title: {
  //   alignSelf: 'center',
  //   color: Colors.GRAY_TEXT,
  //   fontSize: 16,
  //   marginRight: '4%',
  //   marginTop: -5
  //
  // },


  bloodTypeBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginLeft: -9,
    marginRight: -9,
    marginBottom: 40
  },

  bloodTypeBlock__title: {
    marginTop: 24,
    fontSize:16,
    color: Colors.GRAY_TEXT
  },

  bloodTypeBtn: {
    marginTop: 16,
    width: 64,
    height: 64,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.GRAY_TEXT,
    borderRadius: 32,
    justifyContent: 'center',
    marginLeft: 9,
    marginRight: 9,


    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // shadowColor: Colors.BLACK_TITLE,
    // shadowOffset: { height: 0, width: 0 },
  },

  bloodTypeBtn__text: {
    color: Colors.GRAY_TEXT,
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  bloodTypeBtnActive: {
    backgroundColor: Colors.LIGHT_CARMINE_PINK,
    borderColor: 'transparent'
  },

  bloodTypeBtn__textActive:{
    color: Colors.WHITE
  },


});
