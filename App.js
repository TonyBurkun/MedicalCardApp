import React from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  NetInfo,
  Alert,
  Image
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import * as Colors from './utils/colors'
import commonStyles from './utils/commonStyles'

import Login from './components/Login'
import Recovery from './components/RecoveryPassword'
import Registration from './components/Registration'
import StepOne from './components/StepOne'
import StepTwo from './components/StepTwo'
import MedicalCardStart from './components/medical_card/MedicalCardStart'
import MedicalCardCreate from './components/medical_card/MedicalCardCreate'
import MedicalCardList from './components/medical_card/MedicalCardList'
import CreateLabel from './components/labels/CreateLabel'
import LabelsList from './components/labels/LabelsList'
import Notes from './components/notes/Notes'
import OneNote from "./components/notes/OneNote";
import CreateNote from './components/notes/CreateNote'

import MedicalTestCreate from './components/medical_tests/MedicalTestCreate'
import MedicalTestsList from './components/medical_tests/MedicalTestsList'
import IndicatorsList from "./components/medical_tests/IndicatorsList"

import Doctors from './components/doctors/Doctors'
import CreateDoctor from "./components/doctors/CreateDoctor"
import ChoseDoctor from "./components/doctors/ChoseDoctor"
import ChoseDoctorSpecializations from "./components/doctors/ChoseDoctorSpecializations"
import MainNavigationButton from './components/ui_components/Buttons/MainNavigationButton'
import Profile from './components/profile/Profile'
import ProfileData from "./components/profile/ProfileData"
import ChangeEmail from "./components/profile/ChangeEmail"
import CalendarIcon from "./components/ui_components/CalendarIcon"
import Avatar from "./components/ui_components/Avatar"
import OneDoctor from "./components/doctors/OneDoctor"
import Pills from './components/pills/Pills'
import CreatePill from "./components/pills/CreatePill"
import ChosePillsType from "./components/pills/ChosePillsType"
import ChosePill from "./components/pills/ChosePill";
import ChoseLabel from './components/labels/ChoseLabel'

import {createSwitchNavigator, createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation'
import {USER_TOKEN_LOCAL_STORAGE_KEY} from './utils/textConstants'
import {NOTES, TESTS, DOCTORS, PILLS} from './utils/textConstants'
import {checkSetUpParamInUser, signOut, isUserExistInDB, isUserAuth} from './utils/API'
import TermsOfUse from "./components/profile/TermsOfUse";
import HeaderAddBtn from "./components/ui_components/TopNavigation/HeaderAddBtn";
import TypeTestList from "./components/medical_tests/TypeTestList";
import OneMedicalTest from "./components/medical_tests/OneMedicalTest";



// import firebase from 'react-native-firebase';


const RouteConfigs = {
  NotesTab: {
    screen: Notes,
    navigationOptions: {
      tabBarLabel: "Notes",
      tabBarIcon: ({focused}) => (
        focused
          ? <Image
            style={styles.tabIcon}
            source={require('./assets/tab_navigation_ico/notes_active.png')}/>
          : <Image
            style={styles.tabIcon}
            source={require('./assets/tab_navigation_ico/notes.png')}/>
      )
    }
  },

  TestsTab: {
    screen: MedicalTestsList,
    navigationOptions: {
      tabBarLabel: 'MedicalTestsList',
      tabBarIcon: ({focused}) => (
        focused
        ? <Image
            style={[styles.tabIcon, {marginRight: 40}]}
            source={require('./assets/tab_navigation_ico/tests_active.png')}/>
        : <Image
            style={[styles.tabIcon, {marginRight: 40}]}
            source={require('./assets/tab_navigation_ico/tests.png')}/>
      )
    }
  },

  PillsTab: {
    screen: Pills,
    navigationOptions: {
      tabBarLabel: 'Pills',
      tabBarIcon: ({focused}) => (
        focused
          ? <Image
            style={[styles.tabIcon, {marginLeft: 40}]}
            source={require('./assets/tab_navigation_ico/pills_active.png')}/>
          : <Image
            style={[styles.tabIcon, {marginLeft: 40}]}
            source={require('./assets/tab_navigation_ico/pills.png')}/>
      )
    }
  },

  DoctorsTab: {
    screen: Doctors,
    navigationOptions: {
      tabBarLabel: 'Doctors',
      tabBarIcon: ({focused}) => (
        focused
          ? <Image
            style={styles.tabIcon}
            source={require('./assets/tab_navigation_ico/doctors_active.png')}/>
          : <Image
            style={styles.tabIcon}
            source={require('./assets/tab_navigation_ico/doctors.png')}/>
      )
    }
  },
  Add: {
    screen: Notes,
    navigationOptions: () => ({

      tabBarButtonComponent: () => (
        <MainNavigationButton/>
      ),
    })
  },

};


const TabNavigatorConfig = {
  navigationOptions: {
    // header: null
  },

  tabBarOptions: {
    showLabel: false,
    activeTintColor: Platform.OS === "ios" ? 'black' : 'black',
    style: {
      // height: 56,
      backgroundColor: Platform.OS === "ios" ? Colors.WHITE :  Colors.WHITE,
      borderTopWidth: 1,
      borderTopColor: Colors.TAB_NAVIGATION_BORDER,

      // shadowColor: "rgba(0, 0, 0, 0.24)",
      // shadowOffset: {
      //   width: 0,
      //   height: 3
      // },
      // shadowRadius: 6,
      // shadowOpacity: 1,
      // paddingTop: 5
    },

    indicatorStyle: {
      backgroundColor: 'black',
    },
  }
};


const Tabs =
  Platform.OS === 'ios'
    ? createBottomTabNavigator(RouteConfigs, TabNavigatorConfig)
    : createMaterialTopTabNavigator(RouteConfigs, TabNavigatorConfig);






class  App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  _bootstrapAsync = async() => {
    const {navigation} = this.props;

    if (isUserAuth()){
      console.log('user auth');

      const userToken = await AsyncStorage.getItem(USER_TOKEN_LOCAL_STORAGE_KEY)
        .catch(error => {
          console.log('Try to get userToken item from AsyncStorage and getting the ERROR', error);
        });

      // console.log(userToken);

      const userInDB = await isUserExistInDB();

      if (userInDB) {

        const setUpParam = await checkSetUpParamInUser();

        setUpParam ? navigation.navigate('MainNavigation') : navigation.navigate('setUpOneProfile');

      } else {
        signOut(navigation)
      }

    } else {
      console.log('user does not auth');
      this.props.navigation.navigate('Login');
    }

  };


  componentDidMount() {

    this._bootstrapAsync();
  }

  render() {

    // console.log(this.state);
    return (
      <View style={commonStyles.container}>
        <StatusBar
          backgroundColor={Colors.MAIN_BACKGROUND}
          barStyle="dark-content"
        />
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 40,
    height: 40
  }
});



const AppStack = createStackNavigator({
  App: {
    screen: App,
  }
});

const LoginStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
      headerBackTitle: null,
      headerTintColor: Colors.BLACK_TITLE,
      headerStyle: {
        backgroundColor: Colors.MAIN_BACKGROUND,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
    }
  },
  Recovery: {
    screen: Recovery,
    navigationOptions: () => ({
      headerTintColor: Colors.BLACK_TITLE,
      headerStyle: {
        backgroundColor: Colors.MAIN_BACKGROUND,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
    }),
  }

});

const RegistrationStack = createStackNavigator({
  Registration: {
    screen: Registration,
    navigationOptions: {
      header: null
    }
  }
});

const setUpOneProfileStack = createStackNavigator({
  StepOne: {
    screen: StepOne,
    navigationOptions: {
      header: null
    }
  },

});

const setUpTwoProfileStack = createStackNavigator({
  StepTwo: {
    screen: StepTwo,
    navigationOptions: {
      header: null
    }
  }
});

const MedicalCardStartStack = createStackNavigator({
  MedicalCardStart: {
    screen: MedicalCardStart,
    navigationOptions: {
      header: null
    }
  }
});

const MedicalCardCreateStack = createStackNavigator({
  MedicalCardStart: {
    screen: MedicalCardCreate,
    navigationOptions: {
      header: null
    },
  },

  MedicalCardList: {
    screen: MedicalCardList,
    navigationOptions: () => ({
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
    }),
  }
});

const MainNavStack = createStackNavigator({
  Home: {
    screen: Tabs,
    navigationOptions: ({navigation}) => {
      const activeTabIndex = navigation.state.index;
      let tabTitle ='';

      switch (activeTabIndex) {
        case 0:
          tabTitle = NOTES;
          break;

        case 1:
          tabTitle = TESTS;
          break;

        case 2:
          tabTitle = PILLS;
          break;

        case 3:
          tabTitle = DOCTORS;
          break;

        default:
          break;
      }

      return {
        headerLeft: (
          <CalendarIcon/>
        ),
        headerTitle: (
          () => <Text style={{flex: 1, fontSize: 30, color: Colors.BLACK_TITLE, fontWeight: 'bold'}}>{tabTitle}</Text>
        ),
        headerRight: (
         <View
          style={{marginRight: 10}}>
           <Avatar/>
         </View>
        ),
        headerStyle: commonStyles.topHeader,
      }

    }},

  CreateNote: {
    screen: CreateNote,
    navigationOptions: {
      // header: null
    }
  },

  OneNote: {
    screen: OneNote,
    navigationOptions: {}
  },

  CreateTest: {
    screen: MedicalTestCreate,
    navigationOptions: ({navigation}) => {

      const isEditForm = Boolean(navigation.state.params);
      return {
        headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>
          {isEditForm ? ('Редактирование') : ('Добавить Анализ')}
        </Text>,
        headerTintColor: Colors.GRAY_TEXT,
        headerStyle: {
          backgroundColor: Colors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: Colors.TAB_NAVIGATION_BORDER,

        },
      }
    }
  },

  TypeTestList: {
    screen: TypeTestList,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Тип Анализа</Text>,
        headerTintColor: Colors.GRAY_TEXT,
        headerStyle: {
          backgroundColor: Colors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,

        },
        headerRight: (
          <HeaderAddBtn titleBtn={'Сохранить'} type={'chosenTestType'}/>
        )
      }
    }
  },

  MedicalIndicators: {
    screen: IndicatorsList,
    navigationOptions: ({navigation}) => {
      return {
        headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Показатели</Text>,
        headerTintColor: Colors.GRAY_TEXT,
        headerStyle: {
          backgroundColor: Colors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,

        },
        headerRight: (
          <HeaderAddBtn titleBtn={'Сохранить'} type={'chosenIndicators'}/>
        )
      }
    }
  },

  OneMedicalTest: {
    screen: OneMedicalTest,
    navigationOptions: {
      // header: null
    }
  },


  Profile: {
    screen: Profile,
    navigationOptions: {
      // header: null
    }
  },

  ProfileData: {
    screen: ProfileData,
    navigationOptions: {}
  },

  ProfileMedicalCard: {
    screen: MedicalCardCreate,
    navigationOptions: ({navigation}) => {
      console.log(navigation);
      return {
        headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Медицинская карта</Text>,
        headerTintColor: Colors.GRAY_TEXT,
        headerStyle: {
          backgroundColor: Colors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 1,
          borderTopColor: Colors.TAB_NAVIGATION_BORDER,

        },
      }
    }
  },

  ProfileMedicalCardList: {
    screen: MedicalCardList,
    navigationOptions: () => ({
      headerTintColor: Colors.GRAY_TEXT,
      headerStyle: {
        backgroundColor: Colors.WHITE,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
    }),
  },

  ChangeEmail: {
    screen: ChangeEmail,
    navigationOptions: {}
  },
  TermsOfUse: {
    screen: TermsOfUse,
    navigationOptions:{}
  },

  CreateLabel: {
    screen: CreateLabel,
  },

  LabelsList: {
    screen: LabelsList,
    navigationOptions: () => {
      return {
        headerTitle: () => <Text style={{fontSize: 17, fontWeight: 'bold', color: Colors.BLACK_TITLE}}>Метки</Text>,
        headerTintColor: Colors.GRAY_TEXT,
        headerStyle: {
          backgroundColor: Colors.WHITE,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0

        }
      }
    }
  },

  ChoseLabel: {
    screen: ChoseLabel,
    navigationOptions: {}
  },

  CreateDoctor: {
    screen: CreateDoctor
  },

  ChoseDoctorSpecializations: {
    screen: ChoseDoctorSpecializations
  },

  OneDoctor: {
    screen: OneDoctor
  },

  ChoseDoctor: {
    screen: ChoseDoctor
  },

  CreatePill: {
    screen: CreatePill
  },

  ChosePillsType: {
    screen: ChosePillsType
  },

  ChosePill: {
    screen: ChosePill
  },






});


export default createSwitchNavigator(
  {
    EntryPoint: AppStack,
    App: AppStack,
    Login: LoginStack,
    Register: RegistrationStack,
    setUpOneProfile: setUpOneProfileStack,
    setUpTwoProfile: setUpTwoProfileStack,
    MedicalCardStart: MedicalCardStartStack,
    MedicalCardCreate: MedicalCardCreateStack,
    MainNavigation: MainNavStack,
  },
  {
    initialRouteName: 'EntryPoint'
  }
);
