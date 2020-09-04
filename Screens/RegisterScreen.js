import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {connect} from 'react-redux';
import {
  TextInput,
  HelperText,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import Header from '../Components/Header';

function RegisterScreen({
  checkUserName,
  userRegister,
  errorMessages,
  inputFields,
  setInputFields,
  resetIE,
  navigation,
  authLoading,
}) {
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetIE();
      };
    }, []),
  );

  const handleRegister = async (e) => {
    userRegister({...inputFields});
  };

  const handleUserNameChange = (text) => {
    setInputFields({...inputFields, username: text});
    checkUserName(text);
  };

  if (authLoading)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={{flex: 1}}>
      <Header title="Register" />
      <View style={styles.container}>
        <TextInput
          label="User Name"
          mode="outlined"
          value={inputFields.username}
          onChangeText={(text) => handleUserNameChange(text)}
          error={errorMessages.username}
        />
        <HelperText type="error" visible={errorMessages.username}>
          {errorMessages.username}
        </HelperText>
        <TextInput
          label="Password"
          mode="outlined"
          value={inputFields.password}
          onChangeText={(text) =>
            setInputFields({...inputFields, password: text})
          }
          error={errorMessages.password}
        />
        <HelperText type="error" visible={errorMessages.password}>
          {errorMessages.password}
        </HelperText>
        <Button mode="contained" onPress={handleRegister}>
          Register
        </Button>
        <Button
          mode="outlined"
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}>
          Login
        </Button>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    authLoading: state.auth.authLoading,
    inputFields: state.auth.inputFields,
    errorMessages: state.auth.errorMessages,
    userAvailable: state.auth.userAvailable,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userRegister: (payload) =>
      dispatch({
        type: 'USER_REGISTER',
        payload,
      }),
    checkUserName: (username) => {
      dispatch({
        type: 'CHECK_USERNAME',
        payload: {username},
      });
    },
    setInputFields: (payload) => dispatch({type: 'SET_INPUT_FIELDS', payload}),
    resetIE: () => dispatch({type: 'RESET_IE'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  navButton: {
    marginTop: 10,
  },
});
