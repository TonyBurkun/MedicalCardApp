import React, {Component} from 'react';
import {View, Text, TouchableHighlight, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withNavigation} from 'react-navigation'
import * as Colors from '../../../utils/colors'
import GroupButtonsTitle from "../GroupButtonsTitle";
import {setChosenDoctorSpecializations} from '../../../actions/doctorSpecializations'





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

    switch (type) {
      case 'doctorSpecializations':
        this.props.dispatch(setChosenDoctorSpecializations(this.state.activeItemArr));
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
    // console.log(params);

    if (params && params.prevData){
      const prevActiveBtn = params.prevData.length;

      console.log(prevActiveBtn);
      this.setState({
        prevActiveBtn: Boolean(prevActiveBtn),
        activeItemArr: params.prevData
        // activeItemArr: params.data
      })
    }

  }

  componentWillReceiveProps(newProps){
    //Component has to get param data as array. According to length of the Arr will be activated the button in the header navigation.
    const params = newProps.navigation.state.params;

    // console.log(params);

    if (params && params.type === "checkItem"){
      const activeBtn = params.data.length;
      const prevActiveBtn = params.prevData.length;

      // console.log(activeBtn);
      // console.log(prevActiveBtn);
      this.setState({
        activeBtn: Boolean(activeBtn),
        prevActiveBtn: Boolean(prevActiveBtn),
        activeItemArr: params.data
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
