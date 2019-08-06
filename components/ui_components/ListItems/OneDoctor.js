import React, { Component } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {connect} from 'react-redux'
import {CheckBox} from 'react-native-elements'
import PropTypes from 'prop-types'
import * as Colors from '../../../utils/colors'
import {getDoctorSpecializations} from '../../../utils/API'
import {setDoctorSpecializations} from '../../../actions/doctorSpecializations'



class OneDoctor extends Component{

  constructor(props){
    super(props);

    this.state={
      specializations: []
    }
  }


  componentDidMount(){
    const {doctorSpecializations} = this.props;
    this.setState({
      specializations: doctorSpecializations
    })

  }

  componentWillReceiveProps(newProps){
    // console.log(newProps);
    this.setState({
      specializations: newProps.doctorSpecializations
    })
  }


  render() {


    function getSpecializationsTitleStr(specializationsArr, chosenSpecializationIDArr) {
      let chosenTitlesStr = '';

      if (chosenSpecializationIDArr.length && specializationsArr.length) {
        chosenSpecializationIDArr.forEach((item) => {
          chosenTitlesStr = chosenTitlesStr + specializationsArr[item] + ', '
        });
        chosenTitlesStr = chosenTitlesStr.substr(0, chosenTitlesStr.length - 2);
      }


      return chosenTitlesStr;
    }




    const {doctorData, hasCheckBox} = this.props;
    const {specializations} = this.state;

    getSpecializationsTitleStr(specializations, doctorData.specializations);


    return(
      <TouchableOpacity
        onPress={() => {this.props.handleChoosingLabel(doctorData.id, hasCheckBox)}}
        style={[styles.doctorBody, {position: 'relative'}, !hasCheckBox ? {paddingLeft: 18} : {paddingLeft: 38} ]}>
        {hasCheckBox &&
        <CheckBox
          checked={doctorData.checked}
          iconType='material-community'
          checkedIcon='check-circle'
          uncheckedIcon='checkbox-blank-circle-outline'
          uncheckedColor={Colors.WHITE}
          checkedColor={Colors.WHITE}
          size={20}
          containerStyle={{margin: 0, padding: 0, alignSelf: 'center', position: 'absolute', left: 0, top: '50%', marginTop: -10}}
        />
        }
       <View style={{flexDirection: 'column', justifyContent: 'center', paddingTop: 10, paddingBottom: 10}}>
         <View style={{flexDirection: 'row'}}>
           <Text style={[styles.doctorText, {fontWeight: 'bold'}]}>{doctorData.firstName && doctorData.firstName + ' '}</Text>
           <Text style={styles.doctorText}>{doctorData.lastName}</Text>
         </View>
         <Text style={{color: Colors.MAIN_GREEN, fontSize: 14, marginTop: 3}}>{ getSpecializationsTitleStr(specializations, doctorData.specializations)}</Text>
       </View>
      </TouchableOpacity>
    )
  }
}


function mapStateToProps (state) {
  // console.log(state);

  return {
    doctorSpecializations: state.doctors.doctorSpecializations
  }
}

export default connect(mapStateToProps)(OneDoctor)

const styles = StyleSheet.create({
  doctorBody: {
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    minHeight: 64,
    paddingRight: 18,
    marginLeft: 16,
    // marginRight: 16,
    flexDirection: 'row',
    marginBottom: 8,

    shadowColor: Colors.BLACK_TITLE,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2
    }
  },

  doctorText: {
    color: Colors.BLACK_TITLE_BTN,
    fontSize: 16,
    alignSelf: 'center',

  }
});


OneDoctor.propTypes = {
  doctorData: PropTypes.object.isRequired,
  handleChoosingDoctor: PropTypes.func.isRequired,
  hasCheckBox: PropTypes.bool.isRequired,

};

OneDoctor.defaultProps = {
  doctorData: {
    id: 'doctor-id',
    firstName: 'Название доктора',
    lastName: 'Название доктора',
    createdByUser: 'Пользователь который создал',
    cellPhone: '',
    addCellPhone: '',
    jobLocation: '',
    rating: '',
    specializations: [],
    checked: false,
  },
  hasCheckBox: false
};
