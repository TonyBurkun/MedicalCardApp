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
      customIndicatorID: null,
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

    const {title, result, norma, unit} = this.props.data.inputFields;
    const {custom, testTypeID, indicatorID, customIndicatorID} = this.props.data;

    this.setState({
     ...this.state,
      custom,
      testTypeID,
      indicatorID,
      customIndicatorID,
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

    console.log(this.props);
    const {testTypeID,  indicatorID} = this.state;

    const indicatorsForShowArr= [...this.props.indicatorsForShowArr];
    console.log(indicatorsForShowArr);
    let indicatorsForShowObj = {};

    indicatorsForShowArr.forEach((item) => {
      console.log(item);
      if (item.custom) {
        indicatorsForShowObj[item.customIndicatorID] = item;
        indicatorsForShowObj[item.customIndicatorID].indicatorTypeID = testTypeID;
      } else {
        indicatorsForShowObj[item.indicatorID] = item;
      }
    });


    if (this.state.custom) {
      indicatorsForShowObj[this.state.customIndicatorID].inputFields[nameField] = newValue;
    } else {
      indicatorsForShowObj[indicatorID].inputFields[nameField] = newValue;
    }

    this.props.handleIndicatorsForShowArr(indicatorsForShowArr);




   const _addIIndicatorToSave = () => {
     console.log(this.state);
     console.log(this.props);
     const {custom, testTypeID,  indicatorID} = this.state;
     const {customIndicatorID} = this.props.data;
     const indicatorsListForSave = {...this.props.indicatorsListForSave};



     let indicatorForSaveObj = new IndicatorForm();
     indicatorForSaveObj.testTypeID = testTypeID;
     indicatorForSaveObj.indicatorID = indicatorID;
     indicatorForSaveObj.custom = custom;
     indicatorForSaveObj.customIndicatorID = customIndicatorID;

     indicatorForSaveObj.inputFields = {...this.state.formField};

     if (custom) {
       indicatorsListForSave[customIndicatorID] = indicatorForSaveObj;
     } else {
       indicatorsListForSave[indicatorID] = indicatorForSaveObj;
     }



     this.props.dispatch(setChosenIndicators(indicatorsListForSave));
     let indicatorsListForSaveArr = convertObjToArr(indicatorsListForSave);

     this.props.navigation.setParams({type: 'onlyAddItem', chosenItemsID: indicatorsListForSaveArr});

   };





    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        [nameField]: newValue,
      }
    }, () => {
      _addIIndicatorToSave();
    });
  };

  render() {
    const {title, unit, norma, result} = this.state.formField;
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
        <View style={{flex: 1, flexDirection: 'column', marginTop: 14}}>
          <View style={{width: '100%', paddingRight: 0, marginBottom: 14}}>
            <Text style={styles.inputTitle}>РЕЗУЛЬТАТ</Text>
            <TextInput
              value={result}
              style={[styles.formInput]}
              placeholder={'Результат'}
              onChangeText={value => this.handleChangeResult(value, 'result')}
            />
          </View>
          <View style={{flexDirection: 'column', width:'100%', justifyContent: 'flex-end'}}>
            <View style={{marginRight: 0, flexBasis: 78}}>
              <Text style={styles.inputTitle}>НОРМА</Text>
              <TextInput
                placeholder={'Норма'}
                editable={custom}
                value={norma.toString()}
                style={[styles.formInput, {textAlign: 'center', marginBottom: 14}, !custom && styles.disabledInput, custom && {textAlign: 'left'} ]}
                onChangeText={value => this.handleChangeResult(value, 'norma')}
              />
            </View>
            <View style={{flexBasis: 78}}>
              <Text style={styles.inputTitle}>ЕД.ИЗМ</Text>
              <TextInput
                placeholder={'Единицы измерения'}
                value={unit}
                editable={custom}
                style={[styles.formInput, !custom && styles.disabledInput, {textAlign: 'center'}, custom && {textAlign: 'left'} , ]}
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
};

MedicalIndicatorForm.defaultProps = {
  custom: false,
};
