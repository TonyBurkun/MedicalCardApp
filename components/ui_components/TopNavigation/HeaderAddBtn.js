import React, {Component} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity, Alert} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import * as Colors from '../../../utils/colors'
import GroupButtonsTitle from "../titles/GroupButtonsTitle";
import {setChosenDoctorSpecializations} from '../../../actions/doctorSpecializations'
import {setChosenDoctors} from "../../../actions/doctors";
import {saveChosenLabel} from "../../../actions/labels";
import {saveChosenPillsType, setChosenPills} from "../../../actions/pills"
import {setChosenIndicators, setChosenTestType, setIndicatorAfterSave, showPopUpWarning} from "../../../actions/tests";
import {TRY_SAVE_NOT_FILLED_INDICATOR} from "../../../utils/systemMessages";





class HeaderAddBtn extends Component{

  constructor(props) {
    super(props);

    this.state = {
      activeBtn: false,
      prevActiveBtn: false,
      activeItemArr: []
    }
  }


  componentDidMount(){
    console.log('mount');
    console.log(this.props.navigation.state.params);

    const params = this.props.navigation.state.params;

    if (params && params.prevData){
      // console.log('HERE');
      const prevActiveBtn = params.prevData.length;

      this.setState({
        prevActiveBtn: Boolean(prevActiveBtn),
        activeItemArr: params.prevData
        // activeItemArr: params.data
      })
    }

    if (params && params.chosenLabelsID){
      this.setState({
        activeItemArr: params.chosenLabelsID
      });
    }

  }

  async componentWillReceiveProps(newProps){
    //Component has to get param data as array. According to length of the Arr will be activated the button in the header navigation.
    const params = newProps.navigation.state.params;

    console.log(params);


    if (params && params.type === "AddItemsWithBack"){
      console.log('here');

      const activeBtn = params.chosenItemsID.length;
      const prevActiveBtn = params.prevData.length;

      await this.setState({
        activeBtn: Boolean(activeBtn),
        prevActiveBtn: Boolean(prevActiveBtn),
        activeItemArr: params.chosenItemsID
      })
    }

    if (params && params.type === 'onlyAddItem'){
      console.log('here');
      const activeBtn = params.chosenItemsID.length;
      const prevActiveBtn = false;

      this.setState({
        activeBtn: Boolean(activeBtn),
        prevActiveBtn: Boolean(prevActiveBtn),
        activeItemArr: params.chosenItemsID
      })
    }






  }


  handlePressBtn = () => {

    const {type} = this.props;
    console.log(type);

    switch (type) {
      case 'doctorSpecializations':
        this.props.dispatch(setChosenDoctorSpecializations(this.state.activeItemArr));
        this.props.navigation.goBack();
        break;

      case 'chosenDoctors':
        this.props.dispatch(setChosenDoctors(this.state.activeItemArr));
        this.props.navigation.goBack();
        break;

      case 'chosenLabels':
        this.props.dispatch(saveChosenLabel(this.state.activeItemArr));
        this.props.navigation.goBack();
        break;

      case 'chosePillsType':
        console.log('press save pills');
        this.props.dispatch(saveChosenPillsType(this.state.activeItemArr));
        this.props.navigation.goBack();
        break;

      case 'chosenPills':
        console.log('add Pills');
        this.props.dispatch(setChosenPills(this.state.activeItemArr));
        this.props.navigation.goBack();
        break;

      case 'chosenTestType':
        const {chosenTestType} = this.props.tests;
        // const {formedTestTypesList} = this.props.tests;
        // const test = formedTestTypesList[this.state.activeItemArr[0]];
        // console.log(this.state.activeItemArr);
        // const chosenTestTypeObj = {};
        // chosenTestTypeObj.id = test.id;
        // chosenTestTypeObj.index = this.state.activeItemArr;




        this.props.dispatch(setChosenTestType(this.state.activeItemArr));

        if (this.state.activeItemArr[0] !== chosenTestType[0]) {
          this.props.dispatch(setChosenIndicators([]));
          this.props.dispatch(setIndicatorAfterSave([]));
        }
        this.props.navigation.goBack();
        break;

      case 'chosenIndicators':
        console.log('add Indicators');
        this.props.dispatch(setIndicatorAfterSave(this.state.activeItemArr));
        this.props.dispatch(setChosenIndicators({}));
        this.props.navigation.goBack();
        break;

      default:
        break;
    }

    // this.props.navigation.goBack();
  };



  render() {

    const {titleBtn} = this.props;
    const {activeBtn, prevActiveBtn} = this.state;
    // console.log(activeBtn);
    // console.log(prevActiveBtn);
    return(
      <TouchableHighlight
        disabled={!activeBtn && !prevActiveBtn}
        underlayColor={'transparent'}
        onPress={this.handlePressBtn}
        style={{paddingRight: 8}}
      >
        <Text
          style={(activeBtn || prevActiveBtn )? {fontSize: 17, color: Colors.DARK_GREEN} : {fontSize: 17, color: Colors.DISABLED_BORDER}}
        >{titleBtn}</Text>
      </TouchableHighlight>
    )

  }
}

function mapStateToProps(state){
  console.log(state);
  const labels = state.labels;
  return {
    chosenLabelsID: labels.chosenLabelsID,
    chosenDoctorSpecializations: state.doctors.chosenDoctorSpecializations,
    tests: state.tests

  }
}


export default withNavigation(connect(mapStateToProps)(HeaderAddBtn)) ;


HeaderAddBtn.propTypes = {
  titleBtn: PropTypes.string.isRequired,
};

HeaderAddBtn.defaultProps = {
  titleBtn: 'Добавить',
};
