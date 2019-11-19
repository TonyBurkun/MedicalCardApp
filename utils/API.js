import firebase from 'react-native-firebase'
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {EMAIL_CONFIRMATION, SUBMIT_RECOVERY_PASS, RECOVERY_PASS_NO_USER} from '../utils/systemMessages'
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

  console.log(firebase.auth().currentUser);
  firebase.auth().currentUser.sendEmailVerification()
    .then(function() {
      // Email sent.
    }, function(error) {
      // An error happened.

      console.log('Error happened in sent Verification Email process: ', error);
    });
}

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
        EMAIL_CONFIRMATION.message.replace('{email}', email),
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
      Alert.alert(
        RECOVERY_PASS_NO_USER.title,
        RECOVERY_PASS_NO_USER.message,
        [
          {text: RECOVERY_PASS_NO_USER.buttonText}
        ],
        {cancelable: false}
      );
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



export async function getChildhoodDiseases () {
  const snapshotDB = await firebase.database().ref('childhood_diseases/').once('value');

  return snapshotDB.val();
}


export async function getVaccinations () {
  const snapshotDB = await firebase.database().ref('vaccinations/').once('value');
  return snapshotDB.val();
}

export async function getPregnancyOutcome () {
  const snapshotDB = await firebase.database().ref('pregnancy_outcome/').once('value');
  return snapshotDB.val();
}

export async function getGynecologicalDiseases () {
  const snapshotDB = await firebase.database().ref('gynecological_diseases/').once('value');
  return snapshotDB.val();
}

export async function getDisability () {
  const snapshotDB = await firebase.database().ref('disability/').once('value');
  return snapshotDB.val();
}

export async function getBadHabits () {
  const snapshotDB = await firebase.database().ref('badHabits/').once('value');
  return snapshotDB.val();
}

export async function getGenitalInfections () {
  const snapshotDB = await firebase.database().ref('genital_infections/').once('value');
  return snapshotDB.val();
}




export function generateUniqID(){
  let myRef = firebase.database().ref().push();
  let id = myRef.key;

  return id;
}

export function createMedicalCardInDB(id, data) {
  // data - it should be the object. The minimal field is the UID.
  firebase.database().ref('medical_cards/' + id).set(data)
}

export async function getMedicalCardByID(medicalCardID) {
  const snapshotDB = await firebase.database().ref('medical_cards/' + medicalCardID).once('value');

  return snapshotDB.val();
}

export function updateMedicalCardInDB(id, updatedDataObj){
  // firebase.database().reg('medical_cards/'+ medicalCardID).set(updatedDataObj);

  for (let key in updatedDataObj){

    if (updatedDataObj.hasOwnProperty(key)) {
      firebase.database().ref('medical_cards/' + id).update({
        [key]: updatedDataObj[key]
      }).then((data)=>{
        //success callback
      }).catch((error)=>{
        //error callback
        console.log('error ' , error)
      })
    }
  }
}

export async function getCurrentUserData(){
  const uid = getUIDfromFireBase();

  const snapshotDB = await firebase.database().ref('Users/' + uid).once('value');

  return snapshotDB.val();
}

export function addMedicalCardIDtoCurrentUser(medicalCardID){
  getCurrentUserData()
    .then(data => {
      if (!data.medicalCardsList) {
        updateUserData ({ medicalCardsList: [medicalCardID]})

      } else {
        updateUserData ({ medicalCardsList: [...data.medicalCardsList, medicalCardID]})
      }
    })
    .catch(error => {
      console.log('Can not get the CURRENT USER DATA: ', error);
    })
}




//------ LABEL FLOW ------------


export function createNewLabel(labelData){
  const uid = getUIDfromFireBase();

  firebase.database().ref('labels/' + uid + '/' + labelData.id ).set(labelData)
}

export async function getLabelsForUser(){
  const uid = getUIDfromFireBase();

  const snapshotDB = await firebase.database().ref('labels/' + uid).once('value');

  return snapshotDB.val() || {};

}

export  function updateUserLabel(labelID, labelData) {
  const uid = getUIDfromFireBase();

  firebase.database().ref(`labels/${uid}/${labelID}`).update(labelData);

}


export async function removeLabelForCurrentUser(labelID){
  const uid = getUIDfromFireBase();

  await firebase.database().ref(`labels/${uid}/${labelID}`).remove();

}


//------ END LABEL FLOW --------




// --- DOCTORS FLOW --------------


export async function getDoctorSpecializations () {
  const snapshotDB = await firebase.database().ref('doctor_specializations/').once('value');
  return snapshotDB.val();
}

export function createNewDoctor(doctorData){
  firebase.database().ref('doctors/'+ doctorData.id).set(doctorData);
}


export async function getDoctorsList(){
  const snapshotDB = await firebase.database().ref('doctors/').once('value');
  return snapshotDB.val() || {};
}

export  function updateChosenDoctor(doctorID, doctorData) {
  firebase.database().ref(`doctors/${doctorID}`).update(doctorData);
}

export async function deleteDoctorByID(doctorID){
  await firebase.database().ref(`doctors/${doctorID}`).remove();
}





// --- END DOCTORS FLOW -----------
///////////////////////////////////
// -- PILLS FLOW -----------------

export async function getPillsType(){
  const snapshotDB = await firebase.database().ref('pills_type/').once('value');
  return snapshotDB.val();
}

export async function getPillsList(){
  const snapshotDB = await firebase.database().ref('pills/').once('value');
  return snapshotDB.val() || {};
}

export async function getAppPillsList(){
  const snapshotDB = await firebase.database().ref('app_pills/').once('value');
  return snapshotDB.val() || {};
}

export function createNewPill(pillData){
  firebase.database().ref('pills/'+ pillData.id).set(pillData);
  // firebase.database().ref('app_pills/'+ pillData.id).set(pillData);
}

export async function deletePillByID(pillID){
  await firebase.database().ref(`pills/${pillID}`).remove();
}

export  function updateChosenPill(pillID, pillData) {
  firebase.database().ref(`pills/${pillID}`).update(pillData);
}



export async function savePillImageToStorage (imageID, localUri){
  //localUri - local link on the image from device

  const downloadURL = await firebase
    .storage()
    .ref(`pill-images/${imageID}/${imageID}.jpg`)
    .putFile(
      localUri
    );

  console.log(downloadURL);

  return downloadURL;

}

export async function removePillImages(imageName) {
  await firebase.storage()
    .ref(`pill-images/${imageName}/${imageName}.jpg`).delete();

}

export async function getPillsRelatedToImg (imageID) {
  console.log('here');
  const snapshotDB = await firebase.database().ref(`image-to-pill/${imageID}`).once('value');
  return snapshotDB.val() || [];
}


export async function relImgToPill(imageID, pillIDArr) {
  await firebase.database().ref(`image-to-pill/${imageID}`).set(pillIDArr);
}

export async function removeRelationImgToPill(imageArr, pillID) {
  let removedPillArr = [];

  for (let image of imageArr) {
    const snapshotDB = await firebase.database().ref(`image-to-pill/${image.name}`).once('value');
    console.log(snapshotDB._value);

    if (!snapshotDB._value) {
      console.log('NO RELATION IN DB');
      return false;
    }


    removedPillArr = snapshotDB._value.filter(item => {
      return item !== pillID;
    });

    await firebase.database().ref(`image-to-pill/${image.name}`).remove();
    await firebase.database().ref(`image-to-pill/${image.name}`).set(removedPillArr);
  }

  return true;



}

export async function checkRelationsImgToPills(imageID) {
  const snapshotDB = await firebase.database().ref(`image-to-pill/${imageID}`).once('value');
  console.log(snapshotDB);
  console.log(snapshotDB._value);

  if (!snapshotDB._value) {
    removePillImages(imageID)
      .then(() => {
        console.log('IMG WAS REMOVED');
      })
      .catch((error) => {
        console.log('IMG WAS NOT REMOVED WITH ERROR ', error);
      })

  }
}


// -- END PILLS FLOW --------------





// -- NOTES FLOW ---------


export async function saveNoteImageToStorage (noteID, imageName, localUri){
  //localUri - local link on the image from device

  const downloadURL = await firebase
    .storage()
    .ref(`note-images/${noteID}/${imageName}.jpg`)
    .putFile(
      localUri
    );

  return downloadURL;

}

export function createNewNote(noteData){
  const uid = getUIDfromFireBase();
  firebase.database().ref(`notes/${uid}/${noteData.id}`).set(noteData);
}

export  function updateChosenNote(noteID, noteData) {
  const uid = getUIDfromFireBase();
  firebase.database().ref(`notes/${uid}/${noteID}`).update(noteData);
}

export async function deleteNoteByID(noteID){
  const uid = getUIDfromFireBase();
  await firebase.database().ref(`notes/${uid}/${noteID}`).remove();
}

export async function getNotesListByCurrentUser(){
  const uid = getUIDfromFireBase();
  const snapshotDB = await firebase.database().ref(`notes/${uid}`).once('value');
  return snapshotDB.val() || {};
}

export async function removeNoteImages(noteID, imageName) {
  await firebase.storage()
    .ref(`note-images/${noteID}/${imageName}.jpg`).delete();

}


// -- END NOTES FLOW ---------




//-- End FireBase  -----------------------------

