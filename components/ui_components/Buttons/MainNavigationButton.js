import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native'
import {withNavigation} from 'react-navigation'
import * as Colors from "../../../utils/colors";
import {Icon} from 'react-native-elements/src/index'



class MainNavigationButton extends Component{
  constructor(props){
    super(props);
  }

  handlePressBtn = () => {
    console.log('press');
    const {navigation} = this.props;
    const tabIndex = navigation.state.index;

    switch (tabIndex) {
      case 0:
        navigation.navigate('CreateNote');
        break;

      case 1:
        console.log('Tests Tab');
        navigation.navigate('CreateTest');
        break;

      case 2:
        console.log('Pills Tab');
        navigation.navigate('CreatePill');
        break;

      case 3:
        console.log('Doctors Tab');
        navigation.navigate('CreateDoctor');
        break;

      default:
        break;

    }
  };

  render() {

    return (
     <View style={styles.addButtonContainer}>
       <View style={styles.buttonBorder}>
         <TouchableOpacity
           style={styles.addButton}
           onPress={this.handlePressBtn}>
           <Image
            source={require('../../../assets/tab_navigation_ico/add_button_plus.png')}
            style={{position: 'absolute', left: '50%', marginLeft: -10, top: '50%', marginTop: -10, width: 20, height: 20}}
            resizeMode='cover'
            PlaceholderContent={<ActivityIndicator />}
           />

         </TouchableOpacity>

       </View>
     </View>
    )
  }
}

export default withNavigation(MainNavigationButton);

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    left: '50%',
    top: -1,
    marginLeft: -36,
    backgroundColor: 'transparent',
    height: 36,
    width: 72,
    borderTopWidth: 1,
    borderTopColor: Colors.WHITE,
    // borderRadius: 72,
  },

  buttonBorder: {
    position: 'absolute',
    left: '50%',
    marginLeft: -36,
    top: 0,
    marginTop: -36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(95, 218, 156, 0.2)",
  },

  addButton: {
    position: 'absolute',
    left: '50%',
    marginLeft: -32,
    top: '50%',
    marginTop: -32,
    width: 64,
    height: 64,
    zIndex: 100,
    backgroundColor: Colors.GREEN_ADD_BTN,
    borderRadius: 32,
  },

});
