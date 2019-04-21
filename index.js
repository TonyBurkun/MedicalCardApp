/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import React from 'react';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'

const Root = () => (
  <Provider store={createStore(reducer)}>
    <App/>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);

