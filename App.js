import React from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  StatusBar,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native'
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


import {createSwitchNavigator, createStackNavigator} from 'react-navigation'
import {USER_TOKEN_LOCAL_STORAGE_KEY} from './utils/textConstants'
import {checkSetUpParamInUser, signOut, isUserExistInDB, isUserAuth} from './utils/API'

// import firebase from 'react-native-firebase';


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
      // console.log(userInDB);

      if (userInDB) {

        const setUpParam = await checkSetUpParamInUser();
        // console.log(setUpParam);

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
        backgroundColor: Colors.MAIN_BACKGROUND,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0

      }
    }),
  }
});


const MainNavStack = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      // header: null
    }
  }
});


export default createSwitchNavigator(
  {
    EntryPoint: MedicalCardCreateStack,
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
