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
import commonStyles from '../utils/commonStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {signOut, getUIDfromFireBase, getCurrentUserData} from '../utils/API'
import {setAuthedUserID, getAuthedUserAction} from '../actions/authedUser'
import Avatar from './Avatar'
import InternetNotification from '../components/ui_components/InternetNotification'
import CalendarIcon from '../components/ui_components/CalendarIcon'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';





class Notes extends Component{

  constructor(props){
    super(props);
  }

  componentDidMount(){

    const uid = getUIDfromFireBase();
    this.props.dispatch(setAuthedUserID(uid));


    console.log(this.props);

    const currentUserDataObj = this.props.currentUserData;
    if (!Object.keys(currentUserDataObj).length) {
      getCurrentUserData()
        .then(data => {
          console.log(data);
          this.props.dispatch(getAuthedUserAction(data));
        })
        .catch(error => {console.log('can not get Current User Data: ', error)});
    }

  }


  handleLogOut = () => {
    const {navigation} = this.props;
    signOut(navigation);
  };

  render(){
    return(
      <SafeAreaView style={[styles.container, {backgroundColor: Colors.WHITE}]}>
        <InternetNotification topDimension={0}/>
        {/*<Text style={{textAlign: 'center'}}>HOME component</Text>*/}
        {/*<TouchableOpacity*/}
        {/*  onPress={this.handleLogOut}*/}
        {/*  style={[styles.submitBtn, styles.firstBtn]}*/}
        {/*>*/}
        {/*  <Text style={styles.submitBtnText}>Log Out</Text>*/}
        {/*</TouchableOpacity>*/}

        <View style={{flex: 1, position: 'relative'}}>
          <Text style={styles.mainText}>Здесь будут отображаться Ваши записи, которые Вы создадите</Text>
          <Image
            style={styles.personImage}
            source={require('../assets/person/notes.png')}/>
          <View style={styles.tipWrapper}>
            <Text style={styles.tipText}>Создайте запись</Text>
            <Image
              style={styles.tipArrow}
              source={require('../assets/vector/notes_vector.png')}/>

          </View>
        </View>
      </SafeAreaView>
    )
  }
}
function mapStateToProps (state) {

  console.log(state);

  const { currentUserUID, currentUserData } = state.authedUser;
  const {photoURL} = currentUserData;


  return {
    currentUserUID,
    currentUserData,
    currentUserPhotoURL: photoURL || ''
  }
}

export default connect(mapStateToProps)(Notes);


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
  },

  mainText: {
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    top: '15%',
    paddingLeft: 35,
    paddingRight: 35,
  },

  personImage: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    width: wp('43%'),
    height: hp('55%')
  },

  tipWrapper: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -140,
    width: 140,
    height: 90,
  },

  tipText: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GREEN_TIP
  },

  tipArrow: {
    width: 39,
    height: 62,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    // marginLeft: -31,
  }





});

