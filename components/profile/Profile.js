import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native'
import {Image} from 'react-native-elements'
import { SafeAreaView, withNavigation, withNavigationFocus } from 'react-navigation'
import * as Colors from '../../utils/colors'
import {connect} from 'react-redux'

import commonStyles from "../../utils/commonStyles";
import ProfileListBtn from '../ui_components/Buttons/ProfileListBtn'
import ProfileListBtnChangeStatus from "../ui_components/Buttons/ProfileListBtnChangeStatus";
import GroupButtonsTitle from '../ui_components/titles/GroupButtonsTitle'
import {getCurrentUserData, signOut} from "../../utils/API";
import {getBottomSpace, getStatusBarHeight} from "react-native-iphone-x-helper/index";

import {updateCurrentUserData} from "../../actions/authedUser";

const {height} = Dimensions.get('window');
import firebase from 'react-native-firebase'
import {SOCIAL_NETWORK_ALREADY_LINKED, SOCIAL_NETWORK_SUCCESS_LINKED} from "../../utils/systemMessages";

import {joinTwitter} from "../../utils/twitter";
import {joinFacebook} from "../../utils/facebook";





class Profile extends Component{

  constructor(props){
    super(props);

    const statusBarHeight = getStatusBarHeight();
    const bottomSpace = getBottomSpace();

    this.state = {
      screenHeight: statusBarHeight + bottomSpace,
      facebookProvider: false,
      twitterProvider: false,
      emailProvider: false,
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

  componentDidMount() {
    const providerDataArr = firebase.auth().currentUser.providerData;
    console.log(providerDataArr);
    console.log(this.props);
    const {currentUserData} = this.props;
    console.log(currentUserData);

    getCurrentUserData()
      .then(data => {
        this.props.dispatch(updateCurrentUserData(data));
      });


    providerDataArr.forEach((item) => {
      switch (item.providerId) {
        case 'facebook.com':
          this.setState({
            facebookProvider: true
          });
          break;

        case 'twitter.com':
          this.setState({
            twitterProvider: true
          });
          break;

        case 'password':
          this.setState({
            ...this.state,
            emailProvider: true,
            email: item.email
          });
          break;

        default: return



      }
    })


  }



  handlePressLabelBtn = () => {
    this.props.navigation.navigate('LabelsList');
  };

  handleFacebookJoin = () => {
    joinFacebook()
      .then(() => {
        Alert.alert(
          SOCIAL_NETWORK_SUCCESS_LINKED.title,
          SOCIAL_NETWORK_SUCCESS_LINKED.message,
          [
            {text: SOCIAL_NETWORK_SUCCESS_LINKED.buttonText}
          ],
          {cancelable: false}
        );

        this.setState({
          facebookProvider: true
        });
      })
      .catch((error) => {
        const { code, message } = error;
        if (code === 'auth/provider-already-linked') {
          Alert.alert(
            SOCIAL_NETWORK_ALREADY_LINKED.title,
            SOCIAL_NETWORK_ALREADY_LINKED.message,
            [
              {text: SOCIAL_NETWORK_ALREADY_LINKED.buttonText}
            ],
            {cancelable: false}
          )
        }
      })
  };

  // handleTwitterJoin = async () => {
  //   joinTwitter()
  //     .then( () => {
  //       Alert.alert(
  //         SOCIAL_NETWORK_SUCCESS_LINKED.title,
  //         SOCIAL_NETWORK_SUCCESS_LINKED.message,
  //         [
  //           {text: SOCIAL_NETWORK_SUCCESS_LINKED.buttonText}
  //         ],
  //         {cancelable: false}
  //       );
  //
  //       this.setState({
  //         twitterProvider: true
  //       });
  //     })
  //     .catch(error => {
  //       const { code, message } = error;
  //       if (code === 'auth/provider-already-linked') {
  //         Alert.alert(
  //           SOCIAL_NETWORK_ALREADY_LINKED.title,
  //           SOCIAL_NETWORK_ALREADY_LINKED.message,
  //           [
  //             {text: SOCIAL_NETWORK_ALREADY_LINKED.buttonText}
  //           ],
  //           {cancelable: false}
  //         )
  //       }
  //     })
  // };

  // handleEmailJoin = () => {
  //   console.log('EMAIL JOIN');
  //   this.props.navigation.navigate('ChangeEmail');
  // };

  handleProblem = () => {
    Linking.openURL('mailto:medicalcard.app@gmail.com')
      .then(supported => {
        if (!supported) {
          console.log('Cant handle url')
        } else {
          return Linking.openURL('message:')
        }
      })
      .catch(err => {
        console.error('An error occurred', err)
      })
  };

  handlePolicy = () => {
    this.props.navigation.navigate('TermsOfUse');
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
    console.log(this.state);

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
          scrollEnabled={true}
          onContentSizeChange={this.onContentSizeChange}
        >
          <View style={[commonStyles.container, {paddingBottom: 0}]}>

            <GroupButtonsTitle title={'СИСТЕМА'}/>
            <ProfileListBtn title={'Метки'} iconType = {'label'} onPressAction={this.handlePressLabelBtn}
            />

            <GroupButtonsTitle title={'БЕЗОПАСНОСТЬ'}/>
            <ProfileListBtnChangeStatus title={'Facebook'}
                            iconType = {'fb'}
                            active={this.state.facebookProvider}
                            onPressAction={this.handleFacebookJoin}/>

            {/*<ProfileListBtnChangeStatus title={'Twitter'}*/}
            {/*                            iconType = {'twitter'}*/}
            {/*                            active={this.state.twitterProvider}*/}
            {/*                            onPressAction={this.handleTwitterJoin}/>*/}

            {/*<ProfileListBtnChangeStatus title={'Email'}*/}
            {/*                            iconType = {'email'}*/}
            {/*                            active={this.state.emailProvider}*/}
            {/*                            onPressAction={this.handleEmailJoin}*/}
            {/*                            value={this.state.email}/>*/}



            <GroupButtonsTitle title={'НАСТРОЙКИ'}/>

            <ProfileListBtn title={'Сообщить о проблеме'} iconType = {'problem'} onPressAction={this.handleProblem}/>
            <ProfileListBtn title={'Пользовательское соглашение'} iconType = {'policy'} onPressAction={this.handlePolicy}/>
            <ProfileListBtn title={'Выход'} iconType = {'logout'} onPressAction={this.handleLogOut}/>

            <View style={{marginTop: 26, flexDirection: 'row'}}>
              <View style={{width: '60%'}}>
                <View>
                  <Text style={{fontSize: 21, color: Colors.TYPOGRAPHY_COLOR_DARK, fontWeight: 'bold'}}>👋 Пообщаемся?</Text>
                </View>
                <Text style={{fontSize: 12, color: Colors.TYPOGRAPHY_COLOR_DARK, marginTop: 10}}>
                  Мы с удовольствием выслушаем Ваши предложения и проблемы.
                </Text>
                <Text style={{fontSize: 12, color: Colors.TYPOGRAPHY_COLOR_DARK, marginTop: 10}}>
                  Мы очень надеемся стать Вашим другом в сети.
                </Text>

                <View style={{marginTop: 15}}>
                  <TouchableOpacity style={{width: 200, height: 48, backgroundColor: Colors.FB_COLOR, borderRadius: 14, position: 'relative', justifyContent: 'center'}}>
                    <Image
                      style={{width: 32, height: 32, position: 'absolute', left: 8, top: -9}}
                      source={ require('../../assets/profile/fb-icon.png')}
                    />
                    <Text style={{fontSize: 12, color: Colors.WHITE, alignSelf: 'center'}}>FACEBOOK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 200,
                      height: 48,
                      marginTop: 16,
                      backgroundColor: Colors.WHITE,
                      borderRadius: 14, borderColor: Colors.MAIN_GREEN, borderWidth: 1,
                      position: 'relative', justifyContent: 'center',
                      shadowColor: Colors.BLACK_TITLE,
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      shadowOffset: {
                        height: 1,
                        width: 1
                      },
                    }}>
                    <Image
                      style={{width: 32, height: 32, position: 'absolute', left: 8, top: -2}}
                      source={ require('../../assets/profile/app-store.png')}
                    />
                    <Text style={{width: 105, textAlign: 'center', fontSize: 12, color: Colors.MAIN_GREEN, alignSelf: 'center'}}>ОЦЕНИТЕ НАС В APP STORE</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{marginTop: 18, fontSize: 10, color: Colors.DARK_GREEN}}>MED ID  v. 1.0.0 сделано с любовью в Украине</Text>
              </View>
              <View style={{height: 300, width: '40%', overflow: 'hidden'}}>
                <Image
                  style={{width: 130, height: 290, position: 'absolute', right: 0 }}
                  source={ require('../../assets/person/happy_person.png')}
                />
              </View>
            </View>
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
