import React, {Component} from 'react'
import {View, Text} from 'react-native'

import {ButtonGroup} from "react-native-elements"
import * as Colors from "../../../utils/colors";


class CustomButtonGroup extends Component{


  render(){

    const {updateIndex, buttons, selectedIndex} = this.props;

    return (
      <ButtonGroup
        onPress={(selectedIndex) => updateIndex(selectedIndex)}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{width: 272, borderWidth: 0, backgroundColor: 'transparent', paddingTop: 0, margin: 0}}
        textStyle={{fontSize: 14, fontWeight: 'bold'}}
        selectedTextStyle={{color: Colors.MAIN_GREEN}}
        selectedButtonStyle={{backgroundColor: Colors.PROFILE_HEAD_BG, borderRadius: 32}}
        innerBorderStyle={{width: 0}}
      />
    )
  }
}

export default CustomButtonGroup
