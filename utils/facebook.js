import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'
import {Alert} from 'react-native';
import {
  FACEBOOK_EMAIL_EXIST,
  SOCIAL_NETWORK_ALREADY_LINKED,
  SOCIAL_NETWORK_SUCCESS_LINKED
} from '../utils/systemMessages'



export async function facebookLogin() {
  try {
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      // handle this however suites the flow of your app
      // throw new Error('User cancelled request');
      return
    }

    // console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

    // get the access token
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      // handle this however suites the flow of your app
      throw new Error('Something went wrong obtaining the users access token');
    }

    // create a new firebase credential with the token
    const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

    // login with credential
    const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

    console.log(firebaseUserCredential.user.toJSON());

    return firebaseUserCredential.user.toJSON();

  } catch (e) {

    if (e.code === 'auth/account-exists-with-different-credential') {
      Alert.alert(
        FACEBOOK_EMAIL_EXIST.title,
        FACEBOOK_EMAIL_EXIST.message,
        [
          {text: FACEBOOK_EMAIL_EXIST.buttonText}
        ],
        {cancelable: false}
      )
    }

  }
}



export async function joinFacebook() {
  try {
    return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          return Promise.reject(new Error('The user cancelled the request'))
        }
        // Retrieve the access token
        return AccessToken.getCurrentAccessToken()
      })
      .then((data) => {
        // Create a new Firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

        // Link using the credential
        return firebase.auth().currentUser.linkWithCredential(credential)
      })
  }
  catch(error) {
    console.log('Join Facebook error: ', error)
  }
}
