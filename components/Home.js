import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Button,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-navigation'
import * as Colors from '../utils/colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {signOut, getUIDfromFireBase} from '../utils/API'
import {setAuthedUserID, getAuthedUserAction} from '../actions/authedUser'
import Avatar from './Avatar'



class Home extends Component{

  constructor(props){
    super(props);

  }



  static navigationOptions = ({navigation}) => {

    return {
      title: 'Home',
      headerRight: (
        <Avatar/>
      ),
      headerStyle: {
        height:80,

      }

    }
  };


  componentDidMount(){

    const uid = getUIDfromFireBase();
    this.props.dispatch(setAuthedUserID(uid));
  }


  handleLogOut = () => {
    const {navigation} = this.props;
    signOut(navigation);
  };

  render(){
    return(
      <SafeAreaView style={styles.container}>
        <Text style={{textAlign: 'center'}}>HOME component</Text>
        <TouchableOpacity
          onPress={this.handleLogOut}
          style={[styles.submitBtn, styles.firstBtn]}
        >
          <Text style={styles.submitBtnText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}
function mapStateToProps (state) {
  const { currentUserUID, currentUserData } = state.authedUser;
  const {photoURL} = currentUserData;


  return {
    currentUserUID,
    currentUserData,
    currentUserPhotoURL: photoURL || 'nothing'
  }
}

export default connect(mapStateToProps)(Home);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
  },

  submitBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.DARK_CERULEAN,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },

  firstBtn: {
    marginTop: 30,
  },

  submitBtnText: {
    ...Platform.select({
      ios: {
        textTransform: 'uppercase',
      }
    }),
    textAlign: 'center',
    color: Colors.ISABELLINE,
  }


});

