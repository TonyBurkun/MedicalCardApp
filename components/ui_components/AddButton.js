import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import * as Colors from "../../utils/colors";
import {Icon} from 'react-native-elements'

import SceneView from "react-navigation/src/views/SceneView";


export default class AddButton extends Component{

  handlePressBtn = () => {
    console.log('press');
  };

  render() {

    return (
     <View style={styles.addButtonContainer}>
       <View style={{width: 72, height: 36, backgroundColor: Colors.TAB_NAVIGATION_BG, position: 'absolute', bottom: 0, overflow: 'hidden'}}>
        <View style={{width: 72, height: 72, borderRadius: 36, borderWidth: 1, backgroundColor: 'white', borderColor: Colors.TAB_NAVIGATION_BORDER, position: 'absolute', top: -36}}>

        </View>
       </View>
       <View style={styles.buttonBorder}>
         <TouchableOpacity
           style={styles.addButton}
           onPress={this.handlePressBtn}>
           <Icon
             name='plus'
             type='font-awesome'
             color={Colors.WHITE}
             size={20}
             containerStyle={{position: 'absolute', left: '50%', marginLeft: -8, top: '50%', marginTop: -10}}
           />

         </TouchableOpacity>

       </View>
     </View>
    )
  }
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    left: '50%',
    top: -36,
    marginLeft: -36,
    backgroundColor: 'white',
    height: 72,
    width: 72,
    borderRadius: 72,
  },

  buttonBorder: {
    position: 'absolute',
    left: '50%',
    marginLeft: -30,
    top: '50%',
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(95, 218, 156, 0.2)",
  },

  addButton: {
    position: 'absolute',
    left: '50%',
    marginLeft: -26,
    top: '50%',
    marginTop: -26,
    width: 52,
    height: 52,
    zIndex: 100,
    backgroundColor: Colors.GREEN_ADD_BTN,
    borderRadius: 26,
  },

});
