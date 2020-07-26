import React, {Component, Fragment} from 'react'
import {ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import InternetNotification from "../ui_components/InternetNotification";
import * as Colors from "../../utils/colors";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {
  addCheckFieldToArr,
  convertObjToArr, getFormedTestTypesList,
  getIndicatorsArrForShow, getUserAgeInMilliseconds,
  isIphone5,
  setInverseChosenItemInArr,
  sortArrByObjectProp, sortTestList
} from "../../utils/helpers";
import {geTestsListByCurrentUser, getLabelsForUser, getTestTypesList} from "../../utils/API";
import {setFormedTestTypes, setTest, setTestTypesTitle} from "../../actions/tests";
import {connect} from 'react-redux'
import {saveChosenLabelForTestList, setLabels} from "../../actions/labels";
import OneTestListItem from "./OneTestListItem";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";
import {Icon, Overlay} from "react-native-elements";
import commonStyles from "../../utils/commonStyles";
import ChosenLabel from "../ui_components/ChosenLabel";
import {setChosenDoctorSpecializations} from "../../actions/doctorSpecializations";


class MedicalTestsList extends Component{

  constructor(props){
    super(props);

    this.state={
      testsList: [],
      testsListOrigin: [],
      testTypesList: [],
      labelsList: [],
      chosenLabels: false,
      isLoaded: false,
      showList: false,
      gettingData: false,
      labelsForFilter: [],
    }
  }

  componentDidMount(){
    console.log('DID MOUNT');
    console.log(this.props);

    const {currentUserData} = this.props;

     Promise.all([getTestTypesList(), getLabelsForUser(), geTestsListByCurrentUser()])

       .then(([testTypeListObj, labelsList, testListByCurrentUser]) => {



         geTestsListByCurrentUser()
           .then(data => {console.log(data)});

         // LABELS LIST
         this.props.dispatch(setLabels(labelsList));
         let labelsListArr = convertObjToArr(labelsList);
         labelsListArr = addCheckFieldToArr(labelsListArr);



         // USER TESTS LIST
         this.props.dispatch(setTest(testListByCurrentUser));
         let testsListArr = convertObjToArr(testListByCurrentUser);



         // TEST TYPE LIST
         let testTypesList = convertObjToArr(testTypeListObj);
         testTypesList = sortArrByObjectProp(testTypesList, 'id');

         const testTypesTitleList = testTypesList.map(item => {
           return item.title;
         });

         const userAge = getUserAgeInMilliseconds(currentUserData.date);
         const formedTestTypesListObj = getFormedTestTypesList(testTypesList, userAge, currentUserData.gender);
        console.log(formedTestTypesListObj);

         this.props.dispatch(setTestTypesTitle(testTypesTitleList));
         this.props.dispatch(setFormedTestTypes(formedTestTypesListObj));


         this.setState({
           testTypesList: formedTestTypesListObj,
           labelsList: labelsListArr,
           testsList: testsListArr,
           testsListOrigin: testsListArr,
           showList: Boolean(testsListArr.length),
           isLoaded: true,
           gettingData: false,
         });


       })
       .catch(error => {
         console.log('getting data on the Test tab fulfilled with error: ', error);
       });
  }

  componentWillReceiveProps(nextProps) {
    console.log('WILL RECEIVE PROPS');


    const {testsList, labelsList, chosenLabelsID} = nextProps;
    const {labelsForFilter} = this.state;
    const prevTestsList = this.state.testsList;
    console.log(nextProps);
    console.log(this.props);
    console.log(this.state);

    let newLabelsListArr = convertObjToArr(labelsList);
    let newTestsListArr = convertObjToArr(testsList);

     console.log(newTestsListArr);

    if (newLabelsListArr !== this.state.labelsList) {
      this.setState({
        labelsList: newLabelsListArr
      })
    }

     this.setState({
       // testsList: newTestsListArr,
       // testsListOrigin: newTestsListArr,
       showList: Boolean(newTestsListArr.length),
     });



    if (chosenLabelsID !== labelsForFilter && chosenLabelsID.length > 0) {
      console.log('NEW CHOSEN LABELS');

      this.setState({
        labelsForFilter: chosenLabelsID
      });

      let filteredTestListByLabel = [];

      for (let key in testsList) {

        console.log('ITERATION');

        if (testsList.hasOwnProperty(key)) {
          let testLabels = testsList[key].labels || [];
          console.log(testLabels);

         for (let i = 0; i < testLabels.length; i++){
           let result = chosenLabelsID.find(chosenLabel => {
             console.log(chosenLabel, testLabels[i]);
             return chosenLabel === testLabels[i];
           });

           if (result) {
             filteredTestListByLabel.push(testsList[key]);
             break;
           }
         }
        }
        this.setState({
          testsList: filteredTestListByLabel

        })
      }
    }

    if (!chosenLabelsID.length){
      this.setState({
        testsList: newTestsListArr
      })
    }


  }

  componentWillUnmount() {
    this.props.dispatch(saveChosenLabelForTestList([]));
  }

  renderFlatListItem = ({item}) => {
    console.log(item);
    return (
      <OneTestListItem key={item.id} testData={item} hasCheckBox={false}  handleChoosingTest = {this.handleChoosingTest}/>
    )
  };

  // renderLabelsListItem = ({item, index}) => {
  //   const {labelsList} = this.state;
  //
  //   const chosenLabelsList = labelsList.filter(item => {
  //     return item.checked === true;
  //   });
  //
  //
  //   let wasClickOnLabel = !!chosenLabelsList.length;
  //
  //
  //
  //   return (
  //     <TouchableOpacity
  //       onPress={() => this.handlePressLabel(item, index)}
  //       style={[styles.labelBtn, !wasClickOnLabel ? {backgroundColor: item.color} : {backgroundColor: Colors.DISABLED_BORDER}, wasClickOnLabel && item.checked && {backgroundColor: item.color},  index === 0 ? {marginLeft: 16}: {marginLeft: 0}, index === labelsList.length - 1 ? {marginRight: 16} : {marginRight: 8} ]}>
  //       <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>{item.title.toUpperCase()}</Text>
  //     </TouchableOpacity>
  //   )
  // };

  // handlePressLabel = (item) => {
  //   const {labelsList, testsListOrigin} = this.state;
  //
  //   let updatedLabelsList = setInverseChosenItemInArr(labelsList, item.id);
  //   this.setState({
  //     labelsList: updatedLabelsList
  //   });
  //
  //   const isChosenLabel = updatedLabelsList.find((item) => {
  //     return item.checked === true;
  //   });
  //
  //
  //   if (isChosenLabel) {
  //     // -- Filter Test list by chosen labels --
  //     const chosenLabelsList = updatedLabelsList.filter(item => {
  //       return item.checked === true;
  //     });
  //
  //
  //     const filteredTestsListByLabel = testsListOrigin.filter(test => {
  //       const testLabels = test.labels || [];
  //       let containLabel = false;
  //
  //       if (testLabels.length) {
  //         chosenLabelsList.forEach(chosenLabel => {
  //           testLabels.forEach(noteLabelID => {
  //             if (chosenLabel.id === noteLabelID) {
  //               containLabel = true;
  //             }
  //           })
  //         });
  //       }
  //       return containLabel
  //     });
  //
  //     this.setState({
  //       testsList: filteredTestsListByLabel,
  //     });
  //
  //   }
  //
  //   if (!isChosenLabel) {
  //     // -- Show Original Note list if the use didn't chose any labels
  //     this.setState({
  //       testsList: testsListOrigin,
  //     });
  //   }
  //
  // };

  handleChoosingTest = (testID) => {

    const {testsList} = this.props;
    const currentTest = testsList[testID];
    console.log(currentTest);

    this.props.navigation.navigate('OneMedicalTest', {testID: testID, currentTest: currentTest})

  };

  showItemsList = (param, screenTitle, radio = '') => {
    const {chosenLabelsID} = this.props || [];
    this.props.navigation.navigate(param, {listType: param, screenTitle: screenTitle, radio: radio, fromScreen: 'testsList', chosenLabelsID: chosenLabelsID});
  };

  handleClearBtn = () => {
    console.log('press');
    this.props.dispatch(saveChosenLabelForTestList([]))
  };



  render() {
    console.log(this.state);
    console.log(this.props);
    const {testsList, isLoaded, showList} = this.state;
    const {labelsList} = this.props;
    const {chosenLabelsID} = this.props || [];


    return(
      <SafeAreaView style={styles.container}>
        <Overlay
          isVisible={this.state.gettingData}
          width="auto"
          height="auto">
          <ActivityIndicator/>
        </Overlay>
        <InternetNotification topDimension={0}/>

        {Boolean(isLoaded) &&
        <Fragment>
          {showList ? (
            <Fragment>
              {/*{labelsList.length > 0 &&*/}
              {/*  <View style={{marginTop: 12}}>*/}
              {/*    <FlatList*/}
              {/*      horizontal={true}*/}
              {/*      keyExtractor={(item, index) => index.toString()}*/}
              {/*      data={labelsList}*/}
              {/*      renderItem={this.renderLabelsListItem}*/}
              {/*    />*/}
              {/*  </View>*/}
              {/*}*/}
              <View
                style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                <Text
                  onPress={() => {
                    this.showItemsList('ChoseLabel', 'Метки')
                    // this.props.navigation.navigate('LabelsList', {navType: 'showAddCancelBtn'});
                  }}
                  style={[commonStyles.tableBlockItemText]}>
                  Отфильтровать по меткам:
                </Text>
                {chosenLabelsID.length > 0 &&
                <TouchableOpacity
                  style={{position: 'absolute', width: 80, right: 40, top: 0, marginTop: 20}}
                  onPress={() => {
                    this.handleClearBtn();
                  }}
                >

                  <Text style={{color: Colors.BLUE_BTN}}>очистить</Text>
                </TouchableOpacity>
                }
                <Icon
                  name='chevron-down'
                  type='evilicon'
                  color={Colors.GRAY_TEXT}
                  size={40}
                  containerStyle={{position: 'absolute', right: 0, top: 0, marginTop: 12}}
                  onPress={() => {
                    this.showItemsList('ChoseLabel', 'Метки')
                    // this.props.navigation.navigate('LabelsList', {navType: 'showAddCancelBtn'});
                  }}
                />
                <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 16, paddingRight: 16}}>
                  {
                    chosenLabelsID.map((item, index) => {
                      console.log(item);

                      const title = labelsList[item].title;
                      const color = labelsList[item].color;
                      return (
                        <ChosenLabel key={index} title={title} color={color}/>
                      )
                    })
                  }
                </View>
              </View>

              {testsList.length ? (
                <View style={{flex: 1, marginTop: 28}}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={sortTestList(testsList)}
                    renderItem={this.renderFlatListItem}
                  />
                </View>
              ) : (
                <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
                  <Text>{NO_DATA_TO_SHOW}</Text>
                </View>
              )}
            </Fragment>
          ) : (
            <View style={{flex: 1, position: 'relative'}}>
              <View style={styles.mainTextWrapper}>
                <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь отображаются карточки Анализов которые Вы добавили самостоятельно.</Text>
                <Text style={[!isIphone5()? styles.subText: styles.subText__smallPhone]}>Создавайте, редактируйте или удаляйте Анализы.</Text>
              </View>
              <Image
                style={styles.personImage}
                source={require('../../assets/person/pills.png')}/>
              <View style={styles.tipWrapper}>
                <Text style={styles.tipText}>Добавить анализ</Text>
                <Image
                  style={styles.tipArrow}
                  source={require('../../assets/vector/pills_vector.png')}/>

              </View>
            </View>
          )}
        </Fragment>
        }
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  console.log(state);

  return {
    currentUserData: state.authedUser.currentUserData,
    labelsList: state.labels.labels,
    chosenLabelsID: state.labels.chosenLabelsIDForTestList,
    testsList: state.tests.testsList,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(MedicalTestsList))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
    backgroundColor: Colors.MAIN_BACKGROUND
  },

  submitBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.DARK_CERULEAN,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },

  firstBtn: {
    marginTop: 30,
  },

  submitBtnText: {
    ...Platform.select({
      ios: {
        textTransform: 'uppercase',
      }
    }),
    textAlign: 'center',
    color: Colors.ISABELLINE,
  },


  mainTextWrapper: {
    fontSize: 16,
    width: '100%',
    position: 'absolute',
    top: '10%',
    paddingLeft: 30,
    paddingRight: 30,
  },

  mainText: {
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  mainText__smallPhone: {
    fontSize: 12,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },

  subText__smallPhone: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },

  personImage: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    width: wp('43%'),
    height: hp('55%')
  },

  tipWrapper: {
    position: 'absolute',
    bottom: 20,
    right: '50%',
    marginRight: -140,
    width: 140,
    height: 90,
  },

  tipText: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GREEN_TIP
  },

  tipArrow: {
    width: 39,
    height: 62,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -31,
  },

  labelBtn: {
    alignSelf: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 8
  }

});
