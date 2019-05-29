import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, TextInput, StyleSheet, NetInfo, Dimensions, Animated,} from 'react-native'
import commonStyles from '../../utils/commonStyles'
import * as Colors from '../../utils/colors'
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
import {INTERNET_CONNECTION} from '../../utils/systemMessages'
import ScreenTitle from "./ScreenTitle";


const {width} = Dimensions.get('window');

export default class InternetNotification extends Component {
  constructor() {
    super();
    this.state = {
      internetStatus: true,
      initScreen: true,

      animationState: {
        height: new Animated.Value(0),
      }
    };

    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({internetStatus: isConnected});
      if (!isConnected) {
        Animated.timing(
          this.state.animationState.height,
          {
            toValue: 49,
            duration: 300
          }
        ).start();
      }


    });
  }

  componentDidMount(){
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  handleConnectionChange = (isConnected) => {
    const {initScreen} = this.state;
    this.setState({internetStatus: isConnected});

    if (initScreen) {
      this.setState({
        initScreen: !this.state.initScreen
      });

      if (!isConnected) {
        Animated.timing(
          this.state.animationState.height,
          {
            toValue: 49,
            duration: 300
          }
        ).start();
      }
    } else {

      if (isConnected) {
        Animated.sequence([
          Animated.timing(
            this.state.animationState.height,
            {
              toValue: 49,
              duration: 300
            }
          ), Animated.timing(
            this.state.animationState.height,
            {
              toValue: 0,
              duration: 300,
              delay: 2000
            }
          )
        ]).start();
      } else {
        console.log('should be shown the error notification');
        Animated.timing(
          this.state.animationState.height,
          {
            toValue: 49,
            duration: 300
          }
        ).start();
      }
    }
  };



  render() {

    const animatedHeight = {height: this.state.animationState.height};
    const {topDimension} = this.props;

    return (
     <View style={{position: 'absolute', left: 0, top: topDimension, width: width, zIndex: 1}}>
       {this.state.internetStatus ?
         <Animated.View style={[{ backgroundColor: Colors.MAIN_GREEN, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}, animatedHeight ]}>
            <Text style={{color: Colors.WHITE, textAlign: 'center'}}>{INTERNET_CONNECTION.exist}</Text>
         </Animated.View>
           :
         <Animated.View style={[{backgroundColor: Colors.LIGHT_CARMINE_PINK, height: 0, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}, animatedHeight]}>
           <Text style={{color: Colors.WHITE, textAlign: 'center'}}>{INTERNET_CONNECTION.lost}</Text>
         </Animated.View>
       }
     </View>
    );
  }
}

InternetNotification.propTypes = {
  topDimension: PropTypes.number,

};

InternetNotification.defaultProps = {
  topDimension: getStatusBarHeight() + 14,

};

const styles = StyleSheet.create({});
