import React, { Component } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator} from 'react-native'
import {Image} from 'react-native-elements'
import { SafeAreaView, withNavigation, withNavigationFocus } from 'react-navigation'
import * as Colors from '../../utils/colors'
import {connect} from 'react-redux'

import InternetNotification from '../ui_components/InternetNotification'
import commonStyles from "../../utils/commonStyles";
import ProfileListBtn from '../ui_components/ProfileListBtn'
import GroupButtonsTitle from '../ui_components/GroupButtonsTitle'
import {signOut} from "../../utils/API";
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper/index";
import {updateCurrentUserData} from "../../actions/authedUser";

const {height} = Dimensions.get('window');

class Profile extends Component{

  constructor(props){
    super(props);

    const statusBarHeight = getStatusBarHeight();
    const bottomSpace = getBottomSpace();

    this.state = {
      screenHeight: statusBarHeight + bottomSpace,
    };
  }



  static navigationOptions = ({navigation}) => {

    return {
      headerTitle: () => <Text style={{flex: 1, textAlign: 'left', fontSize: 30, fontWeight: 'bold', color: Colors.WHITE}}>Профиль</Text>,
      headerTintColor: Colors.WHITE,
      headerStyle: {
        backgroundColor: Colors.PROFILE_HEAD_BG,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
    }
  };



  handlePressLabelBtn = () => {
    this.props.navigation.navigate('LabelsList');
    // this.props.navigation.navigate('LabelsList', {navType: 'showAddCancelBtn'});
  };

  handleLogOut = () => {
    const {navigation} = this.props;
    this.props.dispatch(updateCurrentUserData({}));
    signOut(navigation);
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      ...this.state,
      screenHeight: this.state.screenHeight + contentHeight
    })
  };



  render() {
    const scrollEnabled = this.state.screenHeight > height;
    const {currentUserData} = this.props;
    const name = currentUserData.name || '';
    const surname = currentUserData.surname || '';
    let medicalCardID = null;
    if (Boolean(currentUserData.medicalCardsList)){
      medicalCardID = currentUserData.medicalCardsList[0];
    }


    // console.log(this.state);
    // console.log(this.props);
    // console.log(currentUserData);


    let image = this.props.currentUserPhotoURL;


    return (
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>
        <View style={styles.topHeader}>
          <View style={{flexDirection: 'row', marginTop: 24}}>
            <View>
              <Image
                style={styles.headerAvatar}
                source={{uri: image + '?width=100&height=100'}}
                resizeMode='cover'
                PlaceholderContent={<ActivityIndicator />}
              />
            </View>
            <View style={styles.nameBlockWrapper}>
              <Text style={styles.nameText}>{`${name} ${surname}`}</Text>
              <Text style={styles.profileText}>АКТИВНЫЙ ПРОФИЛЬ</Text>
            </View>
          </View>
          <View style={styles.btnBlockWrapper}>
            <TouchableOpacity
              onPress={()=>{this.props.navigation.navigate('ProfileData', {username: `${name} ${surname}`,})}}
              style={styles.transparentBtn}>
              <Text style={styles.transparentBtn__label}>ДАННЫЕ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {this.props.navigation.navigate('ProfileMedicalCard', {profile: true, medicalCardID: medicalCardID})}}
              style={styles.transparentBtn}>
              <Text style={styles.transparentBtn__label}>МЕД. КАРТА</Text>
            </TouchableOpacity>
          </View>
        </View>


        <ScrollView
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
          <View style={commonStyles.container}>

            <GroupButtonsTitle title={'СИСТЕМА'}/>
            <ProfileListBtn title={'Метки'} iconType = {'label'} onPressAction={this.handlePressLabelBtn}/>

            <GroupButtonsTitle title={'БЕЗОПАСНОСТЬ'}/>

            <GroupButtonsTitle title={'НАСТРОЙКИ'}/>
            <ProfileListBtn title={'Выход'} iconType = {'logout'} onPressAction={this.handleLogOut}/>
          </View>
        </ScrollView>

      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {

  const {currentUserUID, currentUserData} = state.authedUser;
  const {avatarURL} = currentUserData;
  return {
    currentUserPhotoURL: avatarURL || '',
    currentUserData: currentUserData,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(Profile));

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: Colors.MAIN_BACKGROUND
  },

  topHeader: {
    backgroundColor: Colors.PROFILE_HEAD_BG,
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  headerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32
  },

  nameBlockWrapper: {
    alignSelf: 'center',
    paddingLeft: 16
  },

  nameText: {
    fontSize: 21,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  profileText: {
    color: Colors.DARK_GREEN,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 5,
  },

  btnBlockWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: -8,
    marginRight: -8,
    marginTop: 13,
    marginBottom: 16,

  },

  transparentBtn: {
    flexGrow: 1,
    height:48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.WHITE,
    borderRadius: 14,
    backgroundColor: 'transparent',
    marginLeft: 8,
    marginRight: 8,
  },

  transparentBtn__label: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold'
  },

  listItemsWrapper: {
    // borderWidth: 1,
    // backgroundColor: Colors.MAIN_BACKGROUND
  },


});
