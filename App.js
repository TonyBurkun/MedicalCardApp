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
import MedicalCardStart from './components/MedicalCardStart'
import MedicalCardCreate from './components/MedicalCardCreate'
import MedicalCardList from './components/MedicalCardList'
import Home from './components/Home'
import CreateNote from './components/CreateNote'
import CreateTest from './components/CreateTest'
import CreateLabel from './components/CreateLabel'
import LabelsList from './components/LabelsList'

import {NOTES, TESTS, DOCTORS, PILLS} from './utils/textConstants'
import Notes from './components/Notes'
import Tests from './components/Tests'
import Doctors from './components/Doctors'
import CreateDoctor from "./components/CreateDoctor";
import ChoseDoctorSpecializations from "./components/ChoseDoctorSpecializations";
import Pills from './components/Pills'
import MainNavigationButton from './components/ui_components/MainNavigationButton'
import Profile from './components/Profile'



import {createSwitchNavigator, createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation'
import {USER_TOKEN_LOCAL_STORAGE_KEY} from './utils/textConstants'
import {checkSetUpParamInUser, signOut, isUserExistInDB, isUserAuth} from './utils/API'
import CalendarIcon from "./components/ui_components/CalendarIcon";
import Avatar from "./components/Avatar";
import OneDoctor from "./components/OneDoctor";


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
    screen: Tests,
    navigationOptions: {
      tabBarLabel: 'Tests',
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






class App extends React.Component {
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
      headerTintColor: Colors.BLACK_TITLE,
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
          <Avatar/>
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

  CreateTest: {
    screen: CreateTest,
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

  CreateLabel: {
    screen: CreateLabel,
  },

  LabelsList: {
    screen: LabelsList,
  },

  CreateDoctor: {
    screen: CreateDoctor
  },

  ChoseDoctorSpecializations: {
    screen: ChoseDoctorSpecializations
  },

  OneDoctor: {
    screen: OneDoctor
  }




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
