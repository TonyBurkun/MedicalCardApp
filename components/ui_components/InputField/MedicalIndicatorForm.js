import React, {Component, Fragment, PureComponent} from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as Colors from '../../../utils/colors'
import {convertObjToArr, prepareIndicatorDataForSaving} from '../../../utils/helpers'
import withNavigation from "react-navigation/src/views/withNavigation";
import {generateUniqID} from "../../../utils/API";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {setChosenIndicators} from "../../../actions/tests";
import {IndicatorForm} from '../../../utils/dataPattern'


class MedicalIndicatorForm extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      testTypeID: null,
      indicatorID: null,
      createdIndicatorID: null,
      formReadyForSave: true,
      custom: false,
      formField: {
        title: '',
        result: '',
        unit: '',
        norma: ''
      }
    }

  }

  componentDidMount() {

    console.log(this.props);
    console.log(this.props.title);

    const {title, result, norma, unit} = this.props.data.inputFields;
    const {custom, testTypeID, indicatorID, createdIndicatorID} = this.props.data;


    this.setState({
     ...this.state,
      custom,
      testTypeID,
      indicatorID,
      createdIndicatorID,
      formField: {
       ...this.state.formField,
        title,
        unit,
        norma,
        result,
      }
    })
  }


  handleChangeResult = async (newValue, nameField) => {

  console.log(newValue);
  console.log(nameField);

  let prevValue = this.state.formField[nameField];






   const _validationIndicatorFormBeforeSaving = () => {
     const {custom, testTypeID,  indicatorID, createdIndicatorID} = this.state;
     const indicatorsListForSave = {...this.props.indicatorsListForSave};

     console.log(indicatorsListForSave);


     let indicatorForSaveObj = new IndicatorForm();
     indicatorForSaveObj.testTypeID = testTypeID;
     indicatorForSaveObj.indicatorID = indicatorID;
     indicatorForSaveObj.createdIndicatorID = custom && generateUniqID();
     indicatorForSaveObj.custom = custom;
     indicatorForSaveObj.inputFields = {...this.state.formField};





     const indicatorReadyForSave = _checkingIndicatorFill(this.state.formField);
     const isIndicatorStoredToSave = _checkingIndicatorExistenceToSave();

     console.log(this.state.formField);
     console.log(indicatorReadyForSave);

     if (indicatorReadyForSave && !custom) {
       console.log('here');
       indicatorsListForSave[indicatorForSaveObj.indicatorID] = indicatorForSaveObj;
     }


     if (indicatorReadyForSave && custom) {
       indicatorsListForSave[indicatorForSaveObj.createdIndicatorID] = indicatorForSaveObj;
     }

     if (!indicatorReadyForSave && !custom && isIndicatorStoredToSave) {
       delete indicatorsListForSave[indicatorForSaveObj.indicatorID];
     }

     if (!indicatorReadyForSave && custom && isIndicatorStoredToSave) {
       delete indicatorsListForSave[indicatorForSaveObj.createdIndicatorID];
     }



     console.log(indicatorsListForSave);
     console.log(this.props);

     this.props.dispatch(setChosenIndicators(indicatorsListForSave));
     let indicatorsListForSaveArr = convertObjToArr(indicatorsListForSave);
     console.log(indicatorsListForSaveArr);
     // this.props.navigation.navigate('MedicalIndicators', {type: 'onlyAddItem', chosenItemsID: indicatorsListForSaveArr})
     this.props.navigation.setParams({type: 'onlyAddItem', chosenItemsID: indicatorsListForSaveArr});



   };




    const _checkingIndicatorFill = (formFieldObj) => {
      let indicatorFilled = true;
      for (let key in formFieldObj) {
        if (formFieldObj.hasOwnProperty(key)) {
          if (!Boolean(formFieldObj[key])) {
            indicatorFilled = false;
          }
        }
      }

      return indicatorFilled;
    };
    const _checkingIndicatorExistenceToSave = () => {
      const {indicatorsListForSave} = this.props;
      const {custom, indicatorID, createdIndicatorID} = this.state;
      let isIndicatorExist;


      if (!custom)  {
        indicatorsListForSave[indicatorID] ? isIndicatorExist = true : isIndicatorExist = false;
      } else {
        indicatorsListForSave[createdIndicatorID] ? isIndicatorExist = true : isIndicatorExist = false;
      }

      console.log(isIndicatorExist);

      return isIndicatorExist;
    };




    this.setState({
      ...this.state,
      // formReadyForSave: true,
      formField: {
        ...this.state.formField,
        [nameField]: newValue,
      }
    }, () => {


      _validationIndicatorFormBeforeSaving();

    });





















    console.log(this.props);

    // const indicatorIndexForSave = this.props.index;
    // const indicatorDataForSave = prepareIndicatorDataForSaving(patternTypeIndex, patternIndicatorID, createdIndicatorID, title, norma, unit, result);
    // console.log(indicatorDataForSave);

    // this.props.updateIndicatorsList(indicatorDataForSave, indicatorIndexForSave, formReadyForSave);
  };

  render() {

    console.log(this.state);
    console.log(this.props.data.inputFields);

    const {title, unit, norma, result} = this.state.formField;
    // const {title, result, norma, unit} = this.props.data.inputFields;
    const {custom} = this.state;






    return (
      <View style={{
        backgroundColor: Colors.WHITE,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_COLOR
      }}>
        <Text style={{color: Colors.BLUE_BTN, fontSize: 12, marginBottom: 16}}>ПОКАЗАТЕЛЬ</Text>
        <TextInput
          value={title}
          editable={custom}
          style={[styles.formInput, !custom && styles.disabledInput]}
          placeholder={'Показатель'}
          onChangeText={value => this.handleChangeResult(value, 'title')}
        />
        <View style={{flex: 1, flexDirection: 'row', marginTop: 14}}>
          <View style={{width: '50%', paddingRight: 16}}>
            <Text style={styles.inputTitle}>РЕЗУЛЬТАТ</Text>
            <TextInput
              value={result}
              style={[styles.formInput]}
              placeholder={'Результат'}
              onChangeText={value => this.handleChangeResult(value, 'result')}
            />
          </View>
          <View style={{flexDirection: 'row', width:'50%', justifyContent: 'flex-end'}}>
            <View style={{marginRight: 8, flexBasis: 78}}>
              <Text style={styles.inputTitle}>НОРМА</Text>
              <TextInput
                editable={custom}
                value={norma.toString()}
                style={[styles.formInput, {textAlign: 'center'}, !custom && styles.disabledInput ]}
                onChangeText={value => this.handleChangeResult(value, 'norma')}
              />
            </View>
            <View style={{flexBasis: 78}}>
              <Text style={styles.inputTitle}>ЕД.ИЗМ</Text>
              <TextInput
                value={unit}
                editable={custom}
                style={[styles.formInput, !custom && styles.disabledInput , {textAlign: 'center'}]}
                onChangeText={value => this.handleChangeResult(value, 'unit')}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }


}

function mapStateToProps(state) {
  console.log(state);

  return {
    formedTestTypesList: state.tests.formedTestTypesList,
    // currentUserData: state.authedUser.currentUserData,
    // testTypesList: state.tests.testTypesList,
    chosenTestType: state.tests.chosenTestType,
    indicatorsListForShow: state.tests.indicatorsListForShow,
    indicatorsListForSave: state.tests.indicatorsListForSave,
  }
}

export default withNavigation(connect(mapStateToProps)(MedicalIndicatorForm))

const styles = StyleSheet.create({
  inputTitle: {
    fontSize: 12,
    color: Colors.GRAY_TEXT,
    marginBottom: 4,
  },


  formInput: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY_TEXT,
    fontSize: 16,
    height: 40,
    paddingLeft: 8, paddingRight: 8,
  },

  disabledInput: {
    borderWidth: 0,
    backgroundColor: Colors.DISABLED_BG
  }
});

MedicalIndicatorForm.propTypes = {
  custom: PropTypes.bool.isRequired,
  // title: PropTypes.string,
  // norma: PropTypes.string,
  // unit: PropTypes.string,
  // index: PropTypes.number,
  // result: PropTypes.string
};

MedicalIndicatorForm.defaultProps = {
  custom: false,
  // title: '',
  // norma: '',
  // unit: '',
  // result: ''

};
