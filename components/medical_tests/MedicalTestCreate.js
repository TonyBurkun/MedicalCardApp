import React, {Component} from 'react'
import {ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import * as Colors from '../../utils/colors'

import InternetNotification from '../ui_components/InternetNotification'
import commonStyles from "../../utils/commonStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import SelectFromList from "../ui_components/InputField/SelectFromList";
import {
  createNewTest,
  generateUniqID,
  getTestTypesList,
  getUIDfromFireBase,
  saveIndicatorImageToStorage,
} from "../../utils/API";
import {addTest, setChosenIndicators, setChosenTestType, setTestTypes} from "../../actions/tests";
import {connect} from 'react-redux'
import withNavigation from "react-navigation/src/views/withNavigation";
import {getCurrentDate} from "../../utils/helpers";
import {Icon, Image, Overlay} from "react-native-elements";
import DateSelect from "../ui_components/InputField/DateSelect";
import ChosenLabel from "../ui_components/ChosenLabel";
import ImagePicker from "react-native-image-picker";
import SubmitButton from "../ui_components/Buttons/SubmitButton";


async function _uploadImagesToStore(pillImagesArr) {
  let uploadedFilesUrlArr = [];

  for (const item of pillImagesArr) {

    const imageID = generateUniqID();

    await saveIndicatorImageToStorage(imageID, item.url)
      .then(success => {
        uploadedFilesUrlArr.push({name: imageID, url: success.downloadURL});
      })
      .catch(error => {
        console.log('Upload user data and img to server was rejected with error: ', error);
      });
  }
  console.log('DONE');

  return uploadedFilesUrlArr;
}

class CreateTest extends Component{

  constructor(props) {
    super(props);

    this.state = {
      isFormEdit: false,
      testTypesList: [],
      testsList: [],
      uploadingImages: false,
      formField: {
        date: getCurrentDate(),
        imagesArr: [],
        prevImagesArr: [],
        other: ''
      }
    }


  }

  componentDidMount(){
    console.log(this.props);

    const {testTypesList} = this.props;

    if (Boolean(testTypesList) && Boolean(testTypesList.length)) {
      console.log('exist');
      this.setState({
        testTypesList: testTypesList
      });

      console.log(this.state);
    }  else {
      console.log('not exist');
      getTestTypesList()
        .then(data => {
          this.props.dispatch(setTestTypes(data));
          this.setState({
            testTypesList: data
          })
        })
    }
  };

  componentWillUnmount(){
    this.props.dispatch(setChosenTestType([]));
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

  showItemsList = (param, screenTitle, radio = '') => {
    this.props.navigation.navigate(param, {listType: param, screenTitle: screenTitle, radio: radio});
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


  // static navigationOptions = ({navigation}) => {
  //
  //   return {
  //     // headerLeft: (
  //     //   <CalendarIcon/>
  //     // ),
  //     headerTitle: 'Создать Анализ',
  //     // headerRight: (
  //     //   <Avatar/>
  //     // ),
  //     // headerStyle: commonStyles.topHeader,
  //
  //   }
  // };

  handleSubmitForm = async () => {
    console.log('press save Btn');

    // const {isProfile} = this.state;
    //
    const {other, date, imagesArr} = this.state.formField;
    const { labels, chosenLabelsID, testTypesList, chosenTestType, indicatorsListForSave} = this.props;
    const {isFormEdit} = this.state;


    console.log(other);
    console.log(date);
    console.log(imagesArr);
    console.log(labels);
    console.log(chosenLabelsID);
    console.log(chosenTestType);
    console.log(indicatorsListForSave);


    if (!isFormEdit) {
      const generatedID = generateUniqID();
      const uid = getUIDfromFireBase();

      this.setState({
        uploadingImages: true
      });

      const uploadedFilesUrlArr = await _uploadImagesToStore(imagesArr);
      console.log(uploadedFilesUrlArr);

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

        this.setState({
          uploadingImages: false
        });

        this.props.navigation.goBack();

      }
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




  render() {
    console.log(this.props);
    const {isFormEdit} = this.state;
    const { labels, testTypesList, chosenTestType, indicatorsListForSave} = this.props;
    const {other, date, imagesArr} = this.state.formField;




    const isEnabled = date.length > 0 &&
                      indicatorsListForSave.length > 0 &&
                      chosenTestType.length > 0;






    const testTypesTitleList = testTypesList.map(item => {
      return item['title'];
    });
    const {chosenLabelsID} = this.props || [];
    console.log(testTypesList);

    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0}]}>
        <Overlay
          isVisible={this.state.uploadingImages}
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
                selectRoute={'TypeTestList'}
                type={'testList'}
                data={testTypesTitleList}
              />
              {Boolean(chosenTestType.length) &&
                <SelectFromList
                  placeholder={'Показатели (обязательно)'}
                  selectRoute={'MedicalIndicators'}
                />
              }
            </View>
            <View style={{marginTop: 16}}>
              <DateSelect updateDateValue={(value) => {this.updateDateValue(value)}}/>
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
                  value={this.state.formField.other}
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



            <View style={{paddingTop: 40, paddingLeft: 16, paddingRight: 16}}>
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
    testTypesList: state.tests.testTypesList,
    chosenTestType: state.tests.chosenTestType,
    indicatorsListForSave: state.tests.indicatorsListForSave,

    labels: labels.labels,
    chosenLabelsID: labels.chosenLabelsID,
  }
}

export default withNavigation(connect(mapStateToProps)(CreateTest))

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
