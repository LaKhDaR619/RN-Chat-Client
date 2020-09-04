import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import RegisterScreen from '../Screens/RegisterScreen';
import LoginScreen from '../Screens/LoginScreen';

import {connect} from 'react-redux';

const Stack = createStackNavigator();

function AuthStack({currentRoute}) {
  return (
    <Stack.Navigator headerMode="none" initialRouteName={currentRoute}>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    currentRoute: state.auth.currentRoute,
  };
};

export default connect(mapStateToProps, null)(AuthStack);
