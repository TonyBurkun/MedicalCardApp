import React, { Component } from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import {connect} from 'react-redux'
import * as Colors from '../utils/colors'

import InternetNotification from '../components/ui_components/InternetNotification'
import FloatingLabelInput from '../components/ui_components/FloatingLabelInput'
import GroupButtonsTitle from '../components/ui_components/GroupButtonsTitle'
import commonStyles from "../utils/commonStyles";
import {generateUniqID, createNewLabel} from '../utils/API'
import {updateLabels} from '../actions/labels'



class CreateLabel extends Component{

  constructor(props){
    super(props);



    this.state = {

      formField: {
        labelTitle: '',
        chosenColor: '',

      },
      colors: [
        {
          value: '#F2453D',
          checked: false
        },
        {
          value: '#E91E63',
          checked: false
        },
        {
          value: '#9C27B0',
          checked: false
        },
        {
          value: '#4054B2',
          checked: false
        },
        {
          value: '#2C98F0',
          checked: false
        },
        {
          value: '#03A9F4',
          checked: false
        },
        {
          value: '#00BCD4',
          checked: false
        },
        {
          value: '#009688',
          checked: false
        },
        {
          value: '#4CAF50',
          checked: false
        },
        {
          value: '#8BC34A',
          checked: false
        },
        {
          value: '#CDDC39',
          checked: false
        },
        {
          value: '#FFC107',
          checked: false
        },
        {
          value: '#FF9800',
          checked: false
        },
        {
          value: '#FF5722',
          checked: false
        },
        {
          value: '#607D8B',
          checked: false
        },
        {
          value: '#9E9E9E',
          checked: false
        },
      ]
    }
  }


  static navigationOptions = ({navigation}) => {

    return {
      // headerLeft: (
      //   <CalendarIcon/>
      // ),
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Создать метку </Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        // borderBottomWidth: 0,


      }
      // headerRight: (
      //   <Avatar/>
      // ),
      // headerStyle: commonStyles.topHeader,

    }
  };


  handleTextChange = (newText) => {
    this.setState({
      formField: {
        ...this.state.formField,
        labelTitle: newText,
      }

    })
  };

  handlePressOnColor = (index) => {
    const {colors} = this.state;

    colors.filter((item) => {
      item.checked = false
    });

    colors[index].checked = true;

    this.setState({
      colors,
      formField: {
        ...this.state.formField,
        chosenColor: colors[index].value
      }
    })
  };

  handleCreateLabel = () => {
    console.log('press create label');
    console.log(this.state);
    // {
    //   id: '001',
    //   title: 'Название',
    //   color: '#00BCD4',
    //   checked: false,
    // }

    const generatedID = generateUniqID();


    const label = {
      id: generatedID,
      title: this.state.formField.labelTitle,
      color: this.state.formField.chosenColor,
      dateModified: new Date().getTime(),
    };





    createNewLabel(label);
    this.props.dispatch(updateLabels(label));
    this.props.navigation.navigate('LabelsList');


  };





  render() {
    console.log(this.state);
    console.log(this.props);
    const {colors} = this.state;
    const {labelTitle, chosenColor} = this.state.formField;
    const isEnabled = labelTitle.length > 0 && chosenColor.length > 0;
    return (
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>

        <View style={{marginTop: 16}}>
          <FloatingLabelInput
            label="Название метки"
            value={this.state.formField.labelTitle}
            onChangeText={this.handleTextChange}
          />
        </View>
        <View style={commonStyles.container}>
          <GroupButtonsTitle title={'ЦВЕТ МЕТКИ'}/>
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            { colors.length &&
              colors.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorItem, {backgroundColor: item.value}]}
                    onPress={() => {this.handlePressOnColor(index)}}>

                    {item.checked &&
                      <Image
                        source={require('../assets/general/check-circle.png')}
                        style={{alignSelf: 'center',  width: 32, height: 32}}
                      />
                    }


                  </TouchableOpacity>
                )
              })
            }
          </View>
          <TouchableOpacity
            disabled={!isEnabled}
            onPress={this.handleCreateLabel}
            style={ isEnabled ? commonStyles.submitBtn : [commonStyles.submitBtn, commonStyles.disabledSubmitBtn ]}
          >
            <Text
              style={ isEnabled ? commonStyles.submitBtnText : [commonStyles.submitBtnText, commonStyles.disabledSubmitBtnText]}
            >СОЗДАТЬ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  const labels = state.labels;

  return(
    labels
  )

}

export default connect(mapStateToProps)(CreateLabel);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND
  },

  colorItem: {
    width: 104,
    height: 56,
    borderRadius: 12,
    marginTop: 16,
    justifyContent: 'center',
  }
});
