import React, {Component, Fragment} from 'react'
import {View, Text, StyleSheet, Platform, TouchableHighlight, Image, FlatList} from 'react-native'
import {SafeAreaView, withNavigationFocus} from "react-navigation";
import {connect} from 'react-redux'
import * as Colors from "../utils/colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {deleteDoctorByID, getDoctorsList, getDoctorSpecializations, getUIDfromFireBase} from "../utils/API";
import {deleteDoctor, setChosenDoctors, setDoctors} from "../actions/doctors";
import {setDoctorSpecializations} from "../actions/doctorSpecializations";
import Swipeable from "react-native-swipeable";
import OneDoctorList from "./ui_components/ListItems/OneDoctorList";
import InternetNotification from "./ui_components/InternetNotification";
import {SearchBar} from "react-native-elements";
import CustomButtonGroup from "./ui_components/Buttons/CustomButtonGroup";
import {NO_DATA_TO_SHOW} from "../utils/textConstants";
import {isIphone5} from "../utils/helpers";
import HeaderCancelBtn from "./ui_components/TopNavigation/HeaderCancelBtn";
import HeaderAddBtn from "./ui_components/TopNavigation/HeaderAddBtn";
import AddButton from "./ui_components/AddButton";



class ChoseDoctor extends Component{

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
      chosenDoctorsID: [],
      refresh: false,
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: () => {
        return (
          <HeaderCancelBtn />
        )
      },
      headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Доктора</Text>,
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      },
      headerRight: (
        <HeaderAddBtn type={'chosenDoctors'}/>
      )
    }
  };


  _cloneDoctorsObjWithCheckedFalse = (doctors, chosenDoctorsID) => {
    const copyDoctors = JSON.parse(JSON.stringify(doctors));
    const labelsListKeys = Object.keys(copyDoctors);


    let doctorsArr = labelsListKeys.map((item) => {
      copyDoctors[item].checked = false;

      return copyDoctors[item];
    });


    chosenDoctorsID.forEach((id) => {
      doctorsArr.forEach((doctor) => {
        if (doctor.id === id) {
          doctor.checked = true;
        }
      })
    });

    return doctorsArr;

  };

  componentDidMount(){

    getDoctorsList()
      .then(data => {
        this.props.dispatch(setDoctors(data));

        const {chosenDoctorsID} = this.state;
        const doctorsList = this._cloneDoctorsObjWithCheckedFalse(data, chosenDoctorsID);


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
      });



  }

  componentWillReceiveProps(nextProps){
    console.log('PROPS: ',nextProps);

    const nextDoctorsList = nextProps.doctorsList;
    const {doctorsListOrigin} = this.state;

    // console.log(nextDoctorsList);
    // console.log(doctorsListOrigin);

    if (Object.keys(nextDoctorsList).length !== doctorsListOrigin.length) {
      const chosenDoctorsID = nextProps.chosenDoctorsID;
      const data = nextProps.doctorsList;

      const newDoctorsList = this._cloneDoctorsObjWithCheckedFalse(data, chosenDoctorsID);
      // const {doctorsList} = this.state;

      console.log(newDoctorsList);

      this.setState({
        doctorsList: newDoctorsList,
        doctorsListOrigin: newDoctorsList,
        isLoaded: newDoctorsList.length,
        showList: newDoctorsList.length,
        search: '',
        emptySearch: false,
        chosenDoctorsID,
      });

      console.log('END NEW PROPS');
    }


  }





  renderFlatListItem = ({item, index}) => {
    console.log('render Flat list');


    return (
        <OneDoctorList index={index}  key={item.id} doctorData={item} hasCheckBox={true}  handleChoosingDoctor = {this.handleChoosingDoctor}/>
    )
  };

  handleChoosingDoctor = (doctorID, hasCheckBox) => {

    if (hasCheckBox){

      const {doctorsList, doctorsListOrigin} = this.state;



      console.log(doctorsList);
      console.log(doctorsListOrigin);


      let newDoctorsList = JSON.parse(JSON.stringify(doctorsList));
      let newDoctorsListOrigin = JSON.parse(JSON.stringify(doctorsListOrigin));

      newDoctorsList = newDoctorsList.map((item) => {
        if (doctorID === item.id) {
          item.checked = !item.checked;
        }
          return item;
      });
      console.log(newDoctorsList);

      newDoctorsListOrigin = newDoctorsListOrigin.map((item) => {
        if (doctorID === item.id) {
          item.checked = !item.checked;
        }
        return item;
      });


      const newChosenDoctorsID = [];

      newDoctorsListOrigin.forEach(item => {
        if (item.checked) {
          newChosenDoctorsID.push(item.id)
        }
      });

      console.log(newChosenDoctorsID);


      const prevChosenDoctors = this.props.chosenDoctorsID;

      console.log(newDoctorsList);

      this.setState({
        doctorsList: newDoctorsList,
        doctorsListOrigin: newDoctorsListOrigin,
        chosenDoctorsID: newChosenDoctorsID,
      });
      console.log(this.state);

      // this.props.dispatch(setChosenDoctors(newChosenDoctorsID));
      this.props.navigation.navigate('ChoseDoctor',{type: 'AddItemsWithBack', chosenItemsID: newChosenDoctorsID, prevData: prevChosenDoctors});
    } else {
      const {doctorsList} = this.props;
      const currentDoctor = doctorsList[doctorID];
      this.props.navigation.navigate('OneDoctor', {doctorID: doctorID, currentDoctor: currentDoctor})
    }
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


  handlePressAddButton = () => {
    this.props.navigation.navigate('CreateDoctor');
  };






  render() {

    let {isLoaded, doctorsList, search} = this.state;

    doctorsList.sort((a,b) => {

      let fullNameA = a.firstName + ' ' + a.lastName;
      let fullNameB = b.firstName + ' ' + b.lastName;

      fullNameA = fullNameA.toLowerCase();
      fullNameB = fullNameB.toLowerCase();



      if (fullNameA < fullNameB) {
        return -1;
      }
      if (fullNameA > fullNameA) {
        return 1;
      }
      return 0

    });



    return (
      <SafeAreaView style={styles.container}>
        <InternetNotification topDimension={0}/>
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
                <Text style={[!isIphone5()? styles.mainText: styles.mainText__smallPhone]}>Здесь будут карточки Докторов.</Text>
                <Text style={[!isIphone5()? styles.subText: styles.subText__smallPhone]}>Список докторов можно редактировать в разделе Доктора</Text>
              </View>
              <Image
                style={styles.personImage}
                source={require('../assets/person/pills.png')}/>
              <View style={styles.tipWrapper}>
                <Text style={styles.tipText}>Добавить карточку доктора</Text>
                <Image
                  style={styles.tipArrow}
                  source={require('../assets/vector/notes_vector.png')}/>

              </View>
            </View>
          )
        }
        <AddButton handlePress={this.handlePressAddButton}/>
      </SafeAreaView>
    )
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    doctorsList: state.doctors.doctorsList,
    doctorSpecializations: state.doctors.doctorSpecializations,
    chosenDoctorsID: state.doctors.chosenDoctorsID,
  }
}

export default withNavigationFocus(connect(mapStateToProps)(ChoseDoctor))


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'green',
    // justifyContent: 'center',
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
    top: '10%',
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
    bottom: 80,
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
    marginLeft: -10,
  }

});
