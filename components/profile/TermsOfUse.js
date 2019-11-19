import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from "../../utils/colors";

class TermsOfUse extends Component {

  constructor(props) {
    super(props);

    this.state = {}

  }


  static navigationOptions = ({navigation}) => {

    return {
      headerTitle: () => <Text style={{fontSize: 14, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Пользовательское соглашение</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderTopWidth: 1,
        borderTopColor: Colors.TAB_NAVIGATION_BORDER,

      }
    }
  };

  render() {
    return (
      <View>
        <Text>TermOfUse component</Text>
      </View>
    )
  }


}

export default TermsOfUse

const styles = StyleSheet.create({});
