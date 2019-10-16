// It IS NOT FINISHED COMPONENT FOR THE 'SAVE' BUTTON IN THE HEADER.


import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native'
import * as Colors from "../../../utils/colors";

class HeaderSaveBtn extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }

  render() {
    return (
      <TouchableHighlight
        underlayColor={'transparent'}
        onPress={this.handlePressBtn}
        style={{paddingRight: 8}}
      >
        <Text
          style={{fontSize: 17, color: Colors.DARK_GREEN}}
        >Сохранить</Text>
      </TouchableHighlight>
    )
  }


}

export default HeaderSaveBtn

const styles = StyleSheet.create({});
