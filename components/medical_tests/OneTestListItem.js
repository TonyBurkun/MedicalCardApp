import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native'
import {connect} from "react-redux";
import PropTypes from 'prop-types'
import {CheckBox, Image} from "react-native-elements";
import * as Colors from "../../utils/colors";
// import PillLabel from "/../PillLabel";
import ChosenLabel from "./../ui_components/ChosenLabel";
import DateLabel from "../ui_components/DateLabel";
import {getTestTypesList} from "../../utils/API";
import {setTestTypes} from "../../actions/tests";
import { withNavigationFocus } from 'react-navigation';
import {convertObjToArr} from "../../utils/helpers";

class OneTestListItem extends Component {

  constructor(props){
    super(props);

    this.state={
      testTypesList: [],
      testTypeTitle: '',

    }
  }

  componentDidMount(){
    console.log('MOUNT');
    const {testTypesList, testData} = this.props;
    console.log(testData);
    if (testTypesList && testTypesList.length) {
      const currentTestType = testTypesList[testData.testType];
      this.setState({
        testTypesList,
        testTypeTitle: currentTestType.title
    })
    } else {
      getTestTypesList()
        .then(data => {
          console.log(data);
          // this.props.dispatch(setTestTypes(data));
          const currentTestType = data[testData.testType];
          this.setState({
            testTypesList: data,
            testTypeTitle: currentTestType.title
          });
        })
        .catch(error => {console.log('can not get Test Type List: ', error)});
    }

  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);


    const {testType} = nextProps.testData;
    const {formedTestTypesList} = this.props.tests;
    const testTypeTitle = formedTestTypesList[testType].title;
    this.setState({
      testTypeTitle
    });
  }


  render() {
    console.log(this.state);
    console.log(this.props);

    let {testData, hasCheckBox, index, labelsList} = this.props;
    const testLabelsID = testData.labels || [];
    const testImagesArr = testData.images || [];
    const {testTypeTitle} = this.state;

    console.log(testLabelsID);
    console.log(labelsList);





    return (
      <TouchableOpacity
        onPress={() => {this.props.handleChoosingTest(testData.id, hasCheckBox)}}
        style={[styles.noteBody]}>
        <View>
          <DateLabel date={testData.date}/>
          <Text style={{fontSize: 21, color: Colors.BLACK_TITLE}}>{testTypeTitle}</Text>
          <Text style={{fontSize: 12, color: Colors.NOTE_GREY_TEXT, marginTop: 8}}>{testData.other}</Text>
          {Boolean(testLabelsID.length) &&
            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: -8}}>
              {testLabelsID.map((item, index) => {
                console.log(item);
                return   <ChosenLabel key={index} title={labelsList[item].title} color={labelsList[item].color}/>
              })}
            </View>
          }
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginBottom: -8}}>
            {testImagesArr.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{borderRadius: 12, overflow: 'hidden', marginRight: 8, marginBottom: 8}}>
                  <Image
                    style={{width: 80, height: 80}}
                    source={{uri: item.url}}
                    resizeMode={'cover'}
                    PlaceholderContent={<ActivityIndicator/>}
                  />
                </View>
              )
            })}
          </View>
        </View>
      </TouchableOpacity>
    )
  }


}

function mapStateToProps (state) {
  console.log(state);
  return {
    tests: state.tests,
    labelsList: state.labels.labels
  }
}

export default withNavigationFocus(connect(mapStateToProps)(OneTestListItem))

const styles = StyleSheet.create({
  noteBody: {
    position: 'relative',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,

    shadowColor: Colors.BLACK_TITLE,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4
    }
  },

  pillText: {
    color: Colors.BLACK_TITLE_BTN,
    fontSize: 16,
    alignSelf: 'center',

  }
});


OneTestListItem.propTypes = {
  testData: PropTypes.object.isRequired,
  handleChoosingTest: PropTypes.func.isRequired,
};

OneTestListItem.defaultProps = {
  testData: {
    id: 'pill-id',
    title: 'Название записи',
    createdByUser: 'Пользователь который создал',
    other: '',
    labels: [],
    images: [],
    date: 'дата',
  },
};

