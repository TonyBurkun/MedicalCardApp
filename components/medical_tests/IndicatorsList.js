import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, Switch, TouchableHighlight, ScrollView} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {Overlay} from "react-native-elements";
import * as Colors from '../../utils/colors'
import withNavigation from "react-navigation/src/views/withNavigation";
import {connect} from "react-redux";
import {SHOW_POPUP_BEFORE_ADD_INDICATORS} from "../../utils/textConstants";
import {SafeAreaView} from "react-navigation";
import commonStyles from "../../utils/commonStyles";
import InternetNotification from "../ui_components/InternetNotification";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import MedicalIndicatorForm from "../ui_components/InputField/MedicalIndicatorForm";
import {generateUniqID} from "../../utils/API";
import AddButton from "../ui_components/Buttons/AddButton";
import {showPopUpWarning} from "../../actions/tests";





class IndicatorsList extends Component {

  constructor(props) {
    super(props);

    // this._clearAsyncStorage();

    this.state = {
      showNormPopup: false,
      popupSwitch: false,
      name: '',
      surname: '',
      date: '',
      gender: '',
      chosenTestType: [],
      testTypesList: [],
      currentTestTypeObj: {},
      // indicatorsListForSave: [],
      localIndicatorsForSaveArr: [],
    }


  }


  _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log("found: " + key + "="+ value);
        return value;
      } else {
        console.log("Not found: " + key);
      }
    } catch (error) {
      console.log("Failure retrieving "+ key +" error: " + error)
    }
  };
  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("saved");
    } catch (error) {
      console.log("Failure saving: " + error);
    }
  };
  _clearAsyncStorage = async() => {
    await AsyncStorage.clear();
  };

  _getTestFieldsValue = (item = null, currentTestTypeID) => {

    console.log(currentTestTypeID);

    const {gender, date} = this.state;

    const splitDateArr = date.split('-');
    const MMDDYY = splitDateArr[1] + '-' + splitDateArr[0] + '-' + splitDateArr[2];

    const dateInMilliseconds = new Date(MMDDYY).getTime();
    const currentDateInMilliseconds = new Date().getTime();


    const ageInMilliseconds = currentDateInMilliseconds - dateInMilliseconds;
    const userAge = Math.round(ageInMilliseconds/1000/60/60/24);



    let testFormFields = {
      patternTypeID:  currentTestTypeID,
      patternIndicatorID: null,
      createdIndicatorID: null,
      inputFields: {
        title: '',
        unit: '',
        norma: '',
        result: '',
      },
      custom: !Boolean(currentTestTypeID),
      readyForSave: false

    };

    // if (this.state.chosenTestType.length) {
    //   testFormFields.patternTypeID = this.state.chosenTestType[0] !== 0 ? this.state.chosenTestType[0] : null;
    // }


   if (Boolean(item)) {
     testFormFields.patternIndicatorID = item.id;
     testFormFields.inputFields.title = item['indicator_title'];
     testFormFields.inputFields.unit = item['unit'];


     if (item['norma']['global'] && item['norma']['global'].length) {
       // if the test types has global value which identical for both male and female

       const globalNorma = item['norma']['global'][0].value;

       if (globalNorma.from === globalNorma.to) {
         testFormFields.inputFields.norma = globalNorma.to;
       } else {
         testFormFields.inputFields.norma = globalNorma.from + '-' + globalNorma.to
       }

     }

     if (!(item['norma']['global'] && item['norma']['global'].length)) {
       // if the test types doesn't include global value and need to find the value depends on male or female and age
       const valuesByGender = item['norma'][gender];
       if (Boolean(valuesByGender)) {
         valuesByGender.map(item => {

           if (item.from <= userAge &&  userAge <= item.to){

             if (item.value.from === item.value.to) {
               testFormFields.inputFields.norma = item.value.to
             }
             if (item.value.from !== item.value.to) {
               testFormFields.inputFields.norma = item.value.from + '-' + item.value.to
             }

           }
         })
       }

     }
   }

      return testFormFields
  };


  async componentDidMount(){
    console.log('DID MOUNT ');
    console.log(this.props);
    const {currentUserData, chosenTestType, testTypesList, indicatorsListForSave} = this.props;
    const currentTestTypeObj = testTypesList[chosenTestType[0]];
    const currentTestTypeID =  chosenTestType[0];
    let indicatorsForShowArr = [];
    let customIndicatorsForSave = [];
    let patternIndicatorsForSave = [];
    let patternIndicatorsForShowArr = [];
    let customIndicatorsForShowArr = [];

    console.log(indicatorsListForSave);





    await this.setState({
      ...this.state,
      name: currentUserData.name || '',
      surname: currentUserData.surname || '',
      date: currentUserData.date || '',
      gender: currentUserData.gender || '',
      chosenTestType,
      testTypesList,
      currentTestTypeObj,
      indicatorsListForSave,
    });

    if (currentTestTypeObj['indicators'] && currentTestTypeObj['indicators'].length) {
      currentTestTypeObj['indicators'].forEach((item, index) => {
        const currentTestFields = this._getTestFieldsValue(item, currentTestTypeID);
        indicatorsForShowArr.push(currentTestFields);
      })
    } else {
      // const currentTestFields = this._getTestFieldsValue(null, currentTestTypeID);
      // indicatorsForShowArr.push(currentTestFields);
      indicatorsForShowArr = [];
    }




    if (indicatorsListForSave && indicatorsListForSave.length) {

      customIndicatorsForSave = indicatorsListForSave.filter(item => {
        return item.custom === true;
      });

      patternIndicatorsForSave = indicatorsListForSave.filter(item => {
        return item.custom === false
      });

      if (patternIndicatorsForSave && patternIndicatorsForSave.length) {
        patternIndicatorsForSave.forEach((patternIndicatorItem) => {
          indicatorsForShowArr.forEach((indicatorForShowItem) => {
            if (patternIndicatorItem.patternIndicatorID === indicatorForShowItem.patternIndicatorID) {
              indicatorForShowItem.inputFields.result = patternIndicatorItem.inputFields.result;
              indicatorForShowItem.readyForSave = true;
            }
          })
        });
        patternIndicatorsForShowArr = indicatorsForShowArr;
      } else {
        patternIndicatorsForShowArr = indicatorsForShowArr;
      }

      if (customIndicatorsForSave && customIndicatorsForSave.length) {
        customIndicatorsForShowArr = customIndicatorsForSave;
      }


      console.log(patternIndicatorsForShowArr);
      console.log(customIndicatorsForShowArr);


      // indicatorsForShowArr = [];
      indicatorsForShowArr = [...patternIndicatorsForShowArr, ...customIndicatorsForShowArr];

    }

    if (indicatorsForShowArr.length === 0) {
      const currentTestFields = this._getTestFieldsValue(null, currentTestTypeID);
      indicatorsForShowArr.push(currentTestFields);
    }



    indicatorsForShowArr.sort((a, b) =>{
      let resultA = a.inputFields.result.toLowerCase();
      let resultB = b.inputFields.result.toLowerCase();

      if (resultB < resultA)
        return -1;
      if (resultB > resultA)
        return 1;
      return 0
    });

    await this.setState({
      ...this.state,
      indicatorsForShowArr
    });


    this._retrieveData(SHOW_POPUP_BEFORE_ADD_INDICATORS)
      .then(success => {

        if (Boolean(success)) {
          this.setState({
            ...this.state,
            showNormPopup: false
          })
        } else {
          this.setState({
            ...this.state,
            showNormPopup: true
          })
        }
      })
      .catch(error => {
        console.log('Error while getting data from AsyncStorage: ', error);
      })

  }

  handlePopupSubmit = async () => {

    const {popupSwitch, showNormPopup} = this.state;

    if (popupSwitch && showNormPopup) {
      await this._storeData(SHOW_POPUP_BEFORE_ADD_INDICATORS, 'false');
    }

    this.setState({
      ...this.state,
      showNormPopup: false
    });


  };



  handleIndicatorsListForSave =  async (value, index, action) => {
    // action should be null or true.
    // if the true - indicator will be removed
    const {indicatorsForShowArr} = this.state;
    // const {indicatorsListForSave} = this.props;

    let editedIndicatorsForShowArr = indicatorsForShowArr.map((item, itemIndex) => {
      if (index === itemIndex){
        item = value;
        item.readyForSave = Boolean(action);
      }
      return item
    });


    await this.setState({
      ...this.state,
      indicatorsForShowArr: editedIndicatorsForShowArr
    });





    const localIndicatorsForSaveArr = editedIndicatorsForShowArr.filter((item) => {
      return item.readyForSave
    });


    const notCompleteIndicators = editedIndicatorsForShowArr.filter((item, index) => {
      const itemInputFields = item.inputFields;
      let counter = 0;
      let inputsCount = 0;


      if (item.custom){
        const inputFilesKeys = Object.keys(itemInputFields);
        inputsCount = inputFilesKeys.length;
        for (const key in inputFilesKeys) {
          if (itemInputFields[inputFilesKeys[key]].length > 0) {
            counter = ++counter;
          }
        }

      }

      if (counter < inputsCount && counter !== 0) {
        return item
      }

    });

    if (notCompleteIndicators.length) {
      this.props.dispatch(showPopUpWarning(true));
    } else {
      this.props.dispatch(showPopUpWarning(false));
    }

    const {routeName} = this.props.navigation.state;
    this.props.navigation.navigate(routeName, {type: 'onlyAddItem', chosenItemsID: localIndicatorsForSaveArr})

  };



  handlePressAddButton = () => {
    const {indicatorsForShowArr} = this.state;
    const item = null;
    const currentTestTypeID = null;


    const currentTestFields = this._getTestFieldsValue(item, currentTestTypeID);
    indicatorsForShowArr.push(currentTestFields);

    this.setState({
      indicatorsForShowArr
    })
  };


  render() {

    console.log(this.state);
    console.log(this.props);

    const {
      name,
      surname,
      date,
      gender,
      currentTestTypeObj,
      indicatorsForShowArr
    } = this.state;

    console.log(currentTestTypeObj);




    let formedGender = '';
    if (gender === 'male') {
      formedGender = '(м)'
    }
    if (gender === 'female') {
      formedGender = '(ж)'
    }

    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0}]}>
        <InternetNotification topDimension={0}/>
        <Overlay
          isVisible={this.state.showNormPopup}
          overlayBackgroundColor={Colors.MAIN_BACKGROUND}
          overlayStyle={{borderRadius: 20, height: 'auto', paddingLeft: 0, paddingRight: 0, paddingBottom: 0}}
        >
          <View>
            <View style={{paddingLeft: 25, paddingRight: 25}}>
              <Text style={{
                fontSize: 17, fontWeight: 'bold', textAlign: 'center', color: Colors.BLACK_TITLE_BTN,
                marginTop: 10,
              }}>Показатели</Text>
              <Text style={{
                textAlign: 'center', fontSize: 13, color: Colors.TYPOGRAPHY_COLOR_DARK,
                marginTop: 8,
              }}>
                Поле “Норма” в показателях отображается согласно данных (дата рождения и пол) заполненных в  Медицинской Карте
              </Text>

            </View>
            <View style={{marginTop: 16}}>
              <Text style={{
                fontSize: 16,
                color: Colors.MAIN_GREEN,
                textAlign: 'center'
              }}>{`${name} ${surname} ${formedGender}`}</Text>
              <Text
                style={{ fontSize: 16, color: Colors.MAIN_GREEN, textAlign: 'center'}}
              >{date}</Text>
            </View>

            <View style={{
              marginTop: 16,
              backgroundColor: Colors.WHITE,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 16,
              paddingRight: 16,
              height: 44,
              alignItems: 'center'
            }}>
              <Text style={{fontSize: 13, color: Colors.TYPOGRAPHY_COLOR_DARK}}>Больше не показывать</Text>
              <Switch
                value={this.state.popupSwitch}
                onValueChange={() => {
                  this.setState({
                    ...this.state,
                    popupSwitch: !this.state.popupSwitch
                  })
                }}
              />
            </View>

            <TouchableHighlight
              style={{alignItems: 'center'}}
              underlayColor={'transparent'}
              onPress={this.handlePopupSubmit}>
              <Text style={{
                color: Colors.BLUE_BTN,
                fontSize: 17,
                marginTop: 12,
                marginBottom: 12
              }}>OK</Text>
            </TouchableHighlight>
          </View>
        </Overlay>
        <KeyboardAwareScrollView>
          <View style={commonStyles.containerIndents}>
            <Text style={{fontSize: 14, color: Colors.TYPOGRAPHY_COLOR_DARK, paddingTop: 16, paddingBottom: 16}}>
              Нормы (сверяйте результаты с нормальными показателями той лаборатории, которая проводила анализы, учитывая единицы измерения)
            </Text>
          </View>

         <View style={{paddingBottom: 80}}>
           {(Boolean(indicatorsForShowArr && indicatorsForShowArr.length)) && (
             indicatorsForShowArr.map((item, index) => {

               console.log(item);

               return (
                 <MedicalIndicatorForm
                   key={index}
                   index={index}
                   custom={item.custom}
                   title={item.inputFields.title}
                   unit={item.inputFields.unit}
                   norma={item.inputFields.norma.toString()}
                   result={item.inputFields.result}
                   patternTypeID={item.patternTypeID}
                   patternIndicatorID={item.patternIndicatorID}
                   createdIndicatorID={item.createdIndicatorID}
                   updateIndicatorsList={(value, index, action)=> this.handleIndicatorsListForSave(value, index, action)}
                 />
               )
             })
           )}
         </View>
        </KeyboardAwareScrollView>
        <AddButton handlePress={this.handlePressAddButton}/>
      </SafeAreaView>
    )
  }


}

function mapStateToProps(state) {
  console.log(state);

  return {
    currentUserData: state.authedUser.currentUserData,
    testTypesList: state.tests.testTypesList,
    chosenTestType: state.tests.chosenTestType,
    indicatorsListForSave: state.tests.indicatorsListForSave,
  }
}

export default withNavigation(connect(mapStateToProps)(IndicatorsList))

const styles = StyleSheet.create({});
