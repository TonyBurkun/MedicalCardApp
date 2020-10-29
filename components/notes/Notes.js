import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Button,
  Platform,
  ScrollView,
  Image, FlatList,
} from 'react-native';
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import * as Colors from '../../utils/colors'
import commonStyles from '../../utils/commonStyles'
import {
  getUIDfromFireBase,
  getCurrentUserData,
  getAppPillsList,
  getPillsList,
  getLabelsForUser,
  getNotesListByCurrentUser,
  getDoctorsList, getDoctorSpecializations
} from '../../utils/API'
import {setAuthedUserID, getAuthedUserAction} from '../../actions/authedUser'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
  isIphone5,
  convertObjToArr,
  addCheckFieldToArr,
  sortTestList
} from "../../utils/helpers";
import {saveChosenLabelForNoteList, setLabels} from "../../actions/labels";
import {setNotes} from "../../actions/notes";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";
import {setPills} from "../../actions/pills";
import Swipeable from "react-native-swipeable";
import OnePillList from "../ui_components/ListItems/OnePillList";
import OneNoteListItem from "../ui_components/ListItems/OneNoteListItem";
import {setDoctors} from "../../actions/doctors";
import {setDoctorSpecializations} from "../../actions/doctorSpecializations";
import {Icon} from "react-native-elements";
import ChosenLabel from "../ui_components/ChosenLabel";






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
      labelsForFilter: []
    }
  }





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

    console.log(nextProps);
    console.log(this.props);


    const {notesList, labelsList, chosenLabelsID} = nextProps;
    console.log(chosenLabelsID);
    const {labelsForFilter} = this.state;

    let newLabelsListArr = convertObjToArr(labelsList);
    let newNotesListArr = convertObjToArr(notesList);

    if (newLabelsListArr !== this.state.labelsList) {
      this.setState({
        labelsList: newLabelsListArr
      })
    }

    console.log(newNotesListArr);


    this.setState({
      // notesList: newNotesListArr,
      // notesListOrigin: newNotesListArr,
      showList: Boolean( newNotesListArr.length),
    });

    if (chosenLabelsID !== labelsForFilter && chosenLabelsID.length > 0) {
      console.log('NEW CHOSEN LABELS');

      this.setState({
        labelsForFilter: chosenLabelsID
      });

      let filteredNotesListByLabel = [];

      for (let key in notesList) {

        console.log('ITERATION');

        if (notesList.hasOwnProperty(key)) {
          let noteLabels = notesList[key].labels || [];
          console.log(noteLabels);

          for (let i = 0; i < noteLabels.length; i++){
            let result = chosenLabelsID.find(chosenLabel => {
              console.log(chosenLabel, noteLabels[i]);
              return chosenLabel === noteLabels[i];
            });

            if (result) {
              filteredNotesListByLabel.push(notesList[key]);
              break;
            }
          }
        }
        this.setState({
          notesList: filteredNotesListByLabel

        })
      }
    }

    if (!chosenLabelsID.length){
      this.setState({
        notesList: newNotesListArr
      })
    }


  }

  renderFlatListItem = ({item}) => {
    return (
      <OneNoteListItem key={item.id} noteData={item} hasCheckBox={false}  handleChoosingNote = {this.handleChoosingNote}/>
    )
  };


  showItemsList = (param, screenTitle, radio = '') => {
    const {chosenLabelsID} = this.props || [];
    this.props.navigation.navigate(param, {listType: param, screenTitle: screenTitle, radio: radio, fromScreen: 'notesList', chosenLabelsID: chosenLabelsID});
  };

  handleClearBtn = () => {
    console.log('press');
    this.props.dispatch(saveChosenLabelForNoteList([]))
  };



  handleChoosingNote = (noteID) => {
    const {notesList} = this.props;
    const currentNote = notesList[noteID];

    this.props.navigation.navigate('OneNote', {noteID: noteID, currentNote: currentNote})

  };







  render(){

    const {notesList, isLoaded, showList} = this.state;
    const {labelsList} = this.props;
    console.log(this.state);
    console.log(isLoaded);
    const {chosenLabelsID} = this.props || [];

    return(
      <SafeAreaView style={styles.container}>
        {Boolean(isLoaded) &&
          <Fragment>
            {showList ? (
              <Fragment>

               <TouchableHighlight
                 onPress={() => {this.showItemsList('ChoseLabel', 'Метки')}}
               >
                 <View
                   style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                   <Text
                     style={[commonStyles.tableBlockItemText]}>
                     Отфильтровать по меткам:
                   </Text>
                   {chosenLabelsID.length > 0 &&
                   <TouchableOpacity
                     style={{position: 'absolute', width: 80, right: 40, top: 0, marginTop: 20}}
                     onPress={() => {
                       this.handleClearBtn();
                     }}
                   >

                     <Text style={{color: Colors.BLUE_BTN}}>очистить</Text>
                   </TouchableOpacity>
                   }
                   <Icon
                     name='chevron-down'
                     type='evilicon'
                     color={Colors.GRAY_TEXT}
                     size={40}
                     containerStyle={{position: 'absolute', right: 0, top: 0, marginTop: 12}}
                   />
                   <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 16, paddingRight: 16}}>
                     {
                       chosenLabelsID.map((item, index) => {
                         console.log(item);
                         console.log(labelsList);

                         const title = labelsList[item].title;
                         const color = labelsList[item].color;
                         return (
                           <ChosenLabel key={index} title={title} color={color}/>
                         )
                       })
                     }
                   </View>
                 </View>
               </TouchableHighlight>

                {notesList.length ? (
                  <View style={{flex: 1, marginTop: 28}}>
                    <FlatList
                      keyExtractor={(item, index) => index.toString()}
                      data={sortTestList(notesList)}
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
                  source={require('../../assets/person/notes.png')}/>
                <View style={styles.tipWrapper}>
                  <Text style={styles.tipText}>Создайте запись</Text>
                  <Image
                    style={styles.tipArrow}
                    source={require('../../assets/vector/notes_vector.png')}/>

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
    chosenLabelsID: state.labels.chosenLabelsIDForNoteList,
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

