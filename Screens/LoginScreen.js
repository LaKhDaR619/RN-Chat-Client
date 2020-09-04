import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, StyleSheet} from 'react-native';
import {TextInput, HelperText, Button, Checkbox} from 'react-native-paper';
import {connect} from 'react-redux';

import Header from '../Components/Header';

function LoginScreen({
  userLogin,
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

  // keep logged in or not (i'll make it later)
  const [keep, setKeep] = useState(true);

  const handleLogin = async (e) => {
    userLogin({...inputFields, keep});
  };

  if (authLoading)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <View style={{flex: 1}}>
      <Header title="Login" />
      <View style={styles.container}>
        <TextInput
          label="User Name"
          mode="outlined"
          value={inputFields.username}
          onChangeText={(text) => {
            setInputFields({...inputFields, username: text});
          }}
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
        <Checkbox
          status={keep ? 'checked' : 'unchecked'}
          onPress={() => setKeep(!keep)}
        />
        <Button mode="contained" onPress={handleLogin}>
          Login
        </Button>
        <Button
          mode="outlined"
          style={styles.navButton}
          onPress={() => navigation.navigate('Register')}>
          Register
        </Button>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    inputFields: state.auth.inputFields,
    errorMessages: state.auth.errorMessages,
    authLoading: state.auth.authLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (payload) =>
      dispatch({
        type: 'USER_LOGIN',
        payload,
      }),
    setInputFields: (payload) => dispatch({type: 'SET_INPUT_FIELDS', payload}),
    resetIE: () => dispatch({type: 'RESET_IE'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

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
