

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import React, {Fragment} from 'react';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'
import middleware from './middleware'
import InternetNotification from "./components/ui_components/InternetNotification";

const Root = () => (
  <Provider store={createStore(reducer)}>
    <Fragment>
      <InternetNotification topDimension={44}/>
      <App/>
    </Fragment>

  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);

