/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';

import ChatStack from './routes/ChatStack';
import AuthStack from './routes/AuthStack';

import {connect} from 'react-redux';

const App = ({checkLogin, authLoading, loggedIn}) => {
  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  if (authLoading)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
