import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, Switch, TouchableHighlight, ScrollView, ActivityIndicator, FlatList, KeyboardAvoidingView} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {Overlay} from "react-native-elements";
import * as Colors from '../../utils/colors'
import {connect} from "react-redux";
import {SHOW_POPUP_BEFORE_ADD_INDICATORS} from "../../utils/textConstants";
import {SafeAreaView} from "react-navigation";
import commonStyles from "../../utils/commonStyles";
import InternetNotification from "../ui_components/InternetNotification";
import {KeyboardAwareFlatList, KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import MedicalIndicatorForm from "../ui_components/InputField/MedicalIndicatorForm";
import {generateUniqID} from "../../utils/API";
import AddButton from "../ui_components/Buttons/AddButton";
import {setChosenIndicators, showPopUpWarning} from "../../actions/tests";
import {convertObjToArr, getIndicatorsArrForShow, sortArrByObjectProp} from "../../utils/helpers";
import HeaderAddBtn from "../ui_components/TopNavigation/HeaderAddBtn";
import {IndicatorForm} from '../../utils/dataPattern'
import { InteractionManager } from 'react-native';








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
      // testTypesList: [],
      currentTestTypeObj: {},
      formedGender: '',
      // indicatorsListForSave: [],
      indicatorsForShowArr: [],
      localIndicatorsForSaveArr: [],
      indicatorsPart: [],
      page: 1,
      step: 4
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



   componentDidMount(){
    console.log('DID MOUNT ');
    console.log(this.props);


     InteractionManager.runAfterInteractions(() => {
       console.log(this.state);
       console.log(this.props);


       const {currentUserData, testTypesTitleList, formedTestTypesList, chosenTestType} = this.props;
       const {gender} = currentUserData;
       const formedTestTypesListArr = convertObjToArr(formedTestTypesList);
       const {step} = this.state;
       console.log(formedTestTypesListArr);

       const currentTestTypeObj = formedTestTypesListArr[chosenTestType[0]];
       let indicatorsListForShow = currentTestTypeObj.indicators;

       let formedGender = '';
       if (gender === 'male') {
         formedGender = '(м)'
       }
       if (gender === 'female') {
         formedGender = '(ж)'
       }






       // let {currentUserData, chosenTestType, testTypesList} = this.props;
       // let {indicatorsListForSave} = this.props; // i guess i should be removed with all reference
       // let {setIndicatorAfterSave} = this.props;
       // let indicatorsListForShow = JSON.parse(JSON.stringify(this.props.indicatorsListForShow));
       // let indicatorsListForShow = testTypesList[chosenTestType.id].indicators;


       // console.log(indicatorsListForSave);
       // console.log(indicatorsListForShow);
       // console.log(setIndicatorAfterSave);
       //
       // for (let i = 0; i < setIndicatorAfterSave.length; i++) {
       //   let item = setIndicatorAfterSave[i];
       //   console.log(item);
       //   if (!item.custom) {
       //     let updatingIndicator = indicatorsListForShow[item.indicatorID];
       //     updatingIndicator.inputFields.result = item.inputFields.result;
       //   } else {
       //     indicatorsListForShow.push(item)
       //   }
       //
       //
       //   if (item.custom) {
       //     indicatorsListForSave[item.customIndicatorID] = item;
       //   } else {
       //     indicatorsListForSave[item.indicatorID] = item;
       //   }
       //
       //   this.props.dispatch(setChosenIndicators(indicatorsListForSave));
       //
       //
       //
       // }
       //
       // console.log(indicatorsListForSave);
       // console.log(indicatorsListForShow);
       // console.log(setIndicatorAfterSave);



       // testTypesList = convertObjToArr(testTypesList);
       // testTypesList = sortArrByObjectProp(testTypesList, 'id');
       //
       // console.log(testTypesList);
       // console.log(chosenTestType);
       // const currentTestTypeObj = testTypesList[chosenTestType.index];
       //
       //
       // console.log(currentTestTypeObj);
       //

       let indicatorsPart = indicatorsListForShow.slice(0, step);
       console.log(indicatorsPart);
       this.setState({
         ...this.state,
         name: currentUserData.name || '',
         surname: currentUserData.surname || '',
         date: currentUserData.date || '',
         gender: currentUserData.gender || '',
         formedGender,
         chosenTestType,
         // testTypesList,
         currentTestTypeObj,
         // indicatorsListForSave,
         indicatorsForShowArr: indicatorsListForShow,
         indicatorsPart: indicatorsPart,
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

  handleIndicatorsListForSave =  async (value, index, action) => {

    console.log(value);
    console.log(action);
    console.log(index);
    // action should be null or true.
    // if the true - indicator will be removed
    const {indicatorsPart} = this.state;
    // const {indicatorsListForSave} = this.props;
    console.log(indicatorsPart);

    let editedIndicatorsForShowArr = indicatorsPart.map((item, itemIndex) => {
      if (index === itemIndex){
        item = value;
        item.readyForSave = Boolean(action);
      }
      return item
    });

    console.log(editedIndicatorsForShowArr);


    await this.setState({
      ...this.state,
      indicatorsPart: editedIndicatorsForShowArr
    });





    const localIndicatorsForSaveArr = editedIndicatorsForShowArr.filter((item) => {
      return item.readyForSave
    });

    console.log(localIndicatorsForSaveArr);


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
    console.log('HEre');
    console.log(item);
    return (
      <MedicalIndicatorForm
        // key={item.id}
        data={item}
        // custom={item.custom}
        // title={item.inputFields.title}
        // unit={item.inputFields.unit}
        // norma={item.inputFields.norma.toString()}
        // result={item.inputFields.result}
        // patternTypeIndex={item.patternTypeIndex}
        // patternIndicatorID={item.patternIndicatorID}
        // createdIndicatorID={item.createdIndicatorID}
        // updateIndicatorsList={(value, index, action)=> this.handleIndicatorsListForSave(value, index, action)}
      />
    )
  };

  handleLoadMore = () => {
    let {page, step, indicatorsPart} = this.state;
    let {indicatorsForShowArr} = this.state;
    let start = page * step;
    page = page + 1;

    let end = page * step;


    if (start < indicatorsForShowArr.length) {
      let nextIndicatorsPart = indicatorsForShowArr.slice(start, end);
      indicatorsPart = [...indicatorsPart, ...nextIndicatorsPart];
      this.setState({
        ...this.state,
        indicatorsPart,
        page,
      })
    }

  };


  handlePressAddButton = () => {
    let {indicatorsForShowArr, indicatorsPart} = this.state;
    const currentTestTypeID = this.props.chosenTestType.id;
    let indicatorFields = new IndicatorForm();
    indicatorFields.custom = true;
    indicatorFields.testTypeID = currentTestTypeID;
    indicatorFields.customIndicatorID = generateUniqID();


    if (indicatorsForShowArr.length === indicatorsPart.length) {
      indicatorsPart = [...indicatorsPart, indicatorFields]
    } else {
      indicatorsForShowArr = [...indicatorsForShowArr, indicatorFields];
    }

    this.setState({
      indicatorsForShowArr,
      indicatorsPart,
    })
  };


  render() {

    console.log(this.state);
    console.log(this.props);

    const {
      name,
      surname,
      date,
      formedGender,
      currentTestTypeObj,
      indicatorsForShowArr,
      indicatorsPart,
    } = this.state;

    console.log(indicatorsForShowArr);







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
         {(Boolean(indicatorsPart && indicatorsPart.length) &&
           <FlatList
             ref='indicatorsList'
             extraData={this.state.indicatorsForShowArr}
             ListHeaderComponent={this.renderHeader}
             windowSize={5}
             keyExtractor={(item, index) => index.toString()}
             data={indicatorsPart}
             renderItem={this.renderIndicatorsList}
             onEndReached={() => {this.handleLoadMore()}}
             onEndReachedThreshold={0.9}
           />
         )}

       {/*</KeyboardAvoidingView>*/}
       {/*<AddButton handlePress={this.handlePressAddButton}/>*/}
     </View>
    )
  }


}

function mapStateToProps(state) {
  console.log(state);
  console.log(state.tests.indicatorsListForShow);

  return {
    currentUserData: state.authedUser.currentUserData,
    testTypesTitleList: state.tests.testTypesTitleList,
    formedTestTypesList: state.tests.formedTestTypesList,
    chosenTestType:  state.tests.chosenTestType,

    indicatorsListForShow: state.tests.indicatorsListForShow,
    indicatorsListForSave: state.tests.indicatorsListForSave,
    setIndicatorAfterSave: state.tests.setIndicatorAfterSave,
  }
}

// export default withNavigation(connect(mapStateToProps)(IndicatorsList))
export default connect(mapStateToProps)(IndicatorsList)

const styles = StyleSheet.create({
});
