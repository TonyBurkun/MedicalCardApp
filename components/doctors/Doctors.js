import React, {Component, Fragment} from 'react'
import {View, Text, Image, StyleSheet, Platform, Dimensions, FlatList, TouchableHighlight} from 'react-native'
import {ButtonGroup, SearchBar} from 'react-native-elements/src/index'
import {connect} from 'react-redux'
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import InternetNotification from "../ui_components/InternetNotification";
import * as Colors from "../../utils/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {convertObjToArr, isIphone5} from '../../utils/helpers'

import {
  getDoctorsList,
  getDoctorSpecializations,
  getUIDfromFireBase,
  deleteDoctorByID,
  getNotesListByCurrentUser, updateChosenNote
} from '../../utils/API';
import {setDoctors, deleteDoctor} from '../../actions/doctors'
import Swipeable from "react-native-swipeable";
import OneDoctorList from "../ui_components/ListItems/OneDoctorList";
import {setDoctorSpecializations} from "../../actions/doctorSpecializations";
import CustomButtonGroup from "../ui_components/Buttons/CustomButtonGroup";
import HeaderCancelBtn from "../ui_components/TopNavigation/HeaderCancelBtn";
import HeaderAddBtn from "../ui_components/TopNavigation/HeaderAddBtn";
import {NO_DATA_TO_SHOW} from "../../utils/textConstants";
import {updateNote} from "../../actions/notes";


class Doctors extends Component{

  constructor(props){
    super(props);
    this.swipe = [];

    this.state={
      search: '',
      doctorsList: [],
      doctorsListOrigin: [],
      isLoaded: true,
      emptySearch: false,
      showList: false,
      selectedIndex: 0,
    }
  }





  updateChosenTab (selectedIndex) {
    this._closeAllSwipes();

    this.setState({selectedIndex})
  }
  _closeAllSwipes = () => {
    this.swipe.forEach((item) => {
      item.recenter();
    });
  };
  _cloneDoctorsObjWithCheckedFalse = (doctors, chosenDoctorsID = []) => {
    const copyDoctors = JSON.parse(JSON.stringify(doctors));
    const doctorsListKeys = Object.keys(copyDoctors);


    let doctorsArr = doctorsListKeys.map((item) => {
      copyDoctors[item].checked = false;

      return copyDoctors[item];
    });


    chosenDoctorsID.forEach((id) => {
      doctorsArr.forEach((item) => {
        if (item.id === id) {
          item.checked = true;
        }
      })
    });


    return doctorsArr;

  };




  componentDidMount(){


    getDoctorsList()
      .then(data => {
        this.props.dispatch(setDoctors(data));
        const doctorsList = this._cloneDoctorsObjWithCheckedFalse(data, []);


        this.setState({
          doctorsList: doctorsList,
          doctorsListOrigin: doctorsList,
          isLoaded: doctorsList.length,
          showList: doctorsList.length,

        })
      });

    getDoctorSpecializations()
      .then(data => {
        this.props.dispatch(setDoctorSpecializations(data));
      })
  }

  componentWillReceiveProps(nextProps){
    const data = this.props.doctorsList;
    const newDoctorsList = this._cloneDoctorsObjWithCheckedFalse(data, []);


    this.setState({
      doctorsList: newDoctorsList,
      doctorsListOrigin: newDoctorsList,
      isLoaded: newDoctorsList.length,
      showList: newDoctorsList.length,
      search: '',
      emptySearch: false,
    })

  }

  renderFlatListItem = ({item}) => {

    console.log('render Flat list');
    const uid = getUIDfromFireBase();

    const handleEditBtn = () => {
      this._closeAllSwipes();
      this.props.navigation.navigate('CreateDoctor', {doctorID: item.id})

    };

    const handleDeleteBtn = () => {
      this._closeAllSwipes();

      deleteDoctorByID(item.id)
        .then(() => {
          this.props.dispatch(deleteDoctor(item.id));
          const newDoctorsList = this._cloneDoctorsObjWithCheckedFalse(this.props.doctorsList, []);


          this.setState({
            doctorsList: newDoctorsList,
            doctorsListOrigin: newDoctorsList,
            isLoaded: newDoctorsList.length,
            showList: newDoctorsList.length,
          });

          // Remove the deleted DOCTOR from the all Notes where he was added ----
          getNotesListByCurrentUser()
            .then(data => {
              const doctorID = item.id;
              const notesListArr = convertObjToArr(data);
              notesListArr.forEach((item) => {
                if (item.doctors) {
                  let doctorsArr = item.doctors;
                  let searchResult = doctorsArr.indexOf(doctorID);
                  if (searchResult !== -1) {
                    doctorsArr.splice(searchResult, 1);
                    updateChosenNote(item.id, item);
                    this.props.dispatch(updateNote(item));
                  }
                }
              })
            })
        });
    };

    let rightButtons = null;

    if (uid === item.createdByUser) {
      rightButtons = [
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={handleEditBtn}
          style={{height: 56, width: 56, marginLeft: 15, justifyContent: 'center'}}
        >
          <Image
            style={{width: 40, height: 40}}
            source={require('../../assets/general/edit.png')}
          />
        </TouchableHighlight>,

        <TouchableHighlight
          underlayColor={'transparent'}
          style={{height: 56, width: 56, marginLeft: 15,  justifyContent: 'center'}}
          onPress={handleDeleteBtn}
        >
          <Image
            style={{width: 40, height: 40}}
            source={require('../../assets/general/delete.png')}
          />
        </TouchableHighlight>
      ];
    }





      return (
        <Swipeable rightButtons={rightButtons}
                   onRef={(swipe) => {
                     this.swipe.push(swipe);
                   }}
                   rightButtonWidth={56}
                   onSwipeStart={() => { this._closeAllSwipes()}}
        >
          <OneDoctorList  key={item.id} doctorData={item} hasCheckBox={false}  handleChoosingDoctor = {this.handleChoosingDoctor}/>
        </Swipeable>
      )
  };


  updateSearch = (search) => {

    this.setState({
      search
    });

    const searchVal = search.toLowerCase();
    const {doctorsListOrigin} = this.state;
    const {doctorSpecializations} = this.props;

    if (searchVal !== '') {
      const searchResultArr = doctorsListOrigin.filter((item) => {

        const firstName = item.firstName.toLowerCase();
        const lastName = item.lastName.toLowerCase();
        const specializations = item.specializations.map(item => {
          return doctorSpecializations[item].toLowerCase();
        });

        const specializationsStr = specializations.join(', ');
        const concatenatedDataForSearch = firstName + ' ' + lastName + ' ' + specializationsStr;

        return ~concatenatedDataForSearch.indexOf(searchVal)
      });



      this.setState({
        ...this.state,
        search,
        emptySearch: Boolean(!searchResultArr.length),
        doctorsList : searchResultArr,

      })

    } else {

      this.setState({
        ...this.state,
        search,
        emptySearch: false,
        doctorsList : this.state.doctorsListOrigin,
      })
    }

  };

  handleChoosingDoctor = (doctorID) => {
    const {doctorsList} = this.props;
    const currentDoctor = doctorsList[doctorID];

    this.props.navigation.navigate('OneDoctor', {doctorID: doctorID, currentDoctor: currentDoctor})

  };




  render() {
    console.log(this.state);


    let {isLoaded, doctorsList, search} = this.state;

    const buttons = ['Все доктора', 'Созданные'];
    const { selectedIndex } = this.state;

    doctorsList.sort((a,b) => {

      let fullNameA = a.firstName + ' ' + a.lastName;
      let fullNameB = b.firstName + ' ' + b.lastName;

      fullNameA = fullNameA.toLowerCase();
      fullNameB = fullNameB.toLowerCase();



      if (fullNameA < fullNameB) {
        return -1;
      }
      if (fullNameA > fullNameB) {
        return 1;
      }
      return 0

    });


    switch (selectedIndex) {
      case 0 :
        break;

      case 1:
        const uid = getUIDfromFireBase();

        doctorsList = doctorsList.filter(item => {
          return item.createdByUser === uid
        });

        break;


      default:
        break;
    }



    return(
      <SafeAreaView style={styles.container}>
        <SearchBar
          placeholder="Имя, фамилия или специализация"
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          containerStyle={{backgroundColor: Colors.WHITE, borderTopWidth: 0}}
          inputContainerStyle={{borderRadius: 10, backgroundColor: 'rgba(142, 142, 147, 0.12)'}}
          inputStyle={{borderRadius: 10, color: '#8E8E93', fontSize: 14}}
        />

        {isLoaded ?
          (
            this.state.showList &&
            <Fragment>
              <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                <CustomButtonGroup
                  updateIndex={(selectedIndex) => {this.updateChosenTab(selectedIndex)}}
                  buttons={buttons}
                  selectedIndex={selectedIndex}/>
              </View>
              {!this.state.emptySearch && doctorsList.length ? (
                <View style={{flex: 1, marginTop: 10, paddingRight: 16}}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={doctorsList}
                    renderItem={this.renderFlatListItem}
                  />
                </View>
              ) : (
                <View style={{flex: 1, marginTop: '20%', alignItems: 'center', fontSize: 16}}>
                  <Text>{NO_DATA_TO_SHOW}</Text>
                </View>
              )}
            </Fragment>
        ) : (
          <View style={{flex: 1, position: 'relative'}}>
            <View style={styles.mainTextWrapper}>
              <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь отображаются карточки Докторов которые есть в нашей базе и которых Вы добавили самостоятельно.</Text>
              <Text style={[!isIphone5()? styles.subText: styles.subText__smallPhone]}>Создавайте, редактируйте или удаляйте Докторов</Text>
            </View>
            <Image
              style={styles.personImage}
              source={require('../../assets/person/pills.png')}/>
            <View style={styles.tipWrapper}>
              <Text style={styles.tipText}>Добавить карточку доктора</Text>
              <Image
                style={styles.tipArrow}
                source={require('../../assets/vector/pills_vector.png')}/>

            </View>
          </View>
        )

        }
      </SafeAreaView>
    )
  }
}


function mapStateToProps (state) {
  console.log(state);

  return {
    doctorsList: state.doctors.doctorsList,
    doctorSpecializations: state.doctors.doctorSpecializations
  }
}

export default withNavigationFocus(connect(mapStateToProps)(Doctors));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    backgroundColor: Colors.MAIN_BACKGROUND
  },

  submitBtn: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.DARK_CERULEAN,
    marginBottom: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },

  firstBtn: {
    marginTop: 30,
  },

  submitBtnText: {
    ...Platform.select({
      ios: {
        textTransform: 'uppercase',
      }
    }),
    textAlign: 'center',
    color: Colors.ISABELLINE,
  },

  mainTextWrapper: {
    fontSize: 16,
    width: '100%',
    position: 'absolute',
    top: '5%',
    paddingLeft: 30,
    paddingRight: 30,
  },

  mainText: {
    fontSize: 16,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  mainText__smallPhone: {
    fontSize: 12,
    color: Colors.TYPOGRAPHY_COLOR_DARK,
    width: '100%',
    textAlign: 'center',
  },

  subText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },

  subText__smallPhone: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.GRAY_TEXT,
    marginTop: 5
  },


  personImage: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    width: wp('43%'),
    height: hp('55%')
  },

  tipWrapper: {
    position: 'absolute',
    bottom: 20,
    right: '50%',
    marginRight: -140,
    width: 140,
    height: 110,
  },

  tipText: {
    width: '100%',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GREEN_TIP
  },

  tipArrow: {
    width: 39,
    height: 62,
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -31,
  }

});


