import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native'
import {connect} from 'react-redux'
import * as Colors from "../utils/colors";
import {SafeAreaView} from "react-navigation";
import commonStyles from "../utils/commonStyles";
import InternetNotification from "./ui_components/InternetNotification";
import {isIphone5} from "../utils/helpers";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import GroupButtonsTitle from "./ui_components/GroupButtonsTitle";
import FloatingLabelInput from "./ui_components/FloatingLabelInput";
import {Icon, Image, Overlay} from "react-native-elements";
import SubmitButton from "./ui_components/Buttons/SubmitButton";
import {
  createNewPill,
  generateUniqID,
  getPillsType,
  getUIDfromFireBase, removePillImages,
  savePillImageToStorage, testUpload,
  updateChosenPill
} from '../utils/API'
import {addPill, saveChosenPillsType, setPillsTypeList, updatePill} from '../actions/pills'
import ImagePicker from "react-native-image-picker";
import {BooleanLiteral} from "@babel/types";




async function _uploadImagesToStore(pillImagesArr, generatedID) {
  let uploadedFilesUrlArr = [];

  for (const item of pillImagesArr) {

    const imageName = generateUniqID();

    await savePillImageToStorage(item.url, generatedID, imageName)
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

class CreatePill extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isFormEdit: Boolean(this.props.navigation.state.params),
      uploadingImages: false,
      formField: {
        pillTitle: '',
        pillType: [],
        pillImagesArr: [],
      }
    }

  }

  static navigationOptions = ({navigation}) => {

    const isEditForm = Boolean(navigation.state.params);


    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}> {isEditForm ? ('Редактировать Препарат') : ('Создать Препарат')} </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      }
    }
  };

  async componentDidMount(){
    console.log('DID MOUNT');
    const {isFormEdit} = this.state;

    if (isFormEdit){
      const id = this.props.navigation.state.params.pillID;
      const editedPill = this.props.pillsList[id];
      console.log(editedPill);

      await this.setState({
        ...this.state,
        formField: {
          pillTitle: editedPill.pillTitle,
          pillType: editedPill.pillType,
          pillImagesArr: editedPill.images || [],
          prevImagesArr: JSON.parse(JSON.stringify(editedPill.images))  || [],
        }
      });

      this.props.dispatch(saveChosenPillsType(editedPill.pillType));


    }



  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);

    this.setState({
      formField: {
        ...this.state.formField,
        pillType: nextProps.chosenPillsTypeArr
      }
    });
  }

  componentWillUnmount(){
    this.props.dispatch(saveChosenPillsType([]));
  }



  handlePillTitle = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        pillTitle: newText,
      }
    })
  };

  showItemsList = (param, screenTitle) => {
    // console.log(this.props.chosenPillsTypeArr);

    if (this.state.isFormEdit){
      this.props.navigation.navigate('ChosePillsType', {listType: param, screenTitle: screenTitle, prevData: this.state.formField.pillType});
    } else {
      this.props.navigation.navigate('ChosePillsType', {listType: param, screenTitle: screenTitle, prevData: this.props.chosenPillsTypeArr});
    }

  };

  handleAddImage = () => {
    console.log('in select Image');

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

        let updatedPillImagesArr = this.state.formField.pillImagesArr;
        updatedPillImagesArr.push({name: '', url: response.uri});


        this.setState({
          formField:{
            ...this.state.formField,
            pillImagesArr: updatedPillImagesArr,
          }
        });
      }
    });
  };


  handleRemoveImage = (index) => {
    console.log('PRESS REMOVE IMAGES');

    let {pillImagesArr} = this.state.formField;


    pillImagesArr.splice(index, 1);

    this.setState({
      ...this.state,
      formField: {
        ...this.state.formField,
        pillImagesArr: pillImagesArr
      }
    });
  };


  handleSubmitForm = async () => {
    console.log('complete form');


    const {isFormEdit} = this.state;

    if (isFormEdit) {
      // Edit exist Pill

      const id = this.props.navigation.state.params.pillID;
      const editedPill = this.props.pillsList[id];
      const createdByUserID = editedPill.createdByUser;
      const uid = getUIDfromFireBase();
      const {pillImagesArr, prevImagesArr, pillTitle, pillType} = this.state.formField;
      // console.log(this.state.formField);
      // console.log(createdByUserID);
      // console.log(uid);

      let uploadedFilesUrlArr = [];
      let alreadyUploadedImgArr = [];
      let shouldBeRemovedImgArr = [];
      let shouldBeUploadedImgArr = [];


      const prevImageUrlArr = prevImagesArr.map(item => item.url);
      const pillImageUrlArr = pillImagesArr.map(item => item.url);


      if (JSON.stringify(pillImagesArr) !== JSON.stringify(prevImagesArr)){
        prevImageUrlArr.forEach((item, index) => {
         if (pillImageUrlArr.includes(item)) {
           alreadyUploadedImgArr.push(pillImagesArr[index])
         }

         if (!pillImageUrlArr.includes(item)) {
           shouldBeRemovedImgArr.push(prevImagesArr[index])
         }
       });

        pillImageUrlArr.forEach((item, index) => {
          if (!prevImageUrlArr.includes(item)){
            shouldBeUploadedImgArr.push(pillImagesArr[index])
          }
        });

        // console.log(pillImagesArr);
        // console.log(prevImagesArr);
        //
        // console.log('ALREADY UPLOADED ' , alreadyUploadedImgArr);
        // console.log('NEED TO REMOVE ' , shouldBeRemovedImgArr);
        // console.log('NEED TO UPLOAD ' ,shouldBeUploadedImgArr);

        if (createdByUserID === uid) {
          this.setState({
            uploadingImages: true
          });
          const isRemovedImages = await removePillImages(id, shouldBeRemovedImgArr);
          if (isRemovedImages) {
            uploadedFilesUrlArr = alreadyUploadedImgArr;
            console.log('AFTER REMOVE', uploadedFilesUrlArr);
          }


          if (shouldBeUploadedImgArr.length) {
            console.log('upload...');
            uploadedFilesUrlArr = await _uploadImagesToStore(shouldBeUploadedImgArr, id);

            uploadedFilesUrlArr = [...alreadyUploadedImgArr, ...uploadedFilesUrlArr];
            console.log('AFTER UPLOAD', uploadedFilesUrlArr);
          }

      }

      } else {
        uploadedFilesUrlArr = prevImagesArr;
      }

      const pillData = {
        id: id,
        createdByUser: uid,
        pillTitle: pillTitle,
        pillType: pillType,
        images: uploadedFilesUrlArr,
        dateModified: new Date().getTime(),
      };

      updateChosenPill(id, pillData);
      this.props.dispatch(updatePill(pillData));
      this.props.dispatch(saveChosenPillsType([]));
      this.setState({
        uploadingImages: false
      });
      this.props.navigation.goBack();
    }




    if (!isFormEdit) {
      // Create new Pill
      const {pillImagesArr, pillTitle, pillType} = this.state.formField;
      const uid = getUIDfromFireBase();
      const generatedID = generateUniqID();

      this.setState({
        uploadingImages: true
      });


      const uploadedFilesUrlArr = await _uploadImagesToStore(pillImagesArr, generatedID);
      console.log(uploadedFilesUrlArr);

      if (pillImagesArr.length === uploadedFilesUrlArr.length) {
        console.log('ALL IMAGES UPLOADED');

        const pillData = {
          id: generatedID,
          createdByUser: uid,
          pillTitle: pillTitle,
          pillType: pillType,
          images: uploadedFilesUrlArr,
          dateModified: new Date().getTime(),
        };

        createNewPill(pillData);
        this.props.dispatch(addPill(pillData));
        this.props.dispatch(saveChosenPillsType([]));
        this.setState({
          uploadingImages: false
        });
        this.props.navigation.goBack();
      }

    }
  };







  render() {

    console.log(this.state);

    const {pillTitle, pillType} = this.state.formField;
    const {isFormEdit} = this.state;
    const {pillsTypeList} = this.props;


    const isEnabled = pillTitle.length > 0 && pillType.length > 0;

    // console.log(this.props);
    // console.log(pillsTypeList);
    // console.log(pillType);




    let chosenPillsTitle = pillType.map((item) => {
      // console.log(item);
      // console.log(pillsTypeList);
      // console.log(pillsTypeList[item]);


      return pillsTypeList[item];

    });

    // console.log(chosenPillsTitle);



    function getChosenTitleStr (pillsType) {
      let chosenTitlesStr = '';

      if (pillsType.length) {
        pillsType.forEach((item) => {
          chosenTitlesStr = chosenTitlesStr + item + ', '
        });
        chosenTitlesStr = chosenTitlesStr.substr(0, chosenTitlesStr.length - 2);
      }
      return chosenTitlesStr;

    }






    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0, position: 'relative'}]}>
        <Overlay
          isVisible={this.state.uploadingImages}
          width="auto"
          height="auto">
          <ActivityIndicator />
        </Overlay>
        <InternetNotification topDimension={0}/>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
            <View>
              <View>
                <GroupButtonsTitle title={'ОСНОВНЫЕ ДАННЫЕ'} paddingLeft={16}/>
                <FloatingLabelInput
                  label="Название (обязательно)"
                  value={this.state.formField.pillTitle}
                  onChangeText={this.handlePillTitle}
                  maxLength={20}
                />

                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT,
                  }}> {getChosenTitleStr(chosenPillsTitle).length > 0 && 'Тип препарата'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('pillsType', ' Тип препарата')
                    }}
                    style={!getChosenTitleStr(chosenPillsTitle).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 26,
                      paddingBottom: 10,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getChosenTitleStr(chosenPillsTitle).length ? 'Тип препарата' : getChosenTitleStr(chosenPillsTitle)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('pillsType', 'Тип препарата')
                    }}
                  />
                </View>

                <View style={{backgroundColor: Colors.WHITE, marginTop: 24, paddingLeft: 16, paddingRight: 16, paddingTop: 9}}>
                  <Text style={{fontSize: 14, color: Colors.GRAY_TEXT, marginBottom: 9}}>Прикрепить фото</Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                      this.state.formField.pillImagesArr.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{position: 'relative', justifyContent: 'center', marginRight: 16, marginBottom: 16}}
                          >
                           <TouchableOpacity
                             style={{position: 'absolute', top: -10, right: -10, zIndex: 100}}
                             onPress={() => {this.handleRemoveImage(index)}}
                           >
                             <Image
                               style={{width: 20, height: 20}}
                               source={require('../assets/general/close_round.png')}
                             />
                           </TouchableOpacity>
                           <View
                             style={{borderRadius: 12, overflow: 'hidden' }}
                           >
                             <Image
                               style={{width: 80, height: 80 }}
                               source={{uri: item.url}}
                               resizeMode={'cover'}
                             />
                           </View>
                          </View>
                        )
                      })
                    }
                    <TouchableOpacity
                      style={{width: 80, height: 80, borderRadius: 12,  marginBottom: 16, backgroundColor: Colors.TABLE_BORDER, justifyContent: 'center'}}
                      onPress={this.handleAddImage}
                    >
                      <Image
                        style={{width: 24, height: 24, alignSelf: 'center'}}
                        source={require('../assets/general/add_plus.png')}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>
            <View style={[commonStyles.containerIndents, {borderWidth: 0}]}>
              <SubmitButton isEnabled={isEnabled}  title={isFormEdit ? "СОХРАНИТЬ" : "СОЗДАТЬ"}   handleSubmitForm={this.handleSubmitForm}/>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>

      </SafeAreaView>
    )
  }

}

function mapStateToProps(state) {
  console.log(state);
  const pills = state.pills;
  return {
    pillsTypeList: pills.pillsTypeList,
    chosenPillsTypeArr: pills.chosenPillsTypeArr,
    pillsList: pills.pillsList
  }
}

export default connect(mapStateToProps)(CreatePill)

const styles = StyleSheet.create({});
