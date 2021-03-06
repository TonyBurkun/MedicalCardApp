import React, {Component} from 'react'
import {View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet} from 'react-native'
import * as Colors from "../../utils/colors";
import commonStyles from "../../utils/commonStyles";
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import InternetNotification from "../ui_components/InternetNotification";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view/index";
import GroupButtonsTitle from "../ui_components/titles/GroupButtonsTitle";
import FloatingLabelInput from "../ui_components/FloatingLabelInput";
import {Icon, Rating, AirbnbRating} from "react-native-elements/src/index";
import {connect} from 'react-redux'
import {generateUniqID, getDoctorSpecializations} from "../../utils/API";
import {getUIDfromFireBase, createNewDoctor, updateChosenDoctor} from '../../utils/API'
import {setDoctorSpecializations, setChosenDoctorSpecializations} from "../../actions/doctorSpecializations";
import {addDoctor, updateDoctor} from "../../actions/doctors";
import PhoneLabelInput from "../ui_components/InputField/PhoneLabelInput";
import SubmitButton from '../ui_components/Buttons/SubmitButton'
import {isIphone5} from "../../utils/helpers";
import {saveChosenPillsType} from "../../actions/pills";
import {BooleanLiteral} from "@babel/types/lib/index";



class CreateDoctor extends Component{

  constructor(props) {
    super(props);

    this.state = {
      isFormEdit: Boolean(this.props.navigation.state.params),
      formField: {
        firstName: '',
        lastName: '',
        specializations: [],
        jobLocation: '',
        cellPhone: '',
        addCellPhone: '',
        comment: '',
        rating: 0
      }
    }
  }


  static navigationOptions = ({navigation}) => {

    const isEditForm = Boolean(navigation.state.params);


    return {
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}> {isEditForm ? ('Редактировать Доктора') : ('Создать Доктора')} </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
      }
    }
  };

    componentDidMount(){
    console.log('DID MOUNT START');

    const {isFormEdit} = this.state;

    if (isFormEdit) {
      const id = this.props.navigation.state.params.doctorID;
      const editedDoctor = this.props.doctorsList[id];

       this.setState({
        ...this.state,
        formField: {
          ...this.state.formField,
          firstName: editedDoctor.firstName,
          lastName: editedDoctor.lastName,
          specializations: editedDoctor.specializations,
          jobLocation: editedDoctor.jobLocation,
          cellPhone: editedDoctor.cellPhone,
          addCellPhone: editedDoctor.addCellPhone,
          comment: editedDoctor.comment,
          rating: editedDoctor.rating
        }
      });


      this.props.dispatch(setChosenDoctorSpecializations(editedDoctor.specializations));
    }

  }

   componentDidUpdate(prevProps, prevState){

     if (prevProps.chosenDoctorSpecializations !== this.props.chosenDoctorSpecializations) {
        this.setState({
         ...this.state,
         formField: {
           ...this.state.formField,
           specializations: this.props.chosenDoctorSpecializations
         }
       });
     }

  }


  componentWillMount(){
    this.props.dispatch(setChosenDoctorSpecializations([]));
  }

  handleFirstNameChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        firstName: newText,
      }
    })
  };

  handleLastNameChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        lastName: newText,
      }
    })
  };

  handleJobLocationChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        jobLocation: newText,
      }
    })
  };

  handleCellPhoneChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        cellPhone: newText,
      }
    })
  };

  handleAddCellPhoneChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        addCellPhone: newText,
      }
    })
  };

  showItemsList = (param, screenTitle) => {
    console.log(this.state.formField.specializations);
    console.log(this.props.chosenDoctorSpecializations);

    if (this.state.isFormEdit){
      this.props.navigation.navigate('ChoseDoctorSpecializations', {listType: param, screenTitle: screenTitle, prevData: this.state.formField.specializations});
    } else {
      this.props.navigation.navigate('ChoseDoctorSpecializations', {listType: param, screenTitle: screenTitle, prevData: this.props.chosenDoctorSpecializations});
    }



  };

  ratingCompleted = (rating) => {
    this.setState({
      formField: {
        ...this.state.formField,
        rating: rating

      }
    })
  };

  handleSubmitForm = () => {
    console.log('submit');

    if (this.state.isFormEdit) {
      const id = this.props.navigation.state.params.doctorID;
      const uid = getUIDfromFireBase();

      const doctorData = {
        id: id,
        firstName: this.state.formField.firstName,
        lastName: this.state.formField.lastName,
        specializations: this.state.formField.specializations,
        jobLocation: this.state.formField.jobLocation,
        cellPhone: this.state.formField.cellPhone,
        addCellPhone: this.state.formField.addCellPhone,
        comment: this.state.formField.comment,
        rating: this.state.formField.rating,
        createdByUser: uid,
        dateModified: new Date().getTime(),
      };

      updateChosenDoctor(id, doctorData);
      this.props.dispatch(updateDoctor(doctorData));
      this.props.dispatch(setChosenDoctorSpecializations([]));
      // this.props.navigation.navigate('DoctorsTab');
      this.props.navigation.goBack();


    } else {
      const {firstName, lastName, specializations, jobLocation, cellPhone, addCellPhone, comment, rating } = this.state.formField;
      const uid = getUIDfromFireBase();
      const generatedID = generateUniqID();


      const data = {
        id: generatedID,
        firstName,
        lastName,
        specializations,
        jobLocation,
        cellPhone,
        addCellPhone,
        comment,
        rating,
        createdByUser: uid,
        dateModified: new Date().getTime(),
      };

      // console.log(data);

      createNewDoctor(data);
      this.props.dispatch(addDoctor(data));
      this.props.dispatch(setChosenDoctorSpecializations([]));
      this.props.navigation.goBack();

    }

  };



  render(){


    console.log(this.state);
    console.log(this.props);


    const {doctorSpecializations} = this.props;
    const chosenDoctorSpecializations = this.state.formField.specializations;
    const {firstName, lastName, specializations, jobLocation, cellPhone, addCellPhone, comment, rating } = this.state.formField;
    const {isFormEdit} = this.state;


    const isEnabled = lastName.length > 0 && specializations.length > 0 && cellPhone.length > 0 &&  jobLocation.length > 0 ;

    let chosenDoctorSpecializationsTitle = chosenDoctorSpecializations.map((item) => {
        return doctorSpecializations[item];

    });

    console.log(chosenDoctorSpecializationsTitle);

    function getChosenTitleStr (specializations) {
      let chosenTitlesStr = '';

      if (specializations.length) {
        specializations.forEach((item) => {
          chosenTitlesStr = chosenTitlesStr + item + ', '
        });
        chosenTitlesStr = chosenTitlesStr.substr(0, chosenTitlesStr.length - 2);
      }
      return chosenTitlesStr;
    }



    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0}]}>
        <InternetNotification/>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          // scrollEnabled={isIphone5()}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
            <View>
              <View>
                <GroupButtonsTitle title={'ОСНОВНЫЕ ДАННЫЕ'} paddingLeft={16}/>
                <FloatingLabelInput
                  label="Имя, Отчество"
                  value={this.state.formField.firstName}
                  onChangeText={this.handleFirstNameChange}
                  maxLength={20}
                />
                <FloatingLabelInput
                  label="Фамилия (обязательно)"
                  value={this.state.formField.lastName}
                  onChangeText={this.handleLastNameChange}
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
                  }}> {getChosenTitleStr(chosenDoctorSpecializationsTitle).length > 0 && 'Специализация (обязательно)'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('doctorSpecializations', 'Специализации')
                    }}
                    style={!getChosenTitleStr(chosenDoctorSpecializationsTitle).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 26,
                      paddingBottom: 10,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getChosenTitleStr(chosenDoctorSpecializationsTitle).length ? 'Специализация (обязательно)' : getChosenTitleStr(chosenDoctorSpecializationsTitle)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('doctorSpecializations', 'Специализации')
                    }}
                  />
                </View>

                <GroupButtonsTitle title={'ДОПОЛНИТЕЛЬНЫЕ ДАННЫЕ'} paddingLeft={16}/>
                <FloatingLabelInput
                  label="Место работы (Обязательно)"
                  value={this.state.formField.jobLocation}
                  onChangeText={this.handleJobLocationChange}
                />
                <PhoneLabelInput
                  label="Мобильный номер (Обязательно)"
                  value={this.state.formField.cellPhone}
                  onChangeText={this.handleCellPhoneChange}
                />
                <PhoneLabelInput
                  label="Дополнительный номер"
                  value={this.state.formField.addCellPhone}
                  onChangeText={this.handleAddCellPhoneChange}
                />
              </View>

              <View style={commonStyles.tableBlock}>
                <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>КОМЕНТАРИЙ</Text>

                <View style={{paddingLeft: 16, paddingRight: 16}}>
                  <TextInput
                    style={styles.textArea}
                    editable = {true}
                    multiline = {true}
                    placeholder={'Введите текст'}
                    value={this.state.formField.comment}
                    onChangeText={(text) => {
                      this.setState({
                        ...this.state,
                        formField: {
                          ...this.state.formField,
                          comment: text
                        }
                      })
                    }}
                  />
                </View>
              </View>

              <View style={{marginTop: 24}}>
                <Text style={{fontSize: 16, color: Colors.TYPOGRAPHY_COLOR_DARK, textAlign: 'center', marginBottom: 16}}>Оцените
                  доктора</Text>
                <AirbnbRating
                  showRating={false}
                  defaultRating={this.state.formField.rating}
                  onFinishRating={this.ratingCompleted}
                />
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


function mapStateToProps (state) {

  console.log(state);

  return {
    doctorSpecializations: state.doctors.doctorSpecializations,
    chosenDoctorSpecializations: state.doctors.chosenDoctorSpecializations,
    doctorsList: state.doctors.doctorsList,

  }
}

export default connect(mapStateToProps)(CreateDoctor)

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



