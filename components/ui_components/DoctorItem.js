import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../utils/colors";
import {Image} from "react-native-elements";
import PropTypes from 'prop-types'
import DateLabel from "./DateLabel";

class DoctorItem extends Component {


  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {
    const {doctorData, doctorsSpecializationsArr} = this.props;
    const currentDoctorSpecializationsID = doctorData.specializations;
    let currentDoctorSpecializationStr = '';

    currentDoctorSpecializationsID.map(item=> {
      currentDoctorSpecializationStr = currentDoctorSpecializationStr + doctorsSpecializationsArr[item] + ', ';
    });

    currentDoctorSpecializationStr = currentDoctorSpecializationStr.slice(0, currentDoctorSpecializationStr.length -2);



    return (
      <View
        style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
        <View
          style={{marginRight: 16, width: 64, height: 64, backgroundColor: Colors.MAIN_BACKGROUND, borderRadius: 32, justifyContent: 'center' }}>
          <Image
            style={{width: 40, height: 40, alignSelf: 'center'}}
            source={require('../../assets/notes/doctors.png')}
          />
        </View>
        <View
          style={{justifyContent: 'center', flexWrap: 'wrap', width: '80%'}}>
          <Text style={{color: Colors.TYPOGRAPHY_COLOR_DARK, fontWeight: 'bold'}}>{doctorData.lastName}</Text>
          <Text style={{color: Colors.GRAY_TEXT, marginTop: 4}}>{currentDoctorSpecializationStr}</Text>
        </View>
      </View>
    )
  }


}

export default DoctorItem

DoctorItem.propTypes = {
  doctorData: PropTypes.object.isRequired,
  doctorsSpecializationsArr: PropTypes.array.isRequired
};

DoctorItem.defaultProps = {

};

const styles = StyleSheet.create({});
