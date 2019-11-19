
import firebase from 'react-native-firebase'
import {Alert} from 'react-native';
import {TWITTER_LOGIN_ERROR} from '../utils/systemMessages'
import {NativeModules} from 'react-native'

const  { RNTwitterSignIn }  = NativeModules;
const { TwitterAuthProvider } = firebase.auth;

const TwitterKeys = {
  TWITTER_CONSUMER_KEY: 'WYiBKZjVfH15E5eauHas8uKjC',
  TWITTER_CONSUMER_SECRET: '0tSO7z9pFi37hNbEJ06VJTPFDA5nNAL04rrtGN6aWmb8wVnc61'
};


export async function twitterLogin() {
  try {
    RNTwitterSignIn.init(TwitterKeys.TWITTER_CONSUMER_KEY, TwitterKeys.TWITTER_CONSUMER_SECRET);
    const loginData = await RNTwitterSignIn.logIn();
    const { authToken, authTokenSecret } = loginData;
    const credential = TwitterAuthProvider.credential(authToken, authTokenSecret);


    const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

    console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    return (firebaseUserCredential.user.toJSON());


  } catch (e) {
    console.log('Twitter login error: ', e);
    Alert.alert(
      TWITTER_LOGIN_ERROR.title,
      TWITTER_LOGIN_ERROR.message,
      [
        {text: TWITTER_LOGIN_ERROR.buttonText}
      ],
      {cancelable: false}
    )
  }
}

export async function joinTwitter() {
 try {
   RNTwitterSignIn.init(TwitterKeys.TWITTER_CONSUMER_KEY, TwitterKeys.TWITTER_CONSUMER_SECRET);
   const loginData = await RNTwitterSignIn.logIn();
   const { authToken, authTokenSecret } = loginData;
   const credential = TwitterAuthProvider.credential(authToken, authTokenSecret);

   return  firebase.auth().currentUser.linkWithCredential(credential)
 } catch (e) {
   console.log('Twitter login error: ', e);
   Alert.alert(
     TWITTER_LOGIN_ERROR.title,
     TWITTER_LOGIN_ERROR.message,
     [
       {text: TWITTER_LOGIN_ERROR.buttonText}
     ],
     {cancelable: false}
   )
 }
}
