/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {StyleSheet, View, AppState} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import ChatStack from './routes/ChatStack';
import AuthStack from './routes/AuthStack';

import {connect} from 'react-redux';

const App = ({checkLogin, authLoading, loggedIn}) => {
  // so we can update the app when returning to it
  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
  });

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const [appState, setAppState] = useState();

  const handleAppStateChange = (nextAppState) => {
    //the app back from background to front
    if (
      appState &&
      appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      checkLogin();
    }

    //save the appState
    setAppState(nextAppState);
  };

  if (authLoading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <NavigationContainer>
      {loggedIn ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );

  //
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    authLoading: state.auth.authLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    checkLogin: () => dispatch({type: 'CHECK_LOGIN'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({});
