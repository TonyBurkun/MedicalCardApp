import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as Colors from '../../../utils/colors'
import {prepareIndicatorDataForSaving} from '../../../utils/helpers'
import withNavigation from "react-navigation/src/views/withNavigation";
import {generateUniqID} from "../../../utils/API";


class MedicalIndicatorForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      patternIndicatorID: null,
      patternTypeID: null,
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

    const {
      custom,
      title,
      unit,
      norma,
      result,
      patternIndicatorID,
      patternTypeID,
      createdIndicatorID
    } = this.props;



    this.setState({
     ...this.state,
      custom,
      patternIndicatorID,
      patternTypeID,
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
    await this.setState({
      ...this.state,
      formReadyForSave: true,
      formField: {
        ...this.state.formField,
        [nameField]: newValue,
      }
    });
    console.log(this.state);


    const formFieldObj = this.state.formField;
    for (let key in formFieldObj) {
      if (formFieldObj.hasOwnProperty(key)) {
        if (!Boolean(formFieldObj[key])) {
         await this.setState({
            formReadyForSave: false
          })
        }
      }
    }


  //  if the test form is filled it can be save
    const {formReadyForSave} = this.state;

    const { patternIndicatorID, patternTypeID} = this.state;
    let {createdIndicatorID} = this.state;
    const {title, result, norma, unit} = this.state.formField;

    const indicatorIndexForSave = this.props.index;
    const indicatorDataForSave = prepareIndicatorDataForSaving(patternTypeID, patternIndicatorID, createdIndicatorID, title, norma, unit, result);
    console.log(indicatorDataForSave);

    this.props.updateIndicatorsList(indicatorDataForSave, indicatorIndexForSave, formReadyForSave);
  };

  render() {

    console.log(this.state);

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
    // currentUserData: state.authedUser.currentUserData,
    // testTypesList: state.tests.testTypesList,
    chosenTestType: state.tests.chosenTestType,
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
  title: PropTypes.string,
  norma: PropTypes.string,
  unit: PropTypes.string,
  index: PropTypes.number,
  result: PropTypes.string
};

MedicalIndicatorForm.defaultProps = {
  custom: false,
  title: '',
  norma: '',
  unit: '',
  result: ''

};
