/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {Provider as StoreProvider} from 'react-redux';
import rootReducer from './state/reducers/rootReducer';
import mySaga from './state/sagas/sagas';

import {Provider as PaperProvider} from 'react-native-paper';
import App from './App';

const sagaMiddleware = createSagaMiddleware();
store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(mySaga);

export default function Wrapper() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
}

AppRegistry.registerComponent(appName, () => Wrapper);
