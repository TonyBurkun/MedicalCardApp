import React, {Component} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import * as Colors from '../../../utils/colors'
import GroupButtonsTitle from "../GroupButtonsTitle";
import {setChosenDoctorSpecializations} from '../../../actions/doctorSpecializations'
import {setChosenDoctors} from "../../../actions/doctors";
import {saveChosenLabel} from "../../../actions/labels";
import {saveChosenPillsType, setChosenPills} from "../../../actions/pills"





class HeaderAddBtn extends Component{

  constructor(props) {
    super(props);

    this.state = {
      activeBtn: false,
      prevActiveBtn: false,
      activeItemArr: []
    }
  }


  handlePressBtn = () => {

    const {type} = this.props;
    console.log(type);

    switch (type) {
      case 'doctorSpecializations':
        this.props.dispatch(setChosenDoctorSpecializations(this.state.activeItemArr));
        break;

      case 'chosenDoctors':
        this.props.dispatch(setChosenDoctors(this.state.activeItemArr));
        break;

      case 'chosenLabels':
        this.props.dispatch(saveChosenLabel(this.state.activeItemArr));
        break;

      case 'chosePillsType':
        console.log('press save pills');
        this.props.dispatch(saveChosenPillsType(this.state.activeItemArr));
        break;

      case 'chosenPills':
        console.log('add Pills');
        this.props.dispatch(setChosenPills(this.state.activeItemArr));
        break;

      default:
        break;
    }

    this.props.navigation.goBack();
  };

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
      console.log('here');
      console.log(params);
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
      const prevActiveBtn = true;

      this.setState({
        activeBtn: Boolean(activeBtn),
        prevActiveBtn: Boolean(prevActiveBtn),
        activeItemArr: params.chosenItemsID
      })
    }






  }


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
  const labels = state.labels;
  return {
    chosenLabelsID: labels.chosenLabelsID,
    chosenDoctorSpecializations: state.doctors.chosenDoctorSpecializations,
  }
}


export default withNavigation(connect(mapStateToProps)(HeaderAddBtn)) ;


HeaderAddBtn.propTypes = {
  titleBtn: PropTypes.string.isRequired,
};

HeaderAddBtn.defaultProps = {
  titleBtn: 'Добавить',
};
