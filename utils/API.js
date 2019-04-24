import firebase from 'react-native-firebase'
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ACCOUNT_NOT_FOUND, LOGIN_FAILED, EMAIL_CONFIRMATION, SUBMIT_RECOVERY_PASS} from '../utils/systemMessages'
import {USER_TOKEN_LOCAL_STORAGE_KEY} from '../utils/textConstants'



//-- Work with AsyncStorage ----------

export function addUserTokenToAsyncStorage(key, value){

  return (
    AsyncStorage.setItem(key, value)
      .then(() => {
        return true
      })
      .catch((error) => {
        console.log(error);
      })
  )
}

export function removeTokeFromAsyncStorage(key){
  return (
    AsyncStorage.removeItem(key)
      .catch(error => {
        console.log(error);
      })
  )
}

//-- End AsyncStorage -----------------------------




//-- FireBase  ------------------------


export function sentVerificationEmail() {
  firebase.auth().currentUser.sendEmailVerification()
    .then(function() {
    // Email sent.
  }, function(error) {
    // An error happened.

    console.log('Error happened in sent Verification Email process: ', error);
  });
}

// export function writeUserDataToDB (uid, email, fname = '',lname= '', displayName='', photoURL =''){
//   uid = uid || getUIDfromFireBase();
//   email = email || ''; //for some reason the email is not added to firebase without this line
//   firebase.database().ref('Users/' + uid).set({
//     email,
//     fname,
//     lname,
//     displayName,
//     photoURL,
//     setUpProfile: false
//   }).then((data)=>{
//     //success callback
//   }).catch((error)=>{
//     //error callback
//     console.log('error ' , error)
//   })
// }

export function createUserbyIDinDB (){
  const uid = getUIDfromFireBase();
  firebase.database().ref('Users/' + uid).set({
    setUpProfile: false
  })
    .then((data)=>{
    console.log('user successfully created in DB: ', data)
      //success callback
    }).catch((error)=>{
    //error callback
    console.log('error ' , error)
  })
}


export async function saveUserAvatarToStorage (localUri){
  //localUri - local link on the image from device


  const userId = getUIDfromFireBase();
  console.log(userId);
  const downloadURL = await firebase
    .storage()
    .ref(`users-avatar/${userId}/userAvatar.jpg`)
    .putFile(
      localUri
    );

  console.log(downloadURL);

  return downloadURL;

}


export function updateUserData (fieldsForUpdateObj){
  const uid = getUIDfromFireBase();

  for (let key in fieldsForUpdateObj){
    if (fieldsForUpdateObj.hasOwnProperty(key)) {
      firebase.database().ref('Users/' + uid).update({
        [key]: fieldsForUpdateObj[key]
      }).then((data)=>{
        //success callback
      }).catch((error)=>{
        //error callback
        console.log('error ' , error)
      })
    }
  }
}


export function signInWithEmailAndPassword(email, password){
  return firebase.auth().signInWithEmailAndPassword(email, password);
}


export function registrationWithEmailAndPassword(email, password, navigation){
  // const displayName = firstName + ' ' + secondName;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(data => {
      console.log('data ', data);
      // const uid = data.user._user.uid;

      createUserbyIDinDB();

      // writeUserDataToDB(uid, email, firstName, secondName, displayName, undefined);

      sentVerificationEmail();

      Alert.alert(
        EMAIL_CONFIRMATION.title,
        EMAIL_CONFIRMATION.message,
        [
          {text: EMAIL_CONFIRMATION.buttonText}
        ],
        {cancelable: false}
      );

      navigation.navigate('Login');

    })
    .catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
}


export function sendPasswordResetEmail(email, actionCodeSettings, navigation){
  firebase.auth().sendPasswordResetEmail(email, actionCodeSettings)
    .then(response => {

      Alert.alert(
        SUBMIT_RECOVERY_PASS.title,
        SUBMIT_RECOVERY_PASS.message,
        [
          {text: SUBMIT_RECOVERY_PASS.buttonText}
        ],
        {cancelable: false}
      );


      navigation.navigate('Login');
    })
    .catch(error => {
      console.log(error);
    })
}

export function signOut(navigation){
  firebase.auth().signOut()
    .then((data) => {
      removeTokeFromAsyncStorage(USER_TOKEN_LOCAL_STORAGE_KEY)
        .then(() => {
          navigation.navigate('Login');
        });
    })
}

export function getUIDfromFireBase(){
  return (
    firebase.auth().currentUser.uid
  )
}

export function handleUserData(data) {
  // This function using for writing the user data to DB
  // and save RefreshToken on the device after Sign In via social networks.

  if (data) {
    const {refreshToken} = data;
    addUserTokenToAsyncStorage(USER_TOKEN_LOCAL_STORAGE_KEY, refreshToken);

    const fieldsForUpdateObj = {
      email: data.email,
      name: data.displayName,
      avatarURL: data.photoURL
    };

    createUserbyIDinDB();
    updateUserData(fieldsForUpdateObj);



  }
}


export async function isUserExistInDB() {
  const uid = getUIDfromFireBase();
  const snapshotDB = await firebase.database().ref('Users/' + uid).once('value');
  const isUserExistInDB = snapshotDB.exists();

  // console.log(isUserExistInDB);

  return isUserExistInDB ? true : false;

}



export async function checkSetUpParamInUser() {
  const uid = getUIDfromFireBase();

  const snapshotDB = await firebase.database().ref('Users/' + uid).once('value');
  // console.log(snapshotDB);
  const isSetUpParamInUser = snapshotDB.val().setUpProfile;

  return (isSetUpParamInUser) ? true : false;
}

export function isUserAuth(){
  const isUserAuth = firebase.auth().currentUser;
  return isUserAuth ? true : false;
}



export async function getMetricsByTitle(nameMetric){
 const snapshotDB = await firebase.database().ref('Metrics/'+ nameMetric).once('value');

 return snapshotDB.val();
}


//-- End FireBase  -----------------------------
