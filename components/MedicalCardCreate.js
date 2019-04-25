import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import ScreenTitle from './ui_components/ScreenTitle'
import FloatingLabelInput from './ui_components/FloatingLabelInput'
import * as Colors from '../utils/colors'
import commonStyles from '../utils/commonStyles'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MedicalCardList from "./MedicalCardList";

import {connect} from 'react-redux'
import {setChildhoodDiseases} from '../actions/childhoodDiseases'

import {getChildhoodDiseases} from '../utils/API';



//TODO: add vector icon to the table list



class MedicalCardCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      childhoodDiseases: [],
      formField: {
        allergicReactions: '',
      },
      screenHeight: 0,


    }
  }

  componentDidMount(){

    getChildhoodDiseases()
      .then(success => {

        this.props.dispatch(setChildhoodDiseases(success));

      })
      .catch(error => {
        console.log('You can not download the Childhood Diseases list: ' , error);
      })

  }


  handleSubmitForm = () => {
    console.log('sumbit form');


  };

  handleLogOut = () => {
    const {navigation} = this.props;
    signOut(navigation);
  };

  handlePassBtn= () => {
    this.props.navigation.navigate('App');
  };

  handleTextChange = (newText) => {
    this.setState({
      formField:{
        ...this.state.formField,
        allergicReactions: newText,
      }

    })
  };



  showItemsList = (param) => {
    console.log(param);
    this.props.navigation.navigate('MedicalCardList', {listType: param});
  };

  render() {

    console.log(this.state);

    return (
      <SafeAreaView style={[commonStyles.container, {paddingLeft: 0, paddingRight: 0}]}>
        <View>
         <View
            style={{paddingLeft: 16, paddingRight: 16}}>
           <ScreenTitle
             titleText={'МЕДИЦИНСКАЯ КАРТА'} marginTop={48}/>
           <Text style={[commonStyles.subTitle, {textAlign: 'left', marginTop: 10, marginBottom: 0}]}>Вы можете заполнить только подходящие для Вас блоки</Text>
         </View>

          <View style={commonStyles.tableBlock}>
            <Text style={[commonStyles.tableBlockTitle, {paddingLeft: 16}]}>ОСНОВНЫЕ РАЗДЕЛЫ</Text>

            <View>

              <View>
                <FloatingLabelInput
                  label="Алергические реакции"
                  value={this.state.formField.allergicReactions}
                  onChangeText={this.handleTextChange}
                />
              </View>
             <View
               style={commonStyles.tableBlockItem}>
               <Text
                 onPress={() => {this.showItemsList('childhoodDiseases')}}
                 style={commonStyles.tableBlockItemText}>
                 Перенесенные детские заболевания
               </Text>
             </View>
              <View
                style={commonStyles.tableBlockItem}>
                <Text
                  style={commonStyles.tableBlockItemText}>
                  Наличие прививок
                </Text>
              </View>
            </View>
          </View>

        </View>
      </SafeAreaView>
    )
  }
}

function mapStateToProps (state) {
  console.log(state);


  return {
    childhoodDiseases: state.childhoodDiseases
  }
}

export default connect(mapStateToProps)(MedicalCardCreate)

const styles = StyleSheet.create({});
