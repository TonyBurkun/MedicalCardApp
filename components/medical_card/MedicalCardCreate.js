import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Switch} from 'react-native'
import {Icon} from 'react-native-elements/src/index'
import {SafeAreaView} from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view/index'
import ScreenTitle from '../ui_components/titles/ScreenTitle'
import FloatingLabelInput from '../ui_components/FloatingLabelInput'
import * as Colors from '../../utils/colors'
import commonStyles from '../../utils/commonStyles'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MedicalCardList from "./MedicalCardList";

import {connect} from 'react-redux'
import {setAllergicReactions} from '../../actions/allergicReactions'
import {setChildhoodDiseases, setChosenChildhoodDiseases} from '../../actions/childhoodDiseases'
import {setChosenVaccinations, setVaccinations} from '../../actions/vaccinations'
import {setChosenPregnancyOutcome, setPregnancyOutcome} from '../../actions/pregnancyOutcome'
import {setChosenGynecologicalDiseases, setGynecologicalDiseases} from '../../actions/gynecologicalDiseases'
import {setTransferredIVF} from '../../actions/transferredIVF'
import {setChosenDisability, setDisability} from '../../actions/disability'
import {setBadHabits, setChosenBadHabits} from '../../actions/badHabits'
import {setChosenGenitalInfections, setGenitalInfections} from '../../actions/genitalInfections'
import {setOther} from '../../actions/other'
import {getChildhoodDiseases, getCurrentUserData, getMedicalCardByID} from '../../utils/API';
import {getVaccinations} from '../../utils/API';
import {getPregnancyOutcome} from '../../utils/API';
import {getGynecologicalDiseases} from '../../utils/API';
import {getDisability} from '../../utils/API';
import {getBadHabits} from '../../utils/API';
import {getGenitalInfections} from '../../utils/API';

import {generateUniqID, createMedicalCardInDB, getUIDfromFireBase, updateMedicalCardInDB, updateUserData, addMedicalCardIDtoCurrentUser} from '../../utils/API'
import {ifIphoneX} from "react-native-iphone-x-helper/index";
import withNavigation from "react-navigation/src/views/withNavigation";
import {updateCurrentUserData} from "../../actions/authedUser";


class MedicalCardCreate extends Component {
  constructor(props) {
    super(props);

    let isProfile = false;
    let medicalCardID = null;
    const navigationParams = this.props.navigation.state.params;
    console.log(navigationParams);

    if (Boolean(navigationParams) && Boolean(navigationParams.profile !== undefined)) {
      isProfile = this.props.navigation.state.params.profile;
    }

    if (Boolean(navigationParams) && Boolean(navigationParams.medicalCardID !== undefined)) {
      medicalCardID = this.props.navigation.state.params.medicalCardID;
    }



    this.state = {
      isProfile,
      medicalCardID,
      childhoodDiseases: [],
      formField: {
        allergicReactions: '',
        transferredIVF: false,
        other: ''
      },
      screenHeight: 0,


    }
  }

 async componentDidMount() {

    getChildhoodDiseases()
      .then(success => {
        this.props.dispatch(setChildhoodDiseases(success));
      })
      .catch(error => {
        console.log('You can not download the Childhood Diseases list: ', error);
      });

    getVaccinations()
      .then(success => {
        this.props.dispatch(setVaccinations(success));
      })
      .catch(error => {
        console.log('You can not download the Vaccinations list: ', error);
      });

    getPregnancyOutcome()
      .then(success => {
        this.props.dispatch(setPregnancyOutcome(success));
      })
      .catch(error => {
        console.log('You can not download the Pregnancy Outcome list: ', error);
      });

    getGynecologicalDiseases()
      .then(success => {
        this.props.dispatch(setGynecologicalDiseases(success));
      })
      .catch(error => {
        console.log('You can not download the Gynecological Diseases list: ', error);
      });

    getDisability()
      .then(success => {
        this.props.dispatch(setDisability(success));
      })
      .catch(error => {
        console.log('You can not download the Disability list: ', error);
      });

    getBadHabits()
      .then(success => {
        this.props.dispatch(setBadHabits(success));
      })
      .catch(error => {
        console.log('You can not download the Bad Habits list: ', error);
      });

    getGenitalInfections()
      .then(success => {
        this.props.dispatch(setGenitalInfections(success));
      })
      .catch(error => {
        console.log('You can not download the Genital Infections list: ', error);
      });

    const {medicalCardID} = this.state;

    if (medicalCardID) {
      getMedicalCardByID(medicalCardID)
        .then( data => {
          console.log(data);
          this.setState({
            ...this.state,
            formField: {
              ...this.state.formField,
              allergicReactions: data.allergicReactions,
              transferredIVF: data.transferredIVF,
              other: data.other
            }
          });
          // this.props.dispatch(setAllergicReactions(data.allergicReactions || ''));
          // this.props.dispatch(setTransferredIVF(data.transferredIVF || false));
          // this.props.dispatch(setOther(data.other || ''));
          this.props.dispatch(setChosenChildhoodDiseases(data.chosenChildhoodDiseases || []));
          this.props.dispatch(setChosenVaccinations(data.chosenVaccinations || []));
          this.props.dispatch(setChosenPregnancyOutcome(data.chosenPregnancyOutcome || []));
          this.props.dispatch(setChosenGynecologicalDiseases(data.chosenGynecologicalDiseases || []));
          this.props.dispatch(setChosenDisability(data.chosenDisability || []));
          this.props.dispatch(setChosenBadHabits(data.chosenBadHabits || []));
          this.props.dispatch(setChosenGenitalInfections(data.chosenGenitalInfections || []));


        })
        .catch(error => {
          alert(error);
          console.log('There is an error while getting Medical Card data by ID: ', error)
        });
    }




  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    const {medicalCard} = nextProps;

    if (medicalCard.chosenChildhoodDiseases.length) {
      let {childhoodDiseases} = this.props;
      medicalCard.chosenChildhoodDiseases.forEach(item => {
        childhoodDiseases[item.id].check = true;
        childhoodDiseases[item.id].date = item.date;

      })
    }


    if (medicalCard.chosenVaccinations.length) {
      let {vaccinations} = this.props;
      medicalCard.chosenVaccinations.forEach(item => {
        vaccinations[item.id].check = true;
        vaccinations[item.id].date = item.date;
      })
    }

    if (medicalCard.chosenPregnancyOutcome.length) {
      let {pregnancyOutcome} = this.props;
      medicalCard.chosenPregnancyOutcome.forEach(item => {
        pregnancyOutcome[item.id].check = true;
        pregnancyOutcome[item.id].date = item.date;
      })
    }

    if ((medicalCard.chosenGynecologicalDiseases.length)) {
      let {gynecologicalDiseases} = this.props;
      medicalCard.chosenGynecologicalDiseases.forEach(item => {
        gynecologicalDiseases[item.id].check = true;
        gynecologicalDiseases[item.id].date = item.date;

      })
    }

    if ((medicalCard.chosenDisability.length)) {
      let {disability} = this.props;
      medicalCard.chosenDisability.forEach(item => {
        disability[item.id].check = true;
        disability[item.id].date = item.date;
      })
    }

    if ((medicalCard.chosenBadHabits.length)) {
      let {badHabits} = this.props;
      medicalCard.chosenBadHabits.forEach(item => {
        badHabits[item.id].check = true;
        badHabits[item.id].date = item.date;
      })
    }

    if ((medicalCard.chosenGenitalInfections.length)) {
      let {genitalInfections} = this.props;
      medicalCard.chosenGenitalInfections.forEach(item => {
        genitalInfections[item.id].check = true;
        genitalInfections[item.id].date = item.date;

      })
    }


  }

  componentWillUnmount(){
    this.props.dispatch(setAllergicReactions(''));
    this.props.dispatch(setTransferredIVF( false));
    this.props.dispatch(setOther(''));
    this.props.dispatch(setChosenChildhoodDiseases([]));
    this.props.dispatch(setChosenVaccinations([]));
    this.props.dispatch(setChosenPregnancyOutcome([]));
    this.props.dispatch(setChosenGynecologicalDiseases([]));
    this.props.dispatch(setChosenDisability([]));
    this.props.dispatch(setChosenBadHabits([]));
    this.props.dispatch(setChosenGenitalInfections([]));
  }

  handleTextChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        allergicReactions: newText,
      }

    });
  };


  showItemsList = (param, screenTitle, radio = '') => {

    console.log(param);

    if (this.state.isProfile){
      this.props.navigation.navigate('ProfileMedicalCardList', {listType: param, screenTitle: screenTitle, radio: radio});
    } else {
      this.props.navigation.navigate('MedicalCardList', {listType: param, screenTitle: screenTitle, radio: radio});
    }

  };

  handleSaveBtn = () => {
    const {isProfile} = this.state;

    const {allergicReactions, other, transferredIVF} = this.state.formField;
    const {
      chosenChildhoodDiseases,
      chosenVaccinations,
      chosenPregnancyOutcome,
      chosenGynecologicalDiseases,
      chosenDisability,
      chosenBadHabits,
      chosenGenitalInfections
    } = this.props.medicalCard;

    const medicalCardDataObj = {
      allergicReactions,
      chosenChildhoodDiseases,
      chosenVaccinations,
      chosenPregnancyOutcome,
      chosenGynecologicalDiseases,
      transferredIVF,
      chosenDisability,
      chosenBadHabits,
      chosenGenitalInfections,
      other,
      dateModified: new Date().getTime(),
    };

    this.props.dispatch(setAllergicReactions(this.state.formField.allergicReactions));
    this.props.dispatch(setTransferredIVF(this.state.formField.transferredIVF));
    this.props.dispatch(setOther(this.state.formField.other));

    if (!isProfile){
      //This code run when the user fill Medical Card not in the Profile.
      //Create Medical Card during the creation the new USER


      const UID = getUIDfromFireBase();
      const generatedID = generateUniqID();
      createMedicalCardInDB(generatedID, {uid: UID});
      updateMedicalCardInDB(generatedID, medicalCardDataObj);
      addMedicalCardIDtoCurrentUser(generatedID);

      this.props.navigation.navigate('MainNavigation');
    }

    if (isProfile){
      //Updating the Medical Card from Profile screen

      const {medicalCardID} = this.state;


      console.log(medicalCardID);
      console.log(medicalCardDataObj);
      updateMedicalCardInDB(medicalCardID, medicalCardDataObj);
      this.props.navigation.goBack();
    }

  };

  render() {
    console.log(this.state);
    console.log(this.props);

    const {isProfile} = this.state;



    const {
      chosenChildhoodDiseases,
      chosenVaccinations,
      chosenPregnancyOutcome,
      chosenGynecologicalDiseases,
      chosenDisability,
      chosenBadHabits,
      chosenGenitalInfections
    } = this.props.medicalCard;

    function getChildhoodDiseasesTitleStr (chosenChildhoodDiseases) {
     let chosenChildhoodDiseasesTitleStr = '';
     if (chosenChildhoodDiseases.length) {
       chosenChildhoodDiseases.forEach((item) => {
         chosenChildhoodDiseasesTitleStr = chosenChildhoodDiseasesTitleStr + item.value + ', '
       });
       chosenChildhoodDiseasesTitleStr = chosenChildhoodDiseasesTitleStr.substr(0, chosenChildhoodDiseasesTitleStr.length - 2);
     }

     return chosenChildhoodDiseasesTitleStr;
   }
    function getVaccinationsTitleStr (chosenVaccinations) {
     let chosenVaccinationsTitleStr = '';

     if (chosenVaccinations.length) {
       chosenVaccinations.forEach((item) => {
         chosenVaccinationsTitleStr = chosenVaccinationsTitleStr + item.value + ', '
       });
       chosenVaccinationsTitleStr = chosenVaccinationsTitleStr.substr(0, chosenVaccinationsTitleStr.length - 2);
     }

     return chosenVaccinationsTitleStr;
   }
    function getPregnancyOutcomeTitleStr (chosenPregnancyOutcome) {
      let chosenPregnancyOutcomeTitleStr = '';

      if (chosenPregnancyOutcome.length) {
        chosenPregnancyOutcome.forEach((item) => {
          chosenPregnancyOutcomeTitleStr = chosenPregnancyOutcomeTitleStr + item.value + ', '
        });
        chosenPregnancyOutcomeTitleStr = chosenPregnancyOutcomeTitleStr.substr(0, chosenPregnancyOutcomeTitleStr.length - 2);
      }

      return chosenPregnancyOutcomeTitleStr;
    }
    function getGynecologicalDiseasesTitleStr (chosenGynecologicalDiseases) {
      let chosenGynecologicalDiseasesTitleStr = '';

      if (chosenGynecologicalDiseases.length) {
        chosenGynecologicalDiseases.forEach((item) => {
          chosenGynecologicalDiseasesTitleStr = chosenGynecologicalDiseasesTitleStr + item.value + ', '
        });
        chosenGynecologicalDiseasesTitleStr = chosenGynecologicalDiseasesTitleStr.substr(0, chosenGynecologicalDiseasesTitleStr.length - 2);
      }

      return chosenGynecologicalDiseasesTitleStr;
    }
    function getDisabilityTitleStr (chosenDisability) {
      let chosenDisabilityTitleStr = '';

      if (chosenDisability.length) {
        chosenDisability.forEach((item) => {
          chosenDisabilityTitleStr = chosenDisabilityTitleStr + item.value + ', '
        });
        chosenDisabilityTitleStr = chosenDisabilityTitleStr.substr(0, chosenDisabilityTitleStr.length - 2);
      }

      return chosenDisabilityTitleStr;
    }
    function getBadHabitsTitleStr (chosenBadHabits) {
      let chosenBadHabitsTitleStr = '';

      if (chosenBadHabits.length) {
        chosenBadHabits.forEach((item) => {
          chosenBadHabitsTitleStr = chosenBadHabitsTitleStr + item.value + ', '
        });
        chosenBadHabitsTitleStr = chosenBadHabitsTitleStr.substr(0, chosenBadHabitsTitleStr.length - 2);
      }

      return chosenBadHabitsTitleStr;
    }
    function getGenitalInfectionsTitleStr (chosenGenitalInfections) {
      let chosenGenitalInfectionsTitleStr = '';

      if (chosenGenitalInfections.length) {
        chosenGenitalInfections.forEach((item) => {
          chosenGenitalInfectionsTitleStr = chosenGenitalInfectionsTitleStr + item.value + ', '
        });
        chosenGenitalInfectionsTitleStr = chosenGenitalInfectionsTitleStr.substr(0, chosenGenitalInfectionsTitleStr.length - 2);
      }

      return chosenGenitalInfectionsTitleStr;
    }


    console.log(this.props);


    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0, paddingBottom: 0}]}>
        <KeyboardAwareScrollView>
          <ScrollView
            alwaysBounceVertical={false}
            contentContainerStyle={{flex: 1,justifyContent: 'space-between'}}>

            {!isProfile &&
              <View
                style={{paddingLeft: 16, paddingRight: 16}}>
                <ScreenTitle
                  titleText={'МЕДИЦИНСКАЯ КАРТА'} marginTop={48}/>
                <Text style={[commonStyles.subTitle, {textAlign: 'left', marginTop: 10, marginBottom: 0}]}>Вы можете
                  заполнить только подходящие для Вас блоки</Text>
              </View>
            }

            <View style={commonStyles.tableBlock}>
              <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>ОСНОВНЫЕ РАЗДЕЛЫ</Text>

              <View>
                {/* allergicReactions block */}
                <View>
                  <FloatingLabelInput
                    label="Алергические реакции"
                    value={this.state.formField.allergicReactions}
                    onChangeText={this.handleTextChange}
                  />
                </View>

                {/* Childhood Diseases block */}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getChildhoodDiseasesTitleStr(chosenChildhoodDiseases).length > 0 && 'Перенесенные детские заболевания'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('childhoodDiseases', 'Детские заболевания')
                    }}
                    style={!getChildhoodDiseasesTitleStr(chosenChildhoodDiseases).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getChildhoodDiseasesTitleStr(chosenChildhoodDiseases).length ? 'Перенесенные детские заболевания' : getChildhoodDiseasesTitleStr(chosenChildhoodDiseases)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('childhoodDiseases', 'Детские заболевания')
                    }}
                  />
                </View>

                {/* Vaccinations block*/}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getVaccinationsTitleStr(chosenVaccinations).length > 0 && 'Наличие прививок'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('vaccinations', 'Прививки')
                    }}
                    style={!getVaccinationsTitleStr(chosenVaccinations).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getVaccinationsTitleStr(chosenVaccinations).length ? 'Наличие прививок' : getVaccinationsTitleStr (chosenVaccinations)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('vaccinations', 'Прививки')
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={commonStyles.tableBlock}>
              <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>АКУШЕРСКИЙ АНАМНЕЗ</Text>

              <View>

                {/* Pregnancy block*/}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getPregnancyOutcomeTitleStr(chosenPregnancyOutcome).length > 0 && 'Исходы беременности'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('pregnancyOutcome', 'Исходы беременности')
                    }}
                    style={!getPregnancyOutcomeTitleStr(chosenPregnancyOutcome).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getPregnancyOutcomeTitleStr(chosenPregnancyOutcome).length ? 'Исходы беременности' : getPregnancyOutcomeTitleStr(chosenPregnancyOutcome)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('pregnancyOutcome', 'Исходы беременности')
                    }}
                  />
                </View>

                {/* Gynecological Diseases block */}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getGynecologicalDiseasesTitleStr(chosenGynecologicalDiseases).length > 0 && 'Гинекологические заболевания'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('gynecologicalDiseases', 'Гинекологические заболевания')
                    }}
                    style={!getGynecologicalDiseasesTitleStr(chosenGynecologicalDiseases).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getGynecologicalDiseasesTitleStr (chosenGynecologicalDiseases).length ? 'Гинекологические заболевания' : getGynecologicalDiseasesTitleStr(chosenGynecologicalDiseases)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('gynecologicalDiseases', 'Гинекологические заболевания')
                    }}
                  />
                </View>

                {/*  \Transferred IVF block */}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text
                    style={commonStyles.tableBlockItemText}>
                    Перенесенные ЭКО
                  </Text>
                  <Switch
                    style={{position: 'absolute', right: 16, top: '50%', marginTop: -16}}
                    value={this.state.formField.transferredIVF}
                    onValueChange={() => {
                      this.setState({
                        formField: {
                          ...this.state.formField,
                          transferredIVF: !this.state.formField.transferredIVF

                        }
                      });
                      // this.props.dispatch(setTransferredIVF(!this.state.formField.transferredIVF));
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={commonStyles.tableBlock}>
              <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>ДОПОЛНИТЕЛЬНО</Text>

              <View>

                {/* Disability block*/}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getDisabilityTitleStr(chosenDisability).length > 0 && 'Наличие инвалидности'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('disability', 'Наличие инвалидности', 'radio')
                    }}
                    style={!getDisabilityTitleStr(chosenDisability).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getDisabilityTitleStr(chosenDisability).length ? 'Наличие инвалидности' : getDisabilityTitleStr (chosenDisability)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('disability', 'Наличие инвалидности', 'radio')
                    }}
                  />
                </View>

                {/* Bad Habits  block */}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getBadHabitsTitleStr(chosenBadHabits).length > 0 && 'Наличие вредных привычек'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('badHabits', 'Наличие вредных привычек')
                    }}
                    style={!getBadHabitsTitleStr(chosenBadHabits).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getBadHabitsTitleStr (chosenBadHabits).length ? 'Наличие вредных привычек' : getBadHabitsTitleStr(chosenBadHabits)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('badHabits', 'Наличие вредных привычек')
                    }}
                  />
                </View>

                {/*  genitalInfections block */}
                <View
                  style={[commonStyles.tableBlockItem, {position: 'relative'}]}>
                  <Text style={{
                    position: 'absolute',
                    left: 12,
                    top: 5,
                    fontSize: 14,
                    color: Colors.GRAY_TEXT
                  }}> {getGenitalInfectionsTitleStr(chosenGenitalInfections).length > 0 && 'Половые инфекции'}</Text>
                  <Text
                    onPress={() => {
                      this.showItemsList('genitalInfections', 'Половые инфекции')
                    }}
                    style={!getGenitalInfectionsTitleStr(chosenGenitalInfections).length ? commonStyles.tableBlockItemText : [commonStyles.tableBlockItemText, {
                      paddingTop: 28,
                      fontSize: 16,
                      color: Colors.TYPOGRAPHY_COLOR_DARK
                    }]}>
                    {!getGenitalInfectionsTitleStr(chosenGenitalInfections).length ? 'Половые инфекции' : getGenitalInfectionsTitleStr(chosenGenitalInfections)}
                  </Text>
                  <Icon
                    name='chevron-right'
                    type='evilicon'
                    color={Colors.GRAY_TEXT}
                    size={40}
                    containerStyle={{position: 'absolute', right: 0, top: '50%', marginTop: -16}}
                    onPress={() => {
                      this.showItemsList('genitalInfections', 'Половые инфекции')
                    }}
                  />
                </View>

              </View>
            </View>

            <View style={commonStyles.tableBlock}>
              <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>ДРУГОЕ</Text>

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
              <TouchableOpacity
                style={[commonStyles.submitBtn, {...ifIphoneX({marginBottom: 22},{marginBottom: 20})}]}
                onPress={this.handleSaveBtn}
              >
                <Text style={commonStyles.submitBtnText}>Сохранить</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  console.log(state);

  return {
    childhoodDiseases: state.childhoodDiseases.childhoodDiseases,
    vaccinations: state.vaccinations.vaccinations,
    pregnancyOutcome: state.pregnancyOutcome.pregnancyOutcome,
    gynecologicalDiseases: state.gynecologicalDiseases.gynecologicalDiseases,
    disability: state.disability.disability,
    badHabits: state.badHabits.badHabits,
    genitalInfections: state.genitalInfections.genitalInfections,

   medicalCard: {
     allergicReactions: state.allergicReactions.allergicReactions,
     chosenChildhoodDiseases: state.childhoodDiseases.chosenChildhoodDiseases,
     chosenVaccinations: state.vaccinations.chosenVaccinations,
     chosenPregnancyOutcome: state.pregnancyOutcome.chosenPregnancyOutcome,
     chosenGynecologicalDiseases: state.gynecologicalDiseases.chosenGynecologicalDiseases,
     transferredIVF: state.transferredIVF.transferredIVF,
     chosenDisability: state.disability.chosenDisability,
     chosenBadHabits: state.badHabits.chosenBadHabits,
     chosenGenitalInfections: state.genitalInfections.chosenGenitalInfections,
     other: state.other.other,
   }
  }
}

export default withNavigation(connect(mapStateToProps)(MedicalCardCreate))

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
