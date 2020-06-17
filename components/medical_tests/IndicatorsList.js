import React, {Component} from 'react'
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {Overlay} from "react-native-elements";
import * as Colors from '../../utils/colors'
import {connect} from "react-redux";
import {SHOW_POPUP_BEFORE_ADD_INDICATORS} from "../../utils/textConstants";
import commonStyles from "../../utils/commonStyles";
import InternetNotification from "../ui_components/InternetNotification";
import MedicalIndicatorForm from "../ui_components/InputField/MedicalIndicatorForm";
import {generateUniqID} from "../../utils/API";
import AddButton from "../ui_components/Buttons/AddButton";
import {setChosenIndicators} from "../../actions/tests";
import {convertObjToArr, convertObjToArr2, getTestTypeID} from "../../utils/helpers";
import {IndicatorForm} from '../../utils/dataPattern'
import {setTransferredIVF} from "../../actions/transferredIVF";
import { withNavigationFocus } from 'react-navigation';


class IndicatorsList extends Component {

  constructor(props) {
    super(props);

    // this._clearAsyncStorage();

    this.state = {
      showNormPopup: false,
      popupSwitch: false,
      showLoader: true,
      name: '',
      surname: '',
      date: '',
      gender: '',
      chosenTestType: [],
      testTypeID: '',
      // testTypesList: [],
      currentTestTypeObj: {},
      formedGender: '',
      // indicatorsListForSave: [],
      indicatorsForShowArr: [],
      localIndicatorsForSaveArr: [],
      // indicatorsPart: [],
      // page: 1,
      // step: 4,

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
  _updateIndicatorsListForSave = (indicatorsListForSave, indicatorsListForShow, savedIndicatorsList) => {

    for (let i = 0; i < savedIndicatorsList.length; i++) {
      let item = savedIndicatorsList[i];
      if (!item.custom) {
        let updatingIndicator = indicatorsListForShow[item.indicatorID];
        updatingIndicator.inputFields.result = item.inputFields.result;
        indicatorsListForSave[item.indicatorID] = item;
      } else {
        indicatorsListForShow.push(item);
        indicatorsListForSave[item.customIndicatorID] = item;
      }
    }


    return indicatorsListForSave;
  };



  componentDidMount(){
    console.log('DID MOUNT ');
    console.log(this.props);

     InteractionManager.runAfterInteractions(() => {
       console.log(this.state);
       console.log(this.props);

       const isEdit = Boolean(this.props.navigation.state.params.isEdit);
       console.log(isEdit);

       const {currentUserData, chosenTestType} = this.props;
       const formedTestTypesList = {...this.props.formedTestTypesList};
       let testTypeID = getTestTypeID(chosenTestType, formedTestTypesList);
       const {gender} = currentUserData;
       const formedTestTypesListArr = convertObjToArr(formedTestTypesList);

       const currentTestTypeObj = formedTestTypesListArr[chosenTestType[0]];
       let indicatorsListForShow = currentTestTypeObj.indicators;
       let {indicatorsListForSave} = this.props; // i guess i should be removed with all reference
       let {setIndicatorAfterSave} = this.props;

       if (currentTestTypeObj.id ===  "test_type_0") {
         indicatorsListForShow[0].customIndicatorID = generateUniqID();
       }

       if (setIndicatorAfterSave.length && currentTestTypeObj.id ===  "test_type_0") {
         indicatorsListForShow.splice(0,1);
       }


       let formedGender = '';
       if (gender === 'male') {
         formedGender = '(м)'
       }
       if (gender === 'female') {
         formedGender = '(ж)'
       }

       for (let i = 0; i < setIndicatorAfterSave.length; i++) {
         let item = setIndicatorAfterSave[i];
         if (!item.custom) {
           let updatingIndicator = indicatorsListForShow[item.indicatorID];
           updatingIndicator.inputFields.result = item.inputFields.result;
           indicatorsListForSave[item.indicatorID] = item;
         } else {
           indicatorsListForShow.push(item);
           indicatorsListForSave[item.customIndicatorID] = item;
         }
       }



       // if (isEdit) {
       //   const editedTestID = this.props.navigation.state.params.editedTestID;
       //   const editedTest = this.props.testsList[editedTestID];
       //   const editedTestFilledIndicatorsList = editedTest.indicators;
       //   console.log(editedTestFilledIndicatorsList);
       //   console.log(setIndicatorAfterSave);
       //
       //   for (let i = 0; i < editedTestFilledIndicatorsList.length; i++) {
       //     let item = editedTestFilledIndicatorsList[i];
       //     if (!item.custom) {
       //       let updatingIndicator = indicatorsListForShow[item.indicatorID];
       //       updatingIndicator.inputFields.result = item.inputFields.result;
       //       indicatorsListForSave[item.indicatorID] = item;
       //     } else {
       //       indicatorsListForShow.push(item);
       //       indicatorsListForSave[item.customIndicatorID] = item;
       //     }
       //   }
       // }


       this.props.dispatch(setChosenIndicators(indicatorsListForSave));


       this.setState({
         ...this.state,
         name: currentUserData.name || '',
         surname: currentUserData.surname || '',
         date: currentUserData.date || '',
         gender: currentUserData.gender || '',
         formedGender,
         chosenTestType,
         testTypeID,
         currentTestTypeObj,
         indicatorsForShowArr: indicatorsListForShow,
         showLoader: false
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

     });



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

  handleIndicatorsForShowArr = (indicatorsForShowArr) => {
    this.setState({
      ...this.state,
      indicatorsForShowArr
    })
  };

  renderHeader = () => {
    return (
      <View style={[commonStyles.containerIndents, {backgroundColor: Colors.MAIN_BACKGROUND}]}>
        <Text style={{
          fontSize: 14,
          color: Colors.TYPOGRAPHY_COLOR_DARK,
          paddingTop: 16, paddingBottom: 16
        }}>
          Нормы (сверяйте результаты с нормальными показателями той лаборатории, которая проводила анализы, учитывая единицы измерения)
        </Text>
      </View>
    )
  };

  renderIndicatorsList = ({item, index}) => {
    const {handleIndicatorsForShowArr} = this.state;
    return (
      <MedicalIndicatorForm
        // key={item.id}
        data={item}
        indicatorsForShowArr = {this.state.indicatorsForShowArr}
        handleIndicatorsForShowArr = {(handleIndicatorsForShowArr) => this.handleIndicatorsForShowArr(handleIndicatorsForShowArr)}
      />
    )
  };

  handlePressAddButton = () => {

    let {indicatorsForShowArr, testTypeID} = this.state;
    let indicatorFields = new IndicatorForm();
    indicatorFields.custom = true;
    indicatorFields.testTypeID = testTypeID;
    indicatorFields.customIndicatorID = generateUniqID();

    const _abilityToAddCustomIndicator = (indicatorsForShowArr) => {
      const lastIndicatorElement = indicatorsForShowArr[indicatorsForShowArr.length-1];

      if (lastIndicatorElement.custom){
          return !!(lastIndicatorElement.inputFields.result || lastIndicatorElement.inputFields.unit || lastIndicatorElement.inputFields.title || lastIndicatorElement.inputFields.norma);
      } else {
        return true;
      }
    };

    // let canAddNewIndicator = _abilityToAddCustomIndicator(indicatorsForShowArr);
    if (_abilityToAddCustomIndicator(indicatorsForShowArr)) {
      indicatorsForShowArr = [...indicatorsForShowArr, indicatorFields];
    }

    this.setState({
      indicatorsForShowArr,
    }, () => {
      setTimeout(() => {
        this.refs.indicatorsList.scrollToIndex({index: indicatorsForShowArr.length-1, animated: true});
      },400)


    });





  };


  render() {

    console.log(this.state);
    console.log(this.props);

    const {
      name,
      surname,
      date,
      formedGender,
      indicatorsForShowArr,
    } = this.state;

    return (
      <View style={{flex: 1, position: 'relative', backgroundColor: Colors.MAIN_BACKGROUND}}>
        {/*<KeyboardAvoidingView behavior='position' keyboardVerticalOffset={0} style={{flex: 1, paddingBottom: 34}}>*/}
        <InternetNotification topDimension={0}/>
        <Overlay
          isVisible={this.state.showLoader}
          width="auto"
          height="auto">
          <ActivityIndicator/>
        </Overlay>
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
            <View>
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
        {(Boolean(indicatorsForShowArr && indicatorsForShowArr.length) &&
          <FlatList
            ref='indicatorsList'
            extraData={this.state.indicatorsForShowArr}
            ListHeaderComponent={this.renderHeader}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.indicatorsForShowArr}
            renderItem={this.renderIndicatorsList}

            contentContainerStyle={{paddingBottom:100}}
            initialScrollIndex={0}
            getItemLayout={(data, index) => (
              {length: 176, offset: 176 * index, index}
            )}
          />
        )}

        {/*</KeyboardAvoidingView>*/}
        <AddButton handlePress={this.handlePressAddButton}/>
      </View>
    )
  }


}

function mapStateToProps(state) {
  console.log(state);

  return {
    currentUserData: state.authedUser.currentUserData,
    testTypesTitleList: state.tests.testTypesTitleList,
    formedTestTypesList: state.tests.formedTestTypesList,
    chosenTestType:  state.tests.chosenTestType,
    testsList: state.tests.testsList,

    indicatorsListForShow: state.tests.indicatorsListForShow,
    indicatorsListForSave: state.tests.indicatorsListForSave,
    setIndicatorAfterSave: state.tests.setIndicatorAfterSave,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(IndicatorsList))
// export default connect(mapStateToProps)(IndicatorsList)

const styles = StyleSheet.create({
});
