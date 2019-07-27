import React, {Component} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native'
import {withNavigation} from 'react-navigation'
import * as Colors from "../../utils/colors";
import {Icon} from 'react-native-elements'



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
       <View style={{width: 72, height: 36, backgroundColor: Colors.TAB_NAVIGATION_BG, position: 'absolute', bottom: 0, overflow: 'hidden'}}>
        <View style={{width: 72, height: 72, borderRadius: 36, borderWidth: 1, backgroundColor: 'white', borderColor: Colors.TAB_NAVIGATION_BORDER, position: 'absolute', top: -36}}>

        </View>
       </View>
       <View style={styles.buttonBorder}>
         <TouchableOpacity
           style={styles.addButton}
           onPress={this.handlePressBtn}>
           <Image
            source={require('../../assets/tab_navigation_ico/add_button_plus.png')}
            style={{position: 'absolute', left: '50%', marginLeft: -10, top: '50%', marginTop: -10, width: 20, height: 20}}
           />
           {/*<Icon*/}
           {/*  name='plus'*/}
           {/*  type='font-awesome'*/}
           {/*  color={Colors.WHITE}*/}
           {/*  size={20}*/}
           {/*  containerStyle={{position: 'absolute', left: '50%', marginLeft: -8, top: '50%', marginTop: -10}}*/}
           {/*/>*/}

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
