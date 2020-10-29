import React, {Component, Fragment} from 'react'
import {View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList} from 'react-native'
import {connect} from "react-redux";
import { withNavigationFocus } from 'react-navigation';
import {getCurrentUserData, getTestTypesList, getUIDfromFireBase} from "../../utils/API";
import * as Colors from "../../utils/colors";
import EditIconBtn from "../ui_components/TopNavigation/EditIconBtn";
import DateLabel from "../ui_components/DateLabel";
import commonStyles from "../../utils/commonStyles";
import GreenTitle from "../ui_components/titles/GreenTitle";
import {Image} from "react-native-elements";
// import {getIndicatorInReadableFormat} from "../../utils/helpers";
import {setChosenTestType, setIndicatorAfterSave} from "../../actions/tests";
import {saveChosenLabel} from "../../actions/labels";
import {sortIndicatorsListForShowByFilledFields} from "../../utils/helpers";



class OneMedicalTest extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTestTypeTitle: '',
      currentTest: {},
      currentUserData: {},
      testTypesList: [],
      testIndicators: []
    }

  }

  static navigationOptions = ({navigation}) => {

    let currentTest = '';
    let showEditBtn = false;
    const uid = getUIDfromFireBase();

    if (navigation.state.params && navigation.state.params.currentTest) {
      currentTest = navigation.state.params.currentTest;


      if (currentTest.createdByUser === uid){
        showEditBtn = true;
      }
    }

    function handleEditBtn(){
      navigation.navigate('CreateTest', {currentTest: currentTest});
    }

    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Карточка анализа</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      },

      headerRight: (
        <TouchableOpacity onPress={handleEditBtn}>
          <EditIconBtn show={showEditBtn}/>
        </TouchableOpacity>
      )
    }
  };

  async componentDidMount(){
    console.log(this.props);
    const {tests, navigation, currentUserData, testsList} = this.props;



    // if (testTypesList && testTypesList.length) {
    //   await this.setState({
    //     testTypesList: testTypesList
    //   });
    // } else {
    //   await getTestTypesList()
    //     .then(data => {
    //       this.setState({
    //         testTypesList: data
    //       });
    //     })
    //     .catch(error => console.log('can not get Test Type List:', error));
    // }

    // if (currentUserData && Object.keys(currentUserData).length) {
    //   await this.setState({
    //     currentUserData: currentUserData
    //   });
    // } else {
    //   await getCurrentUserData()
    //     .then(data => {
    //       this.setState({
    //         currentUserData: data
    //       });
    //     })
    //     .catch(error => console.log('can not get Current User Data:', error));
    // }







    if (navigation.state.params && navigation.state.params.currentTest) {
      const currentTest = navigation.state.params.currentTest;
      const testType = currentTest.testType;
      const {formedTestTypesList, currentUserData} = this.props;
      const currentTestTypeTitle = formedTestTypesList[testType].title;
      const {date, gender} = currentUserData;


      const testIndicators = currentTest.indicators;

      let sortedTestIndicators = sortIndicatorsListForShowByFilledFields(testIndicators);



      // console.log(testIndicators);




      this.setState({
        currentTest,
        testType,
        formedTestTypesList: this.props.formedTestTypesList,
        currentTestTypeTitle,
        testIndicators: sortedTestIndicators

      });
    }
  }



  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    const testID = this.props.navigation.state.params.testID;
    const {testsList} = nextProps;


    const {testTypesList, currentUserData} = this.state;
    const formedTestTypesList = {...this.state.formedTestTypesList};
    const {date, gender} = currentUserData;
    const updatedTest = testsList[testID];
    const updatedTestType = updatedTest.testType;
    const updatedTestTypeTitle = formedTestTypesList[updatedTestType].title;




    const testIndicators = updatedTest.indicators;
    let sortedTestIndicators = sortIndicatorsListForShowByFilledFields(testIndicators);


    this.setState({
      currentTest: updatedTest,
      currentTestTypeTitle: updatedTestTypeTitle,
      testType: updatedTest.testType,
      testIndicators: sortedTestIndicators

    });

  }

  componentWillUnmount() {
    this.props.dispatch(saveChosenLabel([]));
  }


  renderIndicatorsItem = ({item, index}) => {
    const testIndicators = this.state.currentTest.indicators || [];

    let {title, result, norma, unit} = item.inputFields;
    console.log(item);
    return (
      <View style={[
        {padding: 8, marginLeft: 16,  width: 190, backgroundColor: Colors.WHITE, borderRadius: 10},
        index === 0 ? {marginLeft: 16}: {marginLeft: 0}, index === testIndicators.length - 1 ? {marginRight: 16} : {marginRight: 8}
      ]}>
        <TextInput
          value={title.toString()}
          editable={false}
          style={styles.input}
        />
        <View style={{marginTop: 8}}>
          <Text style={styles.inputTitle}>РЕЗУЛЬТАТ</Text>
          <TextInput
            value={result.toString()}
            editable={false}
            style={styles.input}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          <View style={{width: 82, marginRight: 8}}>
            <Text style={styles.inputTitle}>НОРМА</Text>
            <TextInput
              value={norma.toString()}
              editable={false}
              style={[styles.input, {textAlign: 'center'}]}
            />
          </View>
          <View style={{width: 82}}>
            <Text style={styles.inputTitle}>ЕД.ИЗМ</Text>
            <TextInput
              value={unit.toString()}
              editable={false}
              style={[styles.input, {textAlign: 'center'}]}
            />
          </View>
        </View>
      </View>
    )
  };

  render() {
    console.log(this.state);
    const {currentTest, testType, testTypesList, currentTestTypeTitle, testIndicators} = this.state;
    const {labelsList} = this.props;

    const {date} = currentTest;
    const testLabels = currentTest.labels || [];
    const testImages = currentTest.images || [];
    const testConclusion = currentTest.other || '';


    return (
      <SafeAreaView style={styles.container}>
        <View style={[commonStyles.containerIndents, {marginTop: 16}]}>
          <DateLabel date={date}/>
          <Text style={{fontSize: 21, color: Colors.BLACK_TITLE}}>{currentTestTypeTitle}</Text>
        </View>

       {/*-- INDICATORS --*/}

        {Boolean(testIndicators) &&
          <View style={{marginTop: 16}}>
            <FlatList
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              data={testIndicators}
              renderItem={this.renderIndicatorsItem}
            />
          </View>

        }



       <View style={commonStyles.containerIndents}>
         {/*-- LABELS --*/}
         {Boolean(testLabels.length) &&
         <View style={{marginTop: 24}}>
           <GreenTitle title={'МЕТКИ'}/>
           <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
             {
               testLabels.map((item, index) => {
                 return (
                   <View key={index} style={{height: 40, borderRadius: 8, paddingLeft: 12, paddingRight: 12, backgroundColor: labelsList[item].color, justifyContent: 'center', marginRight: 8, marginTop: 8}}>
                     <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>{labelsList[item].title.toUpperCase()}</Text>
                   </View>
                 )
               })
             }
           </View>
         </View>
         }

         {/*-- IMAGES --*/}
         {Boolean(testImages.length) &&
         <View style={{marginTop: 24}}>

           <GreenTitle title={'ФОТО'}/>
           <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
             {
               testImages.map((item, index) => {
                 return (
                   <View
                     key={index}
                     style={{borderRadius: 12, overflow: 'hidden', marginRight: 8, marginBottom: 8, marginTop: 8}}>
                     <Image
                       style={{width: 80, height: 80}}
                       source={{uri: item.url}}
                       resizeMode={'cover'}
                       PlaceholderContent={<ActivityIndicator />}
                     />


                   </View>
                 )
               })
             }
           </View>
         </View>
         }

         {/*-- CONCLUSION --*/}
         {Boolean(testConclusion) &&
         <View style={{marginTop: 24}}>
           <GreenTitle title={'ЗАКЛЮЧЕНИЯ И РЕКОМЕНДАЦИИ'}/>
           <Text style={{fontSize: 16, color: Colors.TYPOGRAPHY_COLOR_DARK, marginTop: 8}}>{testConclusion}</Text>
         </View>
         }
       </View>

      </SafeAreaView>
    )
  }


}

function mapStateToProps(state) {
  console.log(state);
  return {
    currentUserData: state.authedUser.currentUserData,
    formedTestTypesList: state.tests.formedTestTypesList,
    labelsList: state.labels.labels,
    testsList: state.tests.testsList,
    indicatorsListForSave: state.tests.indicatorsListForSave,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(OneMedicalTest))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND,
  },

  inputTitle: {
    fontSize: 12,
    color: Colors.GRAY_TEXT,
    marginBottom: 4,
  },

  input: {
    width: '100%',
    height: 40,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    fontSize: 16,
    borderRadius: 10,
    paddingLeft: 8, paddingRight: 8,
    borderWidth: 0,
    backgroundColor: Colors.DISABLED_BG

  },



});
