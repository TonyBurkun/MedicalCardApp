import React, {Component, Fragment} from 'react'
import {View, Text, Image, FlatList, StyleSheet, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import * as Colors from '../../utils/colors'
import {ListItem, SearchBar, CheckBox, Icon } from 'react-native-elements/src/index'
import DatePicker from "react-native-datepicker";
import commonStyles from "../../utils/commonStyles";
import {SafeAreaView} from 'react-navigation'

import {setChosenChildhoodDiseases} from '../../actions/childhoodDiseases'
import {setChosenVaccinations} from '../../actions/vaccinations'
import {setChosenPregnancyOutcome} from '../../actions/pregnancyOutcome'
import {setChosenGynecologicalDiseases} from '../../actions/gynecologicalDiseases'
import {setChosenDisability} from '../../actions/disability'
import {setChosenBadHabits} from '../../actions/badHabits'
import {setChosenGenitalInfections} from '../../actions/genitalInfections'
import ScreenTitle from "../ui_components/titles/ScreenTitle";
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper/index'
import InternetNotification from '../ui_components/InternetNotification'



class MedicalCardList extends Component{

  constructor(props){
    super(props);

    const listType = this.props.navigation.getParam('listType');
    const radio = this.props.navigation.getParam('radio');

    this.state = {
      listType: listType,
      choseType: radio,
      search: '',
      originData: props[listType],
      data: props[listType],
      refresh: false,
    }
  }

  static navigationOptions = ({ navigation }) => {
   return {
     title: navigation.getParam('screenTitle'),
     headerTitleStyle: {
       fontWeight: 'bold',
       fontSize: 17,
       color: Colors.BLACK_TITLE
     },
   }
  };

  updateSearch = search => {


    this.setState({ search });

    const searchVal = search;
    const listArr = this.state.originData;

    if (searchVal !== '') {
      const searchResultArr = listArr.filter((item) => {
        const value = item.value.toLowerCase();

        return ~value.indexOf(searchVal.toLowerCase());


      });

      this.setState({
        ...this.state,
        search,
        data : searchResultArr
      })


    } else {

      this.setState({
        ...this.state,
        search,
        data : this.state.originData
      })
    }




  };

  onPress = (itemIndex) => {
    const listArr = this.state.data;
    const {choseType} = this.state;

    if (choseType === 'radio') {
      listArr.forEach((item) => {
        item.check = false;
      })
    }

    listArr[itemIndex].check = !listArr[itemIndex].check;

    console.log(listArr);

    this.setState({
      ...this.state,
      data: [
        ...this.state.data
      ]
    })
  };


  renderFlatListItem = ({item, index}) => {
    return (

      <ListItem
        key={index}
        title={item.value}
        onPress={() => {this.onPress(index)}}
        containerStyle={{paddingTop: 9, paddingBottom: 9, paddingLeft: 0, }}
        titleStyle={{fontSize: 14}}
        bottomDivider={true}
        leftAvatar={
          <CheckBox
            checked={item.check}
            onPress={() => {this.onPress(index)}}
            iconType='material'
            checkedIcon='done'
            uncheckedIcon='done'
            uncheckedColor={Colors.WHITE}
            checkedColor={Colors.MAIN_GREEN}
            containerStyle={{margin: 0, padding: 0 }}
          />
        }

        rightAvatar={
          <DatePicker
            locale={'ru'}
            key={index}
            // key={index}
            style={[item.date? styles.filledDatePicker : styles.emptyDatePicker]}
            date={item.date} //initial date from state
            // mode="date" //The enum of date, datetime and time
            format="DD-MM-YYYY"
            minDate="01-01-1930"
            maxDate={new Date()}
            confirmBtnText="Сохранить"
            cancelBtnText="Не добавлять дату"
            // iconSource={require('../assets/datepicker-icon.png')}
            iconComponent={<Icon
              name='calendar'
              type='feather'
              color={Colors.BLACK_TITLE}
            />}
            hideText={!item.date}
            showIcon={!item.date}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                width: 14,
                height: 16,
                left: '50%',
                marginLeft: -7,
                top: '50%',
                marginTop: -8,

              },
              dateInput: {
                alignItems: 'flex-start',
                paddingLeft: 16,
                borderWidth: 0,
                backgroundColor: Colors.WHITE,
              },
              dateText: {
                fontSize: 14,
                color: Colors.MAIN_GREEN,
                fontWeight: 'bold'
              },
              placeholderText: {
                fontSize: 14,
                color: Colors.GRAY_TEXT,
              },

            }}
            onDateChange={(value) => {
              const dataArr = this.state.data;
              dataArr[index].date = value;

              this.setState({
                ...this.state,
                data: dataArr,
                originData: dataArr,
                refresh: !this.state.refresh
              });
            }}
            onOpenModal={()=> {
              const dataArr = this.state.data;
              dataArr[index].date = '';

              this.setState({
                ...this.state,
                data: dataArr,
                originData: dataArr,
                refresh: !this.state.refresh
              });
            }}
          />

        }

      />
    )
  };

  handleSaveBtn = (listType) => {

    const chosenItemsArr = this.state.originData.filter((item) => {
      if (item.check) {
        return item
      }
    });

    switch (listType) {
      case 'childhoodDiseases':
        this.props.dispatch(setChosenChildhoodDiseases(chosenItemsArr));
        break;

      case 'vaccinations':
        this.props.dispatch(setChosenVaccinations(chosenItemsArr));
        break;

      case 'pregnancyOutcome':
        this.props.dispatch(setChosenPregnancyOutcome(chosenItemsArr));
        break;

      case 'gynecologicalDiseases':
        this.props.dispatch(setChosenGynecologicalDiseases(chosenItemsArr));
        break;

      case 'disability':
        this.props.dispatch(setChosenDisability(chosenItemsArr));
        break;

      case 'badHabits':
        this.props.dispatch(setChosenBadHabits(chosenItemsArr));
        break;

      case 'genitalInfections':
        this.props.dispatch(setChosenGenitalInfections(chosenItemsArr));
        break;

      default:
        break;

    }

    this.props.navigation.goBack(null);

  };

  render() {

    console.log(this.state);
    console.log(this.props);

    const { search } = this.state;
    const dataList = this.state.data;




    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.WHITE}}>
        <InternetNotification/>
        <SearchBar
          placeholder="Поиск по названию"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0 }}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />
        {
          dataList.length ? (
           <Fragment>
             <FlatList
               data={dataList}
               extraData={this.state.refresh}
               renderItem={this.renderFlatListItem}
               keyExtractor={(item, index) => index.toString()}
             />
             <View style={{paddingTop: 15, paddingLeft: 16, paddingRight: 16, backgroundColor: Colors.WHITE, ...ifIphoneX({paddingBottom: 0},{paddingBottom: 20})}}>
               <TouchableOpacity
                 style={[commonStyles.submitBtn]}
                 onPress={() => this.handleSaveBtn(this.state.listType)}
               >
                 <Text style={commonStyles.submitBtnText}>Сохранить</Text>
               </TouchableOpacity>
             </View>
           </Fragment>
          ) : (
            <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16,}}>
              <Text>К сожалению, список пуст</Text>
            </View>
          )
        }
      </SafeAreaView>
    )
  }
}

function mapStateToProps (state) {
  console.log(state);

  const {childhoodDiseases} = state.childhoodDiseases;
  const {vaccinations} = state.vaccinations;
  const {pregnancyOutcome} = state.pregnancyOutcome;
  const {gynecologicalDiseases} = state.gynecologicalDiseases;
  const {disability} = state.disability;
  const {badHabits} = state.badHabits;
  const {genitalInfections} = state.genitalInfections;

  return {
    childhoodDiseases,
    vaccinations,
    pregnancyOutcome,
    gynecologicalDiseases,
    disability,
    badHabits,
    genitalInfections
  }
}

export default connect(mapStateToProps)(MedicalCardList)


const styles = StyleSheet.create({
  emptyDatePicker: {
    width: 50
  },
  filledDatePicker: {
    width: 110
  },
});

