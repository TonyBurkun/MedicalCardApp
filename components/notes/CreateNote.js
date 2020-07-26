import React, { Component } from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import * as Colors from '../../utils/colors'

import InternetNotification from '../ui_components/InternetNotification'
import commonStyles from "../../utils/commonStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view/index";
import FloatingLabelInput from "../ui_components/FloatingLabelInput";
import DatePicker from "react-native-datepicker";
import {Icon, Image, ListItem, Overlay} from "react-native-elements/src/index";
import {connect} from 'react-redux'
import PillLabel from '../ui_components/PillLabel'
import ChosenLabel from '../ui_components/ChosenLabel'
import ImagePicker from "react-native-image-picker/index";
import SubmitButton from "../ui_components/Buttons/SubmitButton";
import {
  createNewNote,
  generateUniqID,
  getUIDfromFireBase,
  saveNoteImageToStorage,
  updateChosenNote,
  removeNoteImages, deletePillByID, deleteNoteByID,
} from "../../utils/API";
import {addPill, deletePill, saveChosenPillsType, setChosenPills} from "../../actions/pills";
import {addNote, deleteNote, updateNote} from "../../actions/notes";
import {saveChosenLabel} from "../../actions/labels";
import {setChosenDoctors} from "../../actions/doctors";
import {getCurrentDate} from "../../utils/helpers";
import RemoveButton from "../ui_components/Buttons/RemoveButton";
import withNavigationFocus from "react-navigation/src/views/withNavigationFocus";
import {ifIphoneX} from "react-native-iphone-x-helper";
import DateSelect from "../ui_components/InputField/DateSelect";






async function _uploadImagesToStore(noteID, imagesArr) {
  let uploadedFilesUrlArr = [];

  for (const item of imagesArr) {

    const imageName = generateUniqID();

    await saveNoteImageToStorage(noteID, imageName, item.url)
      .then(success => {
        uploadedFilesUrlArr.push({name: imageName, url: success.downloadURL});
      })
      .catch(error => {
        console.log('Upload user data and img to server was rejected with error: ', error);
      });
  }
  console.log('DONE');

  return uploadedFilesUrlArr;
}


class CreateNote extends Component{


  constructor(props){
    super(props);

    this.state = {
      isFormEdit: Boolean(this.props.navigation.state.params),
      uploadingImages: false,
      formField: {
        noteTitle: '',
        date: getCurrentDate(),
        noteComplaint: '',
        noteDiseaseHistory: '',
        noteDiagnosis: '',
        noteConclusion: '',
        noteOther: '',
        noteImagesArr: [],
        prevImagesArr: []
      }
    }


  }

  static navigationOptions = ({navigation}) => {

    const isEditForm = Boolean(navigation.state.params);

    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>
        {isEditForm ? ('Редактирование') : (' Создать Запись')}
      </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      }
    }
  };



  async componentDidMount() {
    const {isFormEdit} = this.state;

    if (isFormEdit){
      console.log('EDIT NOTE');
      const id = this.props.navigation.state.params.noteID;
      const editedNote = this.props.notesList[id];


      const editedNotePills = editedNote.pills || [];
      const editedNoteDoctors = editedNote.doctors || [];
      const editedNoteLabels = editedNote.labels || [];
      let prevImagesArr = [];
      if (editedNote.images) {
        prevImagesArr = JSON.parse(JSON.stringify(editedNote.images));
      }


      await this.setState({
        ...this.state,
        formField: {
          ...this.state.formField,
          noteTitle: editedNote.title,
          date: editedNote.date,
          noteComplaint: editedNote.complaint,
          noteDiseaseHistory: editedNote.diseaseHistory,
          noteDiagnosis: editedNote.diagnosis,
          noteConclusion: editedNote.conclusion,
          noteOther: editedNote.other,
          noteImagesArr: editedNote.images || [],
          prevImagesArr: prevImagesArr,

        }
      });

      console.log(editedNote);

      this.props.dispatch(setChosenPills(editedNotePills));
      this.props.dispatch(setChosenDoctors(editedNoteDoctors));
      this.props.dispatch(saveChosenLabel(editedNoteLabels))
    }
  }


  componentWillUnmount() {
    console.log('COMPONENT WILL UNMOUNT');
    this.props.dispatch(saveChosenLabel([]));
    this.props.dispatch(setChosenPills([]));
    this.props.dispatch(setChosenDoctors([]));
    this.setState({
      formField: {}
    });
    console.log('END UNMOUNT');
  }


  handleNoteTitle = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        noteTitle: newText,
      }
    })
  };

  // handlePressDateList = () => {
  //   console.log('press DAte list');
  //   this.datePicker.onPressDate()
  // };

  updateDateValue = (newDate) => {
    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        date: newDate
      }
    });
  };

  handleNoteComplaint = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        noteComplaint: newText,
      }
    })
  };

  handleNoteDiseaseHistory = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        noteDiseaseHistory: newText,
      }
    })
  };

  handleNoteDiagnosis = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        noteDiagnosis: newText,
      }
    })
  };

  handleNoteConclusion = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        noteConclusion: newText,
      }
    })
  };

  handleNoteOther = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        noteOther: newText,
      }
    })
  };

  showItemsList = (param, screenTitle, radio = '') => {
    const {chosenLabelsID} = this.props || [];
    this.props.navigation.navigate(param, {listType: param, screenTitle: screenTitle, radio: radio, chosenLabelsID: chosenLabelsID});
  };

  handleAddImage = () => {
    ImagePicker.showImagePicker({noData: true, mediaType: 'photo'}, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {


        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        let updatedNoteImagesArr = this.state.formField.noteImagesArr;
        updatedNoteImagesArr = JSON.parse(JSON.stringify(updatedNoteImagesArr));
        updatedNoteImagesArr.push({name: '', url: response.uri});


        this.setState({
          formField: {
            ...this.state.formField,
            noteImagesArr: updatedNoteImagesArr,
          }
        });
      }
    });
  };

  handleRemoveImage = (index) => {
    let {noteImagesArr} = this.state.formField;

    let newNoteImagesArr = JSON.parse(JSON.stringify(noteImagesArr));


    newNoteImagesArr.splice(index, 1);

    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        noteImagesArr: newNoteImagesArr
      }
    });

    console.log('AFTER REMOVE IMAGE', this.state);
  };

  handleSubmitForm = async () => {

    console.log('Submit form');

    const {isFormEdit} = this.state;
    const uid = getUIDfromFireBase();
    const {
      noteTitle,
      date,
      noteComplaint,
      noteDiseaseHistory,
      noteDiagnosis,
      noteConclusion,
      noteOther,
      noteImagesArr
    } = this.state.formField;

    const {chosenPillsID, chosenDoctorsID, chosenLabelsID} = this.props;

    if (!isFormEdit) {
      const noteID = generateUniqID();

      this.setState({
        uploadingImages: true
      });

      const uploadedFilesUrlArr = await _uploadImagesToStore(noteID, noteImagesArr);

      if (noteImagesArr.length === uploadedFilesUrlArr.length) {
        const noteData = {
          id: noteID,
          createdByUser: uid,
          title: noteTitle,
          date: date,
          complaint: noteComplaint,
          diseaseHistory: noteDiseaseHistory,
          diagnosis: noteDiagnosis,
          conclusion: noteConclusion,
          other: noteOther,
          images: uploadedFilesUrlArr,
          pills: chosenPillsID,
          doctors: chosenDoctorsID,
          labels: chosenLabelsID,
          dateModified: new Date().getTime(),
        };

        createNewNote(noteData);
        this.props.dispatch(addNote(noteData));
        this.setState({
          uploadingImages: false
        });
        this.props.navigation.goBack();


        console.log(noteData);
      }

    }

    if (isFormEdit) {
      console.log('here');
      const id = this.props.navigation.state.params.noteID;

      const {noteImagesArr, prevImagesArr} = this.state.formField;
      console.log(noteImagesArr);
      console.log(prevImagesArr);


      let uploadedFilesUrlArr = [];
      let alreadyUploadedImgArr = [];
      let shouldBeRemovedImgArr = [];
      let shouldBeUploadedImgArr = [];

      let imagesAfterEditArr = [];

      const prevImageUrlArr = prevImagesArr.map(item => item.url);
      const noteImageUrlArr = noteImagesArr.map(item => item.url);

      if (JSON.stringify(noteImagesArr) !== JSON.stringify(prevImagesArr)) {
        noteImageUrlArr.forEach((item, index) => {
          if (prevImageUrlArr.includes(item)) {
            alreadyUploadedImgArr.push(noteImagesArr[index]);
          }

          if (!prevImageUrlArr.includes(item)) {
            shouldBeUploadedImgArr.push(noteImagesArr[index]);
          }

        });

        prevImageUrlArr.forEach((item, index)=> {
          if (!noteImageUrlArr.includes(item)){
            shouldBeRemovedImgArr.push(prevImagesArr[index]);
          }
        });



        // noteImageUrlArr.forEach((item, index) => {
        //   if (!prevImageUrlArr.includes(item)) {
        //     shouldBeUploadedImgArr.push(noteImagesArr[index]);
        //   }
        // });
        //
        console.log('ALREADY UPLOADED ', alreadyUploadedImgArr);
        console.log('NEED TO REMOVE ', shouldBeRemovedImgArr);
        console.log('NEED TO UPLOAD ', shouldBeUploadedImgArr);

        if (shouldBeUploadedImgArr.length) {
          console.log('upload...');
          this.setState({
            uploadingImages: true
          });
          uploadedFilesUrlArr = await _uploadImagesToStore(id, shouldBeUploadedImgArr);
          this.setState({
            uploadingImages: false
          });
        }

        if (shouldBeRemovedImgArr.length) {
          shouldBeRemovedImgArr.map(item => {
            removeNoteImages(id, item.name);
          })
        }
        console.log(alreadyUploadedImgArr);
        console.log(uploadedFilesUrlArr);
        imagesAfterEditArr = [...alreadyUploadedImgArr, ...uploadedFilesUrlArr];
        console.log(imagesAfterEditArr);

      } else {
        imagesAfterEditArr = prevImagesArr;
      }



      const noteData = {
        id: id,
        createdByUser: uid,
        title: noteTitle,
        date: date,
        complaint: noteComplaint,
        diseaseHistory: noteDiseaseHistory,
        diagnosis: noteDiagnosis,
        conclusion: noteConclusion,
        other: noteOther,
        images: imagesAfterEditArr,
        pills: chosenPillsID,
        doctors: chosenDoctorsID,
        labels: chosenLabelsID,
        dateModified: new Date().getTime(),
      };

      updateChosenNote(id, noteData);
      this.props.dispatch(updateNote(noteData));

      this.props.dispatch(setChosenPills([]));
      this.props.dispatch(setChosenDoctors([]));
      this.props.dispatch(saveChosenLabel([]));
      this.props.navigation.goBack();
    }
  };



  handleRemoveNote = () => {
    const {isFormEdit} = this.state;

    if (isFormEdit) {
      const noteID = this.props.navigation.state.params.noteID;
      const editedNote = this.props.notesList[noteID];
      const noteImages = editedNote.images || [];

      console.log(editedNote);

      deleteNoteByID(noteID)
        .then(() => {
          if (noteImages.length) {
            noteImages.forEach(item => {
              removeNoteImages(noteID, item.name)
                .catch(error => {console.log('Images from Note was note removed because of: ', error)})
            })
          }

          this.props.dispatch(deleteNote(noteID));
          this.props.navigation.navigate('Home');
        });

    }



  };




  render() {

    const {chosenPillsID} = this.props || [];
    const {chosenDoctorsID} = this.props || [];
    const {chosenLabelsID} = this.props || [];
    const {pillsList, doctorsList, labels} = this.props;
    const {noteImagesArr} = this.state.formField;

    const {isFormEdit} = this.state;
    const {noteTitle} = this.state.formField;
    const isEnabled = noteTitle.length > 0;

    console.log(this.state);
    console.log(chosenPillsID);
    console.log(this.props);









    return (
      <SafeAreaView
        style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0, position: 'relative'}]}>
        <Overlay
          isVisible={this.state.uploadingImages}
          width="auto"
          height="auto">
          <ActivityIndicator/>
        </Overlay>
        <InternetNotification topDimension={0}/>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
           <View>
             <View style={{paddingTop: 16, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR}}>
               <FloatingLabelInput
                 label="Добавить заголовок (обязательно)"
                 value={this.state.formField.noteTitle}
                 onChangeText={this.handleNoteTitle}
                 maxLength={50}
               />
               {/*<ListItem*/}
               {/*  onPress={this.handlePressDateList}*/}
               {/*  containerStyle={{*/}
               {/*    paddingLeft: 16,*/}
               {/*    paddingRight: 0,*/}
               {/*    paddingTop: 9,*/}
               {/*    paddingBottom: 9,*/}
               {/*    borderBottomWidth: 1,*/}
               {/*    borderColor: Colors.TABLE_BORDER*/}
               {/*  }}*/}
               {/*  title={'Дата'}*/}
               {/*  titleStyle={{fontSize: 14}}*/}
               {/*  rightAvatar={*/}
               {/*    <View style={{flexDirection: 'row'}}>*/}
               {/*      <DatePicker*/}
               {/*        locale={'ru'}*/}
               {/*        ref={(picker) => {*/}
               {/*          this.datePicker = picker;*/}
               {/*        }}*/}
               {/*        date={this.state.formField.date} //initial date from state*/}
               {/*        // mode="date" //The enum of date, datetime and time*/}
               {/*        format="DD-MM-YYYY"*/}
               {/*        minDate="01-01-1930"*/}
               {/*        maxDate={getCurrentDate()}*/}
               {/*        confirmBtnText="Сохранить"*/}
               {/*        cancelBtnText="Отмена"*/}
               {/*        hideText={!this.state.formField.date}*/}
               {/*        showIcon={false}*/}
               {/*        customStyles={{*/}
               {/*          dateInput: {*/}
               {/*            alignItems: 'flex-end',*/}
               {/*            paddingLeft: 16,*/}
               {/*            borderWidth: 0,*/}
               {/*            backgroundColor: Colors.WHITE,*/}

               {/*          },*/}
               {/*          dateText: {*/}
               {/*            fontSize: 14,*/}
               {/*            color: Colors.MAIN_GREEN,*/}
               {/*            fontWeight: 'bold'*/}
               {/*          },*/}
               {/*          placeholderText: {*/}
               {/*            fontSize: 14,*/}
               {/*            color: Colors.GRAY_TEXT,*/}
               {/*          },*/}

               {/*        }}*/}
               {/*        onDateChange={(value) => {*/}
               {/*          this.setState({*/}
               {/*            ...this.state,*/}
               {/*            formField: {*/}
               {/*              ...this.state.formField,*/}
               {/*              date: value,*/}
               {/*            }*/}
               {/*          });*/}
               {/*        }}*/}
               {/*      />*/}
               {/*      <Icon*/}
               {/*        name='chevron-right'*/}
               {/*        type='evilicon'*/}
               {/*        color={Colors.GRAY_TEXT}*/}
               {/*        size={40}*/}
               {/*        containerStyle={{alignSelf: 'center', paddingTop: 2}}*/}
               {/*      />*/}
               {/*    </View>*/}
               {/*  }*/}
               {/*/>*/}
               <DateSelect
                 initialDate={this.state.formField.date}
                 updateDateValue={(value) => {this.updateDateValue(value)}}/>
             </View>

             <View style={{paddingTop: 18, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR}}>
               <FloatingLabelInput
                 label="Жалобы"
                 value={this.state.formField.noteComplaint}
                 onChangeText={this.handleNoteComplaint}
                 placeholder={'Добавить описание'}
               />
               <FloatingLabelInput
                 label="История заболевания"
                 value={this.state.formField.noteDiseaseHistory}
                 onChangeText={this.handleNoteDiseaseHistory}
                 placeholder={'Добавить описание'}
               />
               <FloatingLabelInput
                 label="Основной и сопутствующий диагнозы"
                 value={this.state.formField.noteDiagnosis}
                 onChangeText={this.handleNoteDiagnosis}
                 placeholder={'Добавить описание'}
               />
               <FloatingLabelInput
                 label="Заключения и рекомендации"
                 value={this.state.formField.noteConclusion}
                 onChangeText={this.handleNoteConclusion}
                 multiline={true}
                 placeholder={'Заметка'}
               />
               <FloatingLabelInput
                 label="Другое"
                 value={this.state.formField.noteOther}
                 onChangeText={this.handleNoteOther}
                 multiline={true}
                 placeholder={'Заметка'}
               />
             </View>

             <View style={{paddingTop: 18, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR}}>
               <View
                 style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                 <Text
                   onPress={() => {
                     this.showItemsList('ChosePill', 'Препараты')
                   }}
                   style={commonStyles.tableBlockItemText}>
                  Препараты
                 </Text>
                 <Icon
                   name='chevron-right'
                   type='evilicon'
                   color={Colors.GRAY_TEXT}
                   size={40}
                   containerStyle={{position: 'absolute', right: 0, top: 0, marginTop: 12}}
                   onPress={() => {
                     this.showItemsList('ChosePill', 'Препараты')
                   }}
                 />
                 <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 16, paddingRight: 16}}>
                   {
                     chosenPillsID.map((item, index) => {
                       const title = pillsList[item].pillTitle;
                       return (
                         <PillLabel key={index} pillID={item} pillTitle={title}/>
                       )
                     })
                   }
                 </View>
               </View>
             </View>

             <View style={{paddingTop: 18, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR}}>
               <View
                 style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                 <Text
                   onPress={() => {
                     this.showItemsList('ChoseDoctor', 'Добавить доктора')
                   }}
                   style={commonStyles.tableBlockItemText}>
                   Добавить доктора(oв)
                 </Text>
                 <Icon
                   name='chevron-right'
                   type='evilicon'
                   color={Colors.GRAY_TEXT}
                   size={40}
                   containerStyle={{position: 'absolute', right: 0, top: 0, marginTop: 12}}
                   onPress={() => {
                     this.showItemsList('ChoseDoctor', 'Добавить доктора')
                   }}
                 />
                 <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 16, paddingRight: 16}}>
                   {
                     chosenDoctorsID.map((item, index) => {
                       const firstName = doctorsList[item].firstName;
                       const lastName = doctorsList[item].lastName;

                       return (
                         <Text
                           key={index}
                           style={{fontSize: 16, fontWeight: 'bold', color: Colors.TYPOGRAPHY_COLOR_DARK, marginBottom: 8}}
                         >{ (index === 0) ? `${firstName} ${lastName}` : `, ${firstName} ${lastName}`}</Text>
                       )
                     })
                   }
                 </View>
               </View>
             </View>

             <View style={{paddingTop: 18, borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR}}>
               <View
                 style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                 <Text
                   onPress={() => {
                     this.showItemsList('ChoseLabel', 'Метки')
                     // this.props.navigation.navigate('LabelsList', {navType: 'showAddCancelBtn'});
                   }}
                   style={commonStyles.tableBlockItemText}>
                   Добавить метку(и)
                 </Text>
                 <Icon
                   name='chevron-right'
                   type='evilicon'
                   color={Colors.GRAY_TEXT}
                   size={40}
                   containerStyle={{position: 'absolute', right: 0, top: 0, marginTop: 12}}
                   onPress={() => {
                     this.showItemsList('ChoseLabel', 'Метки')
                   }}
                 />
                 <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingLeft: 16, paddingRight: 16}}>
                   {
                     chosenLabelsID.map((item, index) => {
                       const title = labels[item].title;
                       const color = labels[item].color;
                       return (
                         <ChosenLabel key={index} title={title} color={color}/>
                       )
                     })
                   }
                 </View>
               </View>
             </View>

             <View style={{
               backgroundColor: Colors.WHITE,
               marginTop: 24,
               paddingLeft: 16,
               paddingRight: 16,
               paddingTop: 9
             }}>
               <Text style={{fontSize: 14, color: Colors.GRAY_TEXT, marginBottom: 9}}>Прикрепить фото</Text>
               <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                 {
                   noteImagesArr.map((item, index) => {
                     return (
                       <View
                         key={index}
                         style={{position: 'relative', justifyContent: 'center', marginRight: 16, marginBottom: 16}}
                       >
                         <TouchableOpacity
                           style={{position: 'absolute', top: -10, right: -10, zIndex: 100}}
                           onPress={() => {
                             this.handleRemoveImage(index)
                           }}
                         >
                           <Image
                             style={{width: 20, height: 20}}
                             source={require('../../assets/general/close_round.png')}
                           />
                         </TouchableOpacity>
                         <View
                           style={{borderRadius: 12, overflow: 'hidden'}}
                         >
                           <Image
                             style={{width: 80, height: 80}}
                             source={{uri: item.url}}
                             resizeMode={'cover'}
                             PlaceholderContent={<ActivityIndicator/>}
                           />
                         </View>
                       </View>
                     )
                   })
                 }
                 <TouchableOpacity
                   style={{
                     width: 80,
                     height: 80,
                     borderRadius: 12,
                     marginBottom: 16,
                     backgroundColor: Colors.TABLE_BORDER,
                     justifyContent: 'center'
                   }}
                   onPress={this.handleAddImage}
                 >
                   <Image
                     style={{width: 24, height: 24, alignSelf: 'center'}}
                     source={require('../../assets/general/add_plus.png')}
                     PlaceholderContent={<ActivityIndicator/>}
                   />
                 </TouchableOpacity>
               </View>
             </View>

             <View style={[commonStyles.containerIndents, {borderWidth: 0, ...ifIphoneX({paddingBottom: 22}, {paddingBottom: 20})}]}>
               <SubmitButton isEnabled={isEnabled}
                             title={isFormEdit ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
                             handleSubmitForm={this.handleSubmitForm}/>
             </View>

             { isFormEdit &&
              <View  style={[commonStyles.containerIndents, {borderWidth: 0}]}>
                <RemoveButton handleRemove={(event) => this.handleRemoveNote(event)} title={'УДАЛИТЬ ЗАПИСЬ'}/>
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
    labels: labels.labels,
    chosenPillsID: pills.chosenPillsID,
    chosenDoctorsID: doctors.chosenDoctorsID,
    chosenLabelsID: labels.chosenLabelsID,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(CreateNote));

const styles = StyleSheet.create({});
