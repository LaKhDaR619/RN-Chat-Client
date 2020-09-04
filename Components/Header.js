import React from 'react';
import {StyleSheet, ToastAndroid, Platform, AlertIOS} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {Appbar} from 'react-native-paper';

import {connect} from 'react-redux';

const Header = ({title, loggedIn, userLogout, user}) => (
  <Appbar.Header>
    <Appbar.Content title={title} />
    {loggedIn ? (
      <>
        <Appbar.Content
          title={user.id}
          titleStyle={{alignSelf: 'flex-end'}}
          onPress={() => {
            Clipboard.setString(user.id);
            if (Platform.OS === 'android') {
              ToastAndroid.show('id Copied', ToastAndroid.SHORT);
            } else {
              AlertIOS.alert('id Copied');
            }
          }}
        />
        <Appbar.Content
          title={user.username}
          titleStyle={{alignSelf: 'flex-end'}}
        />
        <Appbar.Action color="white" icon="logout" onPress={userLogout} />
      </>
    ) : null}
  </Appbar.Header>
);

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    userLogout: () => dispatch({type: 'USER_LOGOUT'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const style = StyleSheet.create({});
