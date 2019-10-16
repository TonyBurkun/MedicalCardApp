import React, {Component, Fragment} from 'react'
import { withNavigation } from 'react-navigation';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView} from 'react-native'
import {getUIDfromFireBase} from "../utils/API";
import * as Colors from "../utils/colors";
import EditIconBtn from "./ui_components/TopNavigation/EditIconBtn";
import {getCurrentDate} from "../utils/helpers";
import {SafeAreaView} from "react-navigation";
import commonStyles from "../utils/commonStyles";
import {Icon, Image, ListItem, Overlay} from "react-native-elements";
import InternetNotification from "./ui_components/InternetNotification";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import FloatingLabelInput from "./ui_components/FloatingLabelInput";
import DatePicker from "react-native-datepicker";
import PillLabel from "./ui_components/PillLabel";
import ChosenLabel from "./ui_components/ChosenLabel";
import SubmitButton from "./ui_components/Buttons/SubmitButton";
import {connect} from "react-redux";
import DateLabel from "./ui_components/DateLabel";
import GreenTitle from "./ui_components/GreenTitle";
import DoctorItem from "./ui_components/DoctorItem";
import {BooleanLiteral} from "@babel/types";

class OneNote extends Component {

  constructor(props) {
    super(props);

    this.state = {
     currentNote: {}

    }

  }

  static navigationOptions = ({navigation}) => {

    let currentNote = '';
    let showEditBtn = false;
    const uid = getUIDfromFireBase();

    if (navigation.state.params && navigation.state.params.currentNote) {
      currentNote = navigation.state.params.currentNote;
      console.log(currentNote);

      if (currentNote.createdByUser === uid){
        showEditBtn = true;
      }
    }

    function handleEditBtn(){
      navigation.navigate('CreateNote', {noteID: currentNote.id});
    }

    return {
      headerTitle: () => <Text numberOfLines={1} style={{left: -20, flex: 1,fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>{currentNote.title}</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      },

      headerRight: (
        <TouchableOpacity onPress={handleEditBtn}>
          <EditIconBtn show={showEditBtn}/>
        </TouchableOpacity>
      )
    }
  };

  componentDidMount(){
    this.setState({
      currentNote: this.props.navigation.state.params.currentNote
    });
  }

  componentDidUpdate(prevProps, prevState){
    const {currentNote} = prevState;

    const noteID = this.props.navigation.state.params.noteID;
    const newNote = this.props.notesList[noteID];

    console.log(currentNote);
    console.log(newNote);

    if (currentNote !== newNote){
      console.log('NOT EQUAL');
      this.setState({
        currentNote: newNote
      });
    }

  }





  render() {

    const {currentNote} = this.state;
    const notePills = currentNote.pills || [];
    const noteDoctors = currentNote.doctors || [];
    const noteLabels = currentNote.labels || [];
    const noteImages = currentNote.images || [];
    const {pillsList, doctorsList, doctorSpecializations, labelsList} = this.props;

    console.log(currentNote.complaint);
    console.log(this.props);
    console.log(pillsList);



    return (
      <SafeAreaView
        style={[styles.container, commonStyles.containerIndents]}>
        <InternetNotification topDimension={0}/>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
            <View>
              <View style={{marginTop: 24}}>
                <DateLabel date={currentNote.date}/>
              </View>
              <Text style={{fontSize: 21, color: Colors.BLACK_TITLE, fontWeight: 'bold'}}>{currentNote.title}</Text>

              {/*-- COMPLAINT --*/}
              {Boolean(currentNote.complaint) &&
                <View style={{marginTop: 24}}>
                  <GreenTitle title={'ЖАЛОБЫ'}/>
                  <Text style={{fontSize: 16, color: Colors.TYPOGRAPHY_COLOR_DARK, marginTop: 8}}>{currentNote.complaint}</Text>
                </View>
              }

              {/*-- CONCLUSION --*/}
              {Boolean(currentNote.conclusion) &&
                <View style={{marginTop: 24}}>
                  <GreenTitle title={'ЗАКЛЮЧЕНИЯ И РЕКОМЕНДАЦИИ'}/>
                  <Text style={{fontSize: 16, color: Colors.TYPOGRAPHY_COLOR_DARK, marginTop: 8}}>{currentNote.conclusion}</Text>
                </View>
              }

              {/*-- PILLS --*/}
              {Boolean(notePills.length) &&
                <View style={{marginTop: 24}}>
                  <GreenTitle title={'ПРЕПАРАТЫ'}/>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {notePills.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor: Colors.PROFILE_HEAD_BG,
                            paddingLeft: 12,
                            paddingRight: 12,
                            height: 40,
                            justifyContent: 'center',
                            borderRadius: 8,
                            marginRight: 8,
                            marginTop: 8,
                          }}
                        >
                          <Text style={{
                            color: Colors.WHITE,
                            fontWeight: 'bold'
                          }}>{pillsList[item].pillTitle.toUpperCase()}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              }


              {/*-- DOCTORS --*/}
              {Boolean(noteDoctors.length) &&
                <View style={{marginTop: 24}}>
                  <GreenTitle title={'ДОКТОР(А)'}/>
                  <View style={{flexWrap: 'wrap'}}>
                    {noteDoctors.map((item, index) => {

                      return (
                        <View key={index} style={{marginTop: 8}}>
                          <DoctorItem doctorData={doctorsList[item]} doctorsSpecializationsArr={doctorSpecializations}/>
                        </View>
                      )
                    })}
                  </View>
                </View>
              }


              {/*-- LABELS --*/}
              {Boolean(noteLabels.length) &&
                <View style={{marginTop: 24}}>
                  <GreenTitle title={'МЕТКИ'}/>
                  <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                    {
                      noteLabels.map((item, index) => {
                        return (
                          <View key={index} style={{height: 40, borderRadius: 8, paddingLeft: 12, paddingRight: 12, backgroundColor: labelsList[item].color, justifyContent: 'center', marginRight: 8, marginTop: 8}}>
                            <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>{labelsList[item].title.toUpperCase()}</Text>
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              }


              {/*-- IMAGES --*/}
              {Boolean(noteImages.length) &&
                <View style={{marginTop: 24}}>

                  <GreenTitle title={'ФАЙЛЫ'}/>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                      noteImages.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{borderRadius: 12, overflow: 'hidden', marginRight: 8, marginBottom: 8, marginTop: 8}}>
                            <Image
                              style={{width: 80, height: 80}}
                              source={{uri: item.url}}
                              resizeMode={'cover'}
                              PlaceholderContent={<ActivityIndicator />}
                            />


                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              }





            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    )
  }


}

function mapStateToProps(state) {
  console.log(state);
  const {notes, pills, doctors, labels} = state;
  return {

    notesList: notes.notesList,
    pillsList: pills.pillsList,
    doctorsList: doctors.doctorsList,
    doctorSpecializations: doctors.doctorSpecializations,
    labelsList: labels.labels,

    chosenPillsID: pills.chosenPillsID,
    chosenDoctorsID: doctors.chosenDoctorsID,
    chosenLabelsID: labels.chosenLabelsID,
  }
}

export default withNavigation(connect(mapStateToProps)(OneNote));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    justifyContent: 'center',
    backgroundColor: Colors.BACKGROUND_COLOR
  },
});
