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

import {NOTES, TESTS, DOCTORS, PILLS} from './utils/textConstants'
import Notes from './components/Notes'
import Tests from './components/Tests'
import Doctors from './components/Doctors'
import Pills from './components/Pills'
import AddButton from './components/ui_components/AddButton'


import {createSwitchNavigator, createStackNavigator, createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation'
import {USER_TOKEN_LOCAL_STORAGE_KEY} from './utils/textConstants'
import {checkSetUpParamInUser, signOut, isUserExistInDB, isUserAuth} from './utils/API'
import CalendarIcon from "./components/ui_components/CalendarIcon";
import Avatar from "./components/Avatar";

// import firebase from 'react-native-firebase';


const RouteConfigs = {
  NotesTab: {
    screen: Notes,
    navigationOptions: {
      tabBarLabel: "Notes",
    }
  },

  TestsTab: {
    screen: Tests,
    navigationOptions: {
      tabBarLabel: 'Tests',
      // tabBarIcon: ({tintColor}) => (
      //   <MaterialCommunityIcons name='playlist-plus' size={30} color={tintColor}/>
      // )
    }
  },

  PillsTab: {
    screen: Pills,
    navigationOptions: {
      tabBarLabel: 'Pills',
      // tabBarIcon: ({tintColor}) => (
      //   <MaterialCommunityIcons name='playlist-plus' size={30} color={tintColor}/>
      // )
    }
  },

  DoctorsTab: {
    screen: Doctors,
    navigationOptions: {
      tabBarLabel: 'Doctors',
      // tabBarIcon: ({tintColor}) => (
      //   <MaterialCommunityIcons name='playlist-plus' size={30} color={tintColor}/>
      // )
    }
  },
  Add: {
    screen: Notes,
    navigationOptions: () => ({

      tabBarButtonComponent: () => (
        <AddButton/>
      ),
    })
  },

};


const TabNavigatorConfig = {
  navigationOptions: {
    // header: null
  },

  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? 'black' : 'black',
    style: {
      // height: 56,
      backgroundColor: Platform.OS === "ios" ? Colors.TAB_NAVIGATION_BG :  Colors.TAB_NAVIGATION_BG,
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

      console.log(userToken);

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

    console.log(this.state);
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

    }}
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
