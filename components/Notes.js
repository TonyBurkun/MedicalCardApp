import React, {Component, Fragment} from 'react';
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
  ScrollView,
  Image, FlatList, TouchableHighlight,
} from 'react-native';
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import * as Colors from '../utils/colors'
import commonStyles from '../utils/commonStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  signOut,
  getUIDfromFireBase,
  getCurrentUserData,
  getAppPillsList,
  getPillsList,
  getLabelsForUser,
  getNotesListByCurrentUser,
  removeRelationImgToPill,
  checkRelationsImgToPills,
  deletePillByID,
  getDoctorsList, getDoctorSpecializations
} from '../utils/API'
import {setAuthedUserID, getAuthedUserAction} from '../actions/authedUser'
import InternetNotification from '../components/ui_components/InternetNotification'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {isIphone5, convertObjToArr, addCheckFieldToArr, setChosenItemInArr, setInverseChosenItemInArr} from "../utils/helpers";
import {setLabels} from "../actions/labels";
import {setNotes} from "../actions/notes";
import {NO_DATA_TO_SHOW} from "../utils/textConstants";
import {deletePill, setPills} from "../actions/pills";
import Swipeable from "react-native-swipeable";
import OnePillList from "./ui_components/ListItems/OnePillList";
import OneNoteListItem from "./ui_components/ListItems/OneNoteListItem";
import {setDoctors} from "../actions/doctors";
import {setDoctorSpecializations} from "../actions/doctorSpecializations";






class Notes extends Component{

  constructor(props){
    super(props);

    this.state={
      isLoaded: false,
      showList: false,
      notesList: [],
      notesListOrigin: [],
      labelsList: [],
      chosenLabels: false,
    }
  }


  // _cloneNotesObjWithCheckedFalse = (notes, chosenNotesID = []) => {
  //   const copyNotes = JSON.parse(JSON.stringify(notes));
  //   const notesListKeys = Object.keys(copyNotes);
  //
  //
  //   let notesArr = notesListKeys.map((item) => {
  //     copyNotes[item].checked = false;
  //
  //     return copyNotes[item];
  //   });
  //
  //
  //   chosenNotesID.forEach((id) => {
  //     notesArr.forEach((item) => {
  //       if (item.id === id) {
  //         item.checked = true;
  //       }
  //     })
  //   });
  //
  //   return notesArr;
  //
  // };




  async componentDidMount(){
    console.log('DID MOUNT: ', this.state);

    const uid = getUIDfromFireBase();

    this.props.dispatch(setAuthedUserID(uid));

    const currentUserDataObj = this.props.currentUserData;
    if (!Object.keys(currentUserDataObj).length) {
      getCurrentUserData()
        .then(data => {
          this.props.dispatch(getAuthedUserAction(data));
        })
        .catch(error => {console.log('can not get Current User Data: ', error)});
    }

    getLabelsForUser()
      .then(data => {
        this.props.dispatch(setLabels(data));

        let labelsListArr = convertObjToArr(data);
        labelsListArr = addCheckFieldToArr(labelsListArr);
        this.setState({
         labelsList: labelsListArr
        })
      })
      .catch(error => {console.log('can not get Labels list for the user', error)});

    let appPills = getAppPillsList();
    let customPills = getPillsList();

    Promise.all([appPills, customPills])
      .then(resolve => {
        let currentUserPills = resolve[1];

        for (let key in currentUserPills) {
          if (currentUserPills[key].createdByUser !== uid) {
            delete(currentUserPills[key]);
          }
        }
        let data = {...resolve[0], ...resolve[1]};

        this.props.dispatch(setPills(data));
      })
      .catch(error => {console.log('can not get Pills list for the user', error)});


    getDoctorsList()
      .then(data => {
        this.props.dispatch(setDoctors(data));
      })
      .catch(error => {console.log('can not get Doctors list for the user', error)});

    getDoctorSpecializations()
      .then(data => {
        this.props.dispatch(setDoctorSpecializations(data))
      })
    .catch(error => {console.log('can not get Doctor Specializations list for the user', error)});

    getNotesListByCurrentUser()
      .then(data => {

        this.props.dispatch(setNotes(data));
        let notesListArr = convertObjToArr(data);

        this.setState({
          notesList: notesListArr,
          notesListOrigin: notesListArr,
          isLoaded: true,
          showList: Boolean( notesListArr.length),
        })


      })
      .catch(error => {
        console.log('can not get Notes list for the user', error);
      });



    console.log('DID MOUNT FINISH');

  }

  componentWillReceiveProps(nextProps) {

    // console.log(nextProps);

    const {notesList, labelsList } = nextProps;

    let newLabelsListArr = convertObjToArr(labelsList);
    let newNotesListArr = convertObjToArr(notesList);

    if (newLabelsListArr !== this.state.labelsList) {
      this.setState({
        labelsList: newLabelsListArr
      })
    }


    this.setState({
      notesList: newNotesListArr,
      notesListOrigin: newNotesListArr,
      showList: Boolean( newNotesListArr.length),
    })


  }

  renderFlatListItem = ({item}) => {
    return (
      <OneNoteListItem key={item.id} noteData={item} hasCheckBox={false}  handleChoosingNote = {this.handleChoosingNote}/>
    )
  };

  renderLabelsListItem = ({item, index}) => {
    const {labelsList} = this.state;

    const chosenLabelsList = labelsList.filter(item => {
      return item.checked === true;
    });


    let wasClickOnLabel = !!chosenLabelsList.length;



    return (
      <TouchableOpacity
        onPress={() => this.handlePressLabel(item, index)}
        style={[styles.labelBtn, !wasClickOnLabel ? {backgroundColor: item.color} : {backgroundColor: Colors.DISABLED_BORDER}, wasClickOnLabel && item.checked && {backgroundColor: item.color},  index === 0 ? {marginLeft: 16}: {marginLeft: 0}, index === labelsList.length - 1 ? {marginRight: 16} : {marginRight: 8} ]}>
       <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>{item.title.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  };

  handlePressLabel = (item) => {
    const {labelsList, notesListOrigin} = this.state;

    let updatedLabelsList = setInverseChosenItemInArr(labelsList, item.id);
    this.setState({
      labelsList: updatedLabelsList
    });

    const isChosenLabel = updatedLabelsList.find((item) => {
      return item.checked === true;
    });


    if (isChosenLabel) {
      // -- Filter Notes list by chosen labels --
      const chosenLabelsList = updatedLabelsList.filter(item => {
        return item.checked === true;
      });


     const filteredNotesListByLabel = notesListOrigin.filter(note => {
       const noteLabels = note.labels || [];
       let containLabel = false;

       if (noteLabels.length) {
         chosenLabelsList.forEach(chosenLabel => {
           noteLabels.forEach(noteLabelID => {
             if (chosenLabel.id === noteLabelID) {
               containLabel = true;
             }
           })
         });
       }
       return containLabel
     });

     this.setState({
       notesList: filteredNotesListByLabel,
     });

    }

    if (!isChosenLabel) {
      // -- Show Original Note list if the use didn't chose any labels
      this.setState({
        notesList: notesListOrigin,
      });
    }

  };



  handleChoosingNote = (noteID) => {
    const {notesList} = this.props;
    const currentNote = notesList[noteID];

    this.props.navigation.navigate('OneNote', {noteID: noteID, currentNote: currentNote})

  };







  render(){

    const {notesList,  labelsList, isLoaded, showList} = this.state;
    console.log(this.state);
    console.log(isLoaded);



    notesList.sort((a,b) => {

      if (a.dateModified > b.dateModified) {
        return -1;
      }
      if (a.dateModified < b.dateModified) {
        return 1;
      }
      return 0

    });


    notesList.sort((a,b) => {

      if (a.date.toLowerCase() > b.date.toLowerCase()) {
        return -1;
      }
      if (a.date.toLowerCase() < b.date.toLowerCase()) {
        return 1;
      }
      return 0

    });

    console.log(labelsList);




    return(
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>
        {Boolean(isLoaded) &&
          <Fragment>
            {showList ? (
              <Fragment>
                {labelsList.length &&
                  <View style={{marginTop: 12}}>
                    <FlatList
                      horizontal={true}
                      keyExtractor={(item, index) => index.toString()}
                      data={labelsList}
                      renderItem={this.renderLabelsListItem}
                    />
                  </View>
                }
                {notesList.length ? (
                  <View style={{flex: 1, marginTop: 28}}>
                    <FlatList
                      keyExtractor={(item, index) => index.toString()}
                      data={notesList}
                      renderItem={this.renderFlatListItem}
                    />
                  </View>
                ) : (
                  <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
                    <Text>{NO_DATA_TO_SHOW}</Text>
                  </View>
                )}
              </Fragment>
            ) : (
              <View style={{flex: 1, position: 'relative'}}>
                <View style={styles.mainTextWrapper}>
                  <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь будут отображаться Ваши записи, которые Вы создадите</Text>
                </View>
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
            )}
          </Fragment>

        }
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
    currentUserPhotoURL: photoURL || '',
    labelsList: state.labels.labels,
    notesList: state.notes.notesList,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(Notes));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
    backgroundColor: Colors.MAIN_BACKGROUND
  },

  mainTextWrapper: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    paddingLeft: 35,
    paddingRight: 35,
  },

  mainText: {
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  mainText__smallPhone: {
    fontSize: 12,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
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
    marginLeft: -155,
    width: 150,
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
  },

  labelBtn: {
    alignSelf: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    marginRight: 8
  }




});

