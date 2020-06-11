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
  sortArrByObjectProp
} from "../../utils/helpers";
import {geTestsListByCurrentUser, getLabelsForUser, getTestTypesList} from "../../utils/API";
import {setFormedTestTypes, setTest, setTestTypesTitle} from "../../actions/tests";
import {connect} from 'react-redux'
import {setLabels} from "../../actions/labels";
import OneTestListItem from "./OneTestListItem";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";
import {Overlay} from "react-native-elements";


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
    }
  }

  componentDidMount(){
    console.log(this.props);

    const {currentUserData} = this.props;

     Promise.all([getTestTypesList(), getLabelsForUser(), geTestsListByCurrentUser()])
       .then(([testTypeListObj, labelsList, testListByCurrentUser]) => {



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


    const {testsList, labelsList} = nextProps;
    const prevTestsList = this.state.testsList;
    console.log(nextProps);

    let newLabelsListArr = convertObjToArr(labelsList);
    let newTestsListArr = convertObjToArr(testsList);

     console.log(newTestsListArr);

    if (newLabelsListArr !== this.state.labelsList) {
      this.setState({
        labelsList: newLabelsListArr
      })
    }



     this.setState({
       testsList: newTestsListArr,
       testsListOrigin: newTestsListArr,
       showList: Boolean(newTestsListArr.length),
     });


  }

  renderFlatListItem = ({item}) => {
    console.log(item);
    return (
      <OneTestListItem key={item.id} testData={item} hasCheckBox={false}  handleChoosingTest = {this.handleChoosingTest}/>
    )
  };

  renderLabelsListItem = ({item, index}) => {
    const {labelsList} = this.state;

    const chosenLabelsList = labelsList.filter(item => {
      return item.checked === true;
    });


    let wasClickOnLabel = !!chosenLabelsList.length;



    return (
      <TouchableOpacity
        onPress={() => this.handlePressLabel(item, index)}
        style={[styles.labelBtn, !wasClickOnLabel ? {backgroundColor: item.color} : {backgroundColor: Colors.DISABLED_BORDER}, wasClickOnLabel && item.checked && {backgroundColor: item.color},  index === 0 ? {marginLeft: 16}: {marginLeft: 0}, index === labelsList.length - 1 ? {marginRight: 16} : {marginRight: 8} ]}>
        <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>{item.title.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  };

  handlePressLabel = (item) => {
    const {labelsList, testsListOrigin} = this.state;

    let updatedLabelsList = setInverseChosenItemInArr(labelsList, item.id);
    this.setState({
      labelsList: updatedLabelsList
    });

    const isChosenLabel = updatedLabelsList.find((item) => {
      return item.checked === true;
    });


    if (isChosenLabel) {
      // -- Filter Test list by chosen labels --
      const chosenLabelsList = updatedLabelsList.filter(item => {
        return item.checked === true;
      });


      const filteredTestsListByLabel = testsListOrigin.filter(test => {
        const testLabels = test.labels || [];
        let containLabel = false;

        if (testLabels.length) {
          chosenLabelsList.forEach(chosenLabel => {
            testLabels.forEach(noteLabelID => {
              if (chosenLabel.id === noteLabelID) {
                containLabel = true;
              }
            })
          });
        }
        return containLabel
      });

      this.setState({
        testsList: filteredTestsListByLabel,
      });

    }

    if (!isChosenLabel) {
      // -- Show Original Note list if the use didn't chose any labels
      this.setState({
        testsList: testsListOrigin,
      });
    }

  };

  handleChoosingTest = (testID) => {

    const {testsList} = this.props;
    const currentTest = testsList[testID];
    console.log(currentTest);

    this.props.navigation.navigate('OneMedicalTest', {testID: testID, currentTest: currentTest})

  };



  render() {
    console.log(this.state);
    const {testsList, labelsList, isLoaded, showList} = this.state;
    console.log(testsList);

    // testsList.sort((a,b) => {
    //
    //   if (a.dateModified > b.dateModified) {
    //     return -1;
    //   }
    //   if (a.dateModified < b.dateModified) {
    //     return 1;
    //   }
    //   return 0
    //
    // });
    // testsList.sort((a,b) => {
    //
    //   if (a.date.toLowerCase() > b.date.toLowerCase()) {
    //     return -1;
    //   }
    //   if (a.date.toLowerCase() < b.date.toLowerCase()) {
    //     return 1;
    //   }
    //   return 0
    //
    // });

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
              {labelsList.length > 0 &&
                <View style={{marginTop: 12}}>
                  <FlatList
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={labelsList}
                    renderItem={this.renderLabelsListItem}
                  />
                </View>
              }
              {testsList.length ? (
                <View style={{flex: 1, marginTop: 28}}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={testsList}
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