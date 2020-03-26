import React, {Component} from 'react'
import {ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import * as Colors from '../../utils/colors'

import InternetNotification from '../ui_components/InternetNotification'
import commonStyles from "../../utils/commonStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import SelectFromList from "../ui_components/InputField/SelectFromList";
import {
  createNewTest, deleteNoteByID, deleteTestByID,
  generateUniqID, geTestsListByCurrentUser, getLabelsForUser,
  getTestTypesList,
  getUIDfromFireBase, removeNoteImages, removeTestImages,
  saveIndicatorImageToStorage, updateChosenTest,
} from "../../utils/API";
import {
  addTest,
  deleteTest, saveIndicatiorsListToShow, saveIndicatorsListForShow,
  setChosenIndicators,
  setChosenTestType,
  setTest,
  setTestTypes,
  updateTest
} from "../../actions/tests";
import {connect} from 'react-redux'
import withNavigation from "react-navigation/src/views/withNavigation";
import {
  addCheckFieldToArr,
  convertObjToArr,
  getCurrentDate,
  getIndicatorsArrForShow,
  sortArrByObjectProp
} from "../../utils/helpers";
import {Icon, Image, Overlay} from "react-native-elements";
import DateSelect from "../ui_components/InputField/DateSelect";
import ChosenLabel from "../ui_components/ChosenLabel";
import ImagePicker from "react-native-image-picker";
import SubmitButton from "../ui_components/Buttons/SubmitButton";
import {saveChosenLabel, setLabels} from "../../actions/labels";
import {ifIphoneX} from "react-native-iphone-x-helper";
import RemoveButton from "../ui_components/Buttons/RemoveButton";
import {deleteNote} from "../../actions/notes";
import withNavigationFocus from "react-navigation/src/views/withNavigationFocus";
import PillLabel from "../ui_components/PillLabel";

import { InteractionManager } from 'react-native';




async function _uploadImagesToStore(testID, imagesArr) {
  let uploadedFilesUrlArr = [];

  for (const item of imagesArr) {

    const imageName = generateUniqID();

    await saveIndicatorImageToStorage(testID, imageName, item.url)
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

class MedicalTestCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFormEdit: Boolean(this.props.navigation.state.params),
      formedTestTypesList: {},
      chosenTestType: [],
      // testsList: [],
      indicatorsForShowArr: [],
      showLoader: true,
      formField: {
        date: getCurrentDate(),
        imagesArr: [],
        prevImagesArr: [],
        other: ''
      }
    }


  }

  async componentDidMount(){
    console.log('DID MOUNT TEST CREATE/EDIT');

    console.log(this.props);

    InteractionManager.runAfterInteractions(() => {


      let {formedTestTypesList, labels, testsList, chosenTestType} = this.props;
      // testTypesList = convertObjToArr(testTypesList);
      // testTypesList = sortArrByObjectProp(testTypesList, 'id');
      labels = convertObjToArr(labels);



      this.setState({
        showLoader: false,
        formedTestTypesList,
        labels,
        chosenTestType,
      });

    });



    const {isFormEdit} = this.state;
     // getTestTypesList()
     //  .then(data => {
     //    this.props.dispatch(setTestTypes(data));
     //    this.setState({
     //      testTypesList: data
     //    });
     //  })
     //  .catch(error => {console.log('can not get Test Type List: ', error)});

     // getLabelsForUser()
     //  .then(data => {
     //    this.props.dispatch(setLabels(data));
     //
     //    let labelsListArr = convertObjToArr(data);
     //    labelsListArr = addCheckFieldToArr(labelsListArr);
     //    this.setState({
     //      labelsList: labelsListArr
     //    })
     //  })
     //  .catch(error => {console.log('can not get Labels list for the user', error)});

     // geTestsListByCurrentUser()
     //  .then(data => {
     //    this.props.dispatch(setTest(data));
     //    let testsListArr = convertObjToArr(data);
     //
     //
     //    this.setState({
     //      testsList: testsListArr,
     //      testsListOrigin: testsListArr,
     //      // showList: Boolean(testsListArr.length),
     //      showLoader: false
     //    })
     //  })
     //  .catch(error => {console.log('can not get Tests List: ', error)});






    // if (isFormEdit){
    //   console.log('EDIT TEST');
    //   const currentTestID = this.props.navigation.state.params.currentTest.id;
    //   const {testsList} = this.props;
    //   const currentTest = testsList[currentTestID];
    //   const chosenTestTypesArr = [];
    //   chosenTestTypesArr.push(currentTest.testType);
    //   let prevImagesArr = [];
    //   const chosenLabels = currentTest.labels || [];
    //   const chosenIndicators = currentTest.indicators || [];
    //
    //   // console.log(this.state);
    //   console.log(currentTest);
    //
    //
    //
    //   this.props.dispatch(setChosenTestType(chosenTestTypesArr));
    //   this.props.dispatch(saveChosenLabel(chosenLabels));
    //   this.props.dispatch(setChosenIndicators(chosenIndicators));
    //
    //   this.setState({
    //     ...this.state,
    //     formField: {
    //       ...this.state.formField,
    //       date: currentTest.date,
    //       other: currentTest.other,
    //       imagesArr: currentTest.images || [],
    //       prevImagesArr: currentTest.images || [],
    //       testLabels: chosenLabels
    //     }
    //
    //   })
    // }

  };


  // componentWillReceiveProps(nextProps) {
  //   console.log(this.state);
  //   console.log(nextProps);
  //
  //   const {chosenTestType} = this.state;
  //   const newChosenTestType = nextProps.chosenTestType;
  //   console.log(chosenTestType);
  //   console.log(newChosenTestType);
  //   console.log(this.props.chosenTestType, newChosenTestType);
  //
  //   if (chosenTestType && chosenTestType.id !== newChosenTestType && newChosenTestType.id) {
  //
  //     let {currentUserData, testTypesList, indicatorsListForSave} = this.props;
  //     // testTypesList = convertObjToArr(testTypesList);
  //     // testTypesList = sortArrByObjectProp(testTypesList, 'id');
  //
  //     console.log(testTypesList);
  //     console.log(newChosenTestType);
  //     const currentTestTypeObj = testTypesList[newChosenTestType.id];
  //     const currentTestTypeIndex =  newChosenTestType.index;
  //
  //
  //
  //     console.log(currentUserData);
  //     console.log(currentTestTypeIndex);
  //     console.log(currentTestTypeObj);
  //
  //     const indicatorsForShowArr = getIndicatorsArrForShow(currentTestTypeObj, currentUserData.date, currentUserData.gender);
  //     console.log(indicatorsForShowArr);
  //
  //     this.props.dispatch(saveIndicatorsListForShow(indicatorsForShowArr));
  //
  //     this.setState({
  //       ...this.state,
  //       chosenTestType: newChosenTestType,
  //       indicatorsForShowArr,
  //       testTypesList,
  //       currentTestTypeObj,
  //       indicatorsListForSave,
  //     });
  //
  //   }
  //
  // }

  // static getDerivedStateFromProps(nextProps, prevState){
  //   if(nextProps.chosenTestType.id !== prevState.chosenTestType.id){
  //
  //     const newChosenTestType = nextProps.chosenTestType;
  //
  //     let {currentUserData, testTypesList} = nextProps;
  //     const currentTestTypeObj = testTypesList[newChosenTestType.id];
  //
  //     const indicatorsForShowArr = getIndicatorsArrForShow(currentTestTypeObj, currentUserData.date, currentUserData.gender);
  //
  //     return {
  //       chosenTestType: nextProps.chosenTestType,
  //       indicatorsForShowArr,
  //
  //     };
  //   }
  //   else return null;
  // }
  //
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(prevProps, prevState);
  //   const {indicatorsForShowArr} = this.state;
  //   console.log(indicatorsForShowArr);
  //   this.props.dispatch(saveIndicatorsListForShow(indicatorsForShowArr));
  // }

  componentWillUnmount(){
    this.props.dispatch(setChosenTestType([]));
    this.props.dispatch(saveChosenLabel([]));
  }

  updateDateValue = (newDate) => {
    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        date: newDate
      }
    });
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

        let updatedImagesArr = this.state.formField.imagesArr;
        updatedImagesArr = JSON.parse(JSON.stringify(updatedImagesArr));
        updatedImagesArr.push({name: '', url: response.uri});


        this.setState({
          formField: {
            ...this.state.formField,
            imagesArr: updatedImagesArr,
          }
        });
      }
    });
  };

  handleRemoveImage = (index) => {
    let {imagesArr} = this.state.formField;

    let newImagesArr = JSON.parse(JSON.stringify(imagesArr));


    newImagesArr.splice(index, 1);

    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        imagesArr: newImagesArr
      }
    });
  };
  handleShowTestTypeList = () => {
    console.log('here');
    console.log(this.props);
    // const {testTypesTitleList} = this.props;
    // this.props.navigation.navigate('TypeTestList', {testTypesTitleList: testTypesTitleList})
    this.props.navigation.navigate('TypeTestList');
  };

  handleShowIndicatorsList = () => {
    this.props.navigation.navigate('MedicalIndicators')
  };



  handleSubmitForm = async () => {
    console.log('press save Btn');

    // const {isProfile} = this.state;
    //
    const {other, date, imagesArr} = this.state.formField;
    const { labels, chosenLabelsID, testTypesList, chosenTestType, indicatorsListForSave} = this.props;
    const {isFormEdit} = this.state;


    // console.log(other);
    // console.log(date);
    // console.log(imagesArr);
    // console.log(labels);
    // console.log(chosenLabelsID);
    // console.log(chosenTestType);
    // console.log(indicatorsListForSave);


    if (!isFormEdit) {
      const generatedID = generateUniqID();
      const uid = getUIDfromFireBase();

      this.setState({
        showLoader: true
      });

      const uploadedFilesUrlArr = await _uploadImagesToStore(generatedID, imagesArr);
      console.log(uploadedFilesUrlArr);


      console.log(indicatorsListForSave);


      const indicatorsListWithID = indicatorsListForSave.map(item => {
        item.createdIndicatorID = generateUniqID();
        return item;
      });

      console.log(indicatorsListWithID);


      if (imagesArr.length === uploadedFilesUrlArr.length) {
        const testData = {
          id: generatedID,
          createdByUser: uid,
          images: uploadedFilesUrlArr,
          labels: chosenLabelsID,
          testType: chosenTestType[0],
          indicators: indicatorsListWithID,
          date,
          other,
          dateModified: new Date().getTime(),
        };

        console.log(testData.id);
        createNewTest(testData);
        this.props.dispatch(addTest(testData));
        this.props.dispatch(setChosenTestType([]));
        this.props.dispatch(setChosenIndicators([]));
        this.props.dispatch(saveChosenLabel([]));


        this.setState({
          showLoader: false
        });

        this.props.navigation.goBack();

      }
    }

    if (isFormEdit) {
      const {currentTest} = this.props.navigation.state.params;
      const testID = currentTest.id;
      const {imagesArr, prevImagesArr} = this.state.formField;

      console.log(imagesArr);
      console.log(prevImagesArr);


      let uploadedFilesUrlArr = [];
      let alreadyUploadedImgArr = [];
      let shouldBeRemovedImgArr = [];
      let shouldBeUploadedImgArr = [];

      let imagesAfterEditArr = [];

      const prevImageUrlArr = prevImagesArr.map(item => item.url);
      const imagesUrlArr = imagesArr.map(item => item.url);

      if (JSON.stringify(imagesArr) !== JSON.stringify(prevImagesArr)) {
        imagesUrlArr.forEach((item, index) => {
          if (prevImageUrlArr.includes(item)) {
            alreadyUploadedImgArr.push(imagesArr[index]);
          }

          if (!prevImageUrlArr.includes(item)) {
            shouldBeUploadedImgArr.push(imagesArr[index]);
          }

        });

        prevImageUrlArr.forEach((item, index)=> {
          if (!imagesUrlArr.includes(item)){
            shouldBeRemovedImgArr.push(prevImagesArr[index]);
          }
        });

        console.log('ALREADY UPLOADED ', alreadyUploadedImgArr);
        console.log('NEED TO REMOVE ', shouldBeRemovedImgArr);
        console.log('NEED TO UPLOAD ', shouldBeUploadedImgArr);

        if (shouldBeUploadedImgArr.length) {
          console.log('upload...');
          this.setState({
            showLoader: true
          });
          uploadedFilesUrlArr = await _uploadImagesToStore(testID, shouldBeUploadedImgArr);
          this.setState({
            showLoader: false
          });
        }

        if (shouldBeRemovedImgArr.length) {
          shouldBeRemovedImgArr.map(item => {
            removeTestImages(testID, item.name);
          })
        }
        console.log(alreadyUploadedImgArr);
        console.log(uploadedFilesUrlArr);
        imagesAfterEditArr = [...alreadyUploadedImgArr, ...uploadedFilesUrlArr];
        console.log(imagesAfterEditArr);

      } else {
        imagesAfterEditArr = prevImagesArr;
      }


      console.log(imagesAfterEditArr);


      const indicatorsListWithID = indicatorsListForSave.map(item => {
        item.createdIndicatorID = generateUniqID();
        return item;
      });

      console.log(indicatorsListWithID);

      const testData = {
        id: testID,
        createdByUser: currentTest.createdByUser,
        images: imagesAfterEditArr,
        labels: chosenLabelsID,
        testType: chosenTestType[0],
        indicators: indicatorsListWithID,
        date,
        other,
        dateModified: new Date().getTime(),
      };


      updateChosenTest(testID, testData);
      this.props.dispatch(updateTest(testData));

      this.props.dispatch(setChosenIndicators([]));
      this.props.dispatch(setChosenTestType([]));
      this.props.dispatch(setChosenIndicators([]));

      this.props.navigation.goBack();


      // console.log(testData);





    }





    // const {
    //   chosenChildhoodDiseases,
    //   chosenVaccinations,
    //   chosenPregnancyOutcome,
    //   chosenGynecologicalDiseases,
    //   chosenDisability,
    //   chosenBadHabits,
    //   chosenGenitalInfections
    // } = this.props.medicalCard;
    //
    // const medicalCardDataObj = {
    //   allergicReactions,
    //   chosenChildhoodDiseases,
    //   chosenVaccinations,
    //   chosenPregnancyOutcome,
    //   chosenGynecologicalDiseases,
    //   transferredIVF,
    //   chosenDisability,
    //   chosenBadHabits,
    //   chosenGenitalInfections,
    //   other,
    //   dateModified: new Date().getTime(),
    // };
    //
    // this.props.dispatch(setAllergicReactions(this.state.formField.allergicReactions));
    // this.props.dispatch(setTransferredIVF(this.state.formField.transferredIVF));
    // this.props.dispatch(setOther(this.state.formField.other));
    //
    // if (!isProfile){
    //   //This code run when the user fill Medical Card not in the Profile.
    //   //Create Medical Card during the creation the new USER
    //
    //
    //   const UID = getUIDfromFireBase();
    //   const generatedID = generateUniqID();
    //   createMedicalCardInDB(generatedID, {uid: UID});
    //   updateMedicalCardInDB(generatedID, medicalCardDataObj);
    //   addMedicalCardIDtoCurrentUser(generatedID);
    //
    //   this.props.navigation.navigate('MainNavigation');
    // }
    //
    // if (isProfile){
    //   //Updating the Medical Card from Profile screen
    //
    //   const {medicalCardID} = this.state;
    //   updateMedicalCardInDB(medicalCardID, medicalCardDataObj);
    //   this.props.navigation.goBack();
    // }

  };

  handleRemoveNote = () => {
    const {isFormEdit} = this.state;

    if (isFormEdit) {
      const currentTestID = this.props.navigation.state.params.currentTest.id;
      const editedTest = this.props.testsList[currentTestID];
      const testImages = editedTest.images || [];

      console.log(editedTest);

      deleteTestByID(currentTestID)
        .then(() => {
          if (testImages.length) {
            testImages.forEach(item => {
              removeTestImages(currentTestID, item.name)
                .catch(error => {
                  console.log('Images from Note was note removed because of: ', error)
                })
            })
          }

          this.props.dispatch(deleteTest(currentTestID));
          this.props.navigation.navigate('Home');
        });

    }
  };




  render() {
    console.log(this.props);
    console.log(this.state);
    const {isFormEdit} = this.state;
    const { labels, chosenTestType, indicatorsListForSave} = this.props;
    const {testTypesList, indicatorsForShowArr} = this.state;
    const {other, date, imagesArr} = this.state.formField;



    // function getTestTypeTitleStr (chosenTestType, testTypesTitleList) {
    //   console.log(chosenTestType);
    //   console.log(testTypesTitleList);
    //   let chosenTestTypeTitleStr = '';
    //   if (chosenTestType && Object.keys(chosenTestType).length && testTypesTitleList && testTypesTitleList.length) {
    //     chosenTestType.index.forEach((item) => {
    //       console.log(testTypesTitleList);
    //       console.log(item);
    //       chosenTestTypeTitleStr = chosenTestTypeTitleStr + testTypesTitleList[item] + ', '
    //     });
    //     chosenTestTypeTitleStr = chosenTestTypeTitleStr.substr(0, chosenTestTypeTitleStr.length - 2);
    //   }
    //
    //   return chosenTestTypeTitleStr;
    // }




    console.log(chosenTestType);
    console.log(chosenTestType.length);




    const isEnabled = date.length > 0 &&
                      indicatorsListForSave.length > 0 &&
                      chosenTestType.length > 0;





    const {chosenLabelsID} = this.props || [];
    console.log(chosenLabelsID);

    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0}]}>
        <Overlay
          isVisible={this.state.showLoader}
          width="auto"
          height="auto">
          <ActivityIndicator/>
        </Overlay>
        <InternetNotification topDimension={0}/>
        <KeyboardAwareScrollView>
          <ScrollView>

            <View style={{marginTop: 16}}>
              <SelectFromList
                placeholder={'Тип анализа (обязательно)'}
                type={'testList'}
                // testTypesList={testTypesList}
                pressOnSelect = {() => {this.handleShowTestTypeList()}}
              />

              {/*<View*/}
              {/*  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>*/}
              {/*  <Text style={{*/}
              {/*    position: 'absolute',*/}
              {/*    left: 12,*/}
              {/*    top: 5,*/}
              {/*    fontSize: 14,*/}
              {/*    color: Colors.GRAY_TEXT*/}
              {/*  }}> {getTestTypeTitleStr(chosenTestType, testTypesTitleList) .length > 0 && 'Тип анализа (обязательно)'}</Text>*/}
              {/*  <Text*/}

              {/*    onPress = {() => {this.handleShowTestTypeList()}}*/}
              {/*    style={!getTestTypeTitleStr(chosenTestType, testTypesTitleList) .length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {*/}
              {/*      paddingTop: 28,*/}
              {/*      fontSize: 16,*/}
              {/*      color: Colors.TYPOGRAPHY_COLOR_DARK*/}
              {/*    }]}>*/}
              {/*    {!getTestTypeTitleStr(chosenTestType, testTypesTitleList) .length ? 'Тип анализа (обязательно)' : getTestTypeTitleStr (chosenTestType, testTypesTitleList) }*/}
              {/*  </Text>*/}
              {/*  <Icon*/}
              {/*    name='chevron-right'*/}
              {/*    type='evilicon'*/}
              {/*    color={Colors.GRAY_TEXT}*/}
              {/*    size={40}*/}
              {/*    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}*/}

              {/*    onPress = {() => {this.handleShowTestTypeList()}}*/}
              {/*  />*/}
              {/*</View>*/}



              {Boolean(Object.keys(chosenTestType).length) &&
              <SelectFromList
                placeholder={'Показатели (обязательно)'}
                pressOnSelect = {() => {this.handleShowIndicatorsList()}}
              />
              }
            </View>

            <View style={{marginTop: 16}}>
              <DateSelect initialDate={this.state.formField.date} updateDateValue={(value) => {this.updateDateValue(value)}}/>
            </View>


            {/*Labels section*/}
            <View
              style={[commonStyles.tableBlockItem, {position: 'relative', marginTop: 16}]}>
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
                  // this.props.navigation.navigate('LabelsList', {navType: 'showAddCancelBtn'});
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


            {/*Add Image section*/}
            <View>
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
                    imagesArr.map((item, index) => {
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
            </View>



            {/*Other textarea section*/}
            <View style={commonStyles.tableBlock}>
              <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>ЗАКЛЮЧЕНИЕ</Text>

              <View style={{paddingLeft: 16, paddingRight: 16}}>
                <TextInput
                  style={styles.textArea}
                  editable = {true}
                  multiline = {true}
                  placeholder={'Введите текст'}
                  value={other}
                  onChangeText={(text) => {
                    this.setState({
                      ...this.state,
                      formField: {
                        ...this.state.formField,
                        other: text
                      }
                    })
                  }}
                />
              </View>
            </View>



            <View style={{paddingTop: 40, paddingLeft: 16, paddingRight: 16, borderWidth: 0, ...ifIphoneX({paddingBottom: 22}, {paddingBottom: 20})}}>
              {/*<TouchableOpacity*/}
              {/*  style={[commonStyles.submitBtn, {...ifIphoneX({marginBottom: 22},{marginBottom: 20})}]}*/}
              {/*  onPress={this.handleSaveBtn}*/}
              {/*>*/}
              {/*  <Text style={commonStyles.submitBtnText}>Сохранить</Text>*/}
              {/*</TouchableOpacity>*/}

              <SubmitButton isEnabled={isEnabled}
                            title={isFormEdit ? "СОХРАНИТЬ" : "СОЗДАТЬ"}
                            handleSubmitForm={this.handleSubmitForm}/>
            </View>

            {isFormEdit &&
            <View style={[commonStyles.containerIndents, {borderWidth: 0}]}>
              <RemoveButton handleRemove={(event) => this.handleRemoveNote(event)} title={'УДАЛИТЬ АНАЛИЗ'}/>
            </View>

            }



          </ScrollView>
        </KeyboardAwareScrollView>

      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  console.log(state);
  const {notes, pills, doctors, labels} = state;

  return {
    // currentUserData: state.authedUser.currentUserData,
    // testTypesList: state.tests.testTypesList,
    formedTestTypesList: state.tests.formedTestTypesList,
    testTypesTitleList: state.tests.testTypesTitleList,
    chosenTestType: state.tests.chosenTestType,
    indicatorsListForSave: state.tests.indicatorsListForSave,
    testsList: state.tests.testsList,

    labels: labels.labels,
    chosenLabelsID: labels.chosenLabelsID,
  }
}

export default connect(mapStateToProps)(MedicalTestCreate)

const styles = StyleSheet.create({

  textArea: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.BORDER_COLOR,
    backgroundColor: Colors.WHITE,
    height: 120,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK
  }

});
