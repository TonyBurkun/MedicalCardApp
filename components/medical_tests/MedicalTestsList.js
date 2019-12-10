import React, {Component, Fragment} from 'react'
import {View, Text, Image, StyleSheet, Platform, FlatList, TouchableOpacity} from 'react-native'
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import InternetNotification from "../ui_components/InternetNotification";
import * as Colors from "../../utils/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {addCheckFieldToArr, convertObjToArr, isIphone5, setInverseChosenItemInArr} from "../../utils/helpers";
import {geTestsListByCurrentUser, getLabelsForUser, getTestTypesList} from "../../utils/API";
import {setTest, setTestTypes} from "../../actions/tests";
import {connect} from 'react-redux'
import {setLabels} from "../../actions/labels";
import OneTestListItem from "./OneTestListItem";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";



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
    }
  }

  componentDidMount(){



    getTestTypesList()
      .then(data => {
        this.props.dispatch(setTestTypes(data));
        this.setState({
          testTypesList: data
        });
      })
      .catch(error => {console.log('can not get Test Type List: ', error)});

    getLabelsForUser()
      .then(data => {
        this.props.dispatch(setLabels(data));

        let labelsListArr = convertObjToArr(data);
        labelsListArr = addCheckFieldToArr(labelsListArr);
        this.setState({
          labelsList: labelsListArr
        })
      })
      .catch(error => {console.log('can not get Labels list for the user', error)});

    geTestsListByCurrentUser()
      .then(data => {
        this.props.dispatch(setTest(data));
        let testsListArr = convertObjToArr(data);


        this.setState({
          testsList: testsListArr,
          testsListOrigin: testsListArr,
          isLoaded: true,
          showList: Boolean(testsListArr.length),
        })
      })
      .catch(error => {console.log('can not get Tests List: ', error)});
  }

  componentWillReceiveProps(nextProps) {


    const {testsList, labelsList} = nextProps;
    console.log(nextProps);

    let newLabelsListArr = convertObjToArr(labelsList);
    let newTestsListArr = convertObjToArr(testsList);

    if (newLabelsListArr !== this.state.labelsList) {
      this.setState({
        labelsList: newLabelsListArr
      })
    }

    this.setState({
      testsList: newTestsListArr,
      testsListOrigin: newTestsListArr,
      showList: Boolean(newTestsListArr.length),
    })


  }

  renderFlatListItem = ({item}) => {
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

    // this.props.navigation.navigate('OneTest', {testID: testID, currentTest: currentTest})

  };



  render() {
    const {testsList,  labelsList, isLoaded, showList} = this.state;


    testsList.sort((a,b) => {

      if (a.dateModified > b.dateModified) {
        return -1;
      }
      if (a.dateModified < b.dateModified) {
        return 1;
      }
      return 0

    });


    testsList.sort((a,b) => {

      if (a.date.toLowerCase() > b.date.toLowerCase()) {
        return -1;
      }
      if (a.date.toLowerCase() < b.date.toLowerCase()) {
        return 1;
      }
      return 0

    });

    return(
      <SafeAreaView style={styles.container}>
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

        {/*{!testsList.length &&*/}
        {/*<View style={{flex: 1, position: 'relative'}}>*/}
        {/*  <View style={styles.mainTextWrapper}>*/}
        {/*    <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь отображаются карточки Анализов которые Вы добавили самостоятельно.</Text>*/}
        {/*    <Text style={[!isIphone5()? styles.subText: styles.subText__smallPhone]}>Создавайте, редактируйте или удаляйте Анализы.</Text>*/}
        {/*  </View>*/}
        {/*  <Image*/}
        {/*    style={styles.personImage}*/}
        {/*    source={require('../../assets/person/pills.png')}/>*/}
        {/*  <View style={styles.tipWrapper}>*/}
        {/*    <Text style={styles.tipText}>Добавить анализ</Text>*/}
        {/*    <Image*/}
        {/*      style={styles.tipArrow}*/}
        {/*      source={require('../../assets/vector/pills_vector.png')}/>*/}

        {/*  </View>*/}
        {/*</View>*/}
        {/*}*/}
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  console.log(state);

  return {
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
