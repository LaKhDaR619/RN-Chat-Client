import React, {useEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import FriendsScreen from '../Screens/FriendsScreen';
import MessagesScreen from '../Screens/MessagesScreen';

import {connect} from 'react-redux';

import io from 'socket.io-client';

const host = 'https://chettos.herokuapp.com';
//const host = 'http://192.168.8.101:5000';
let socket;

let Sound = require('react-native-sound');

const playSound = () => {
  // Enable playback in silence mode
  Sound.setCategory('Playback');
  // Load the sound file 'whoosh.mp3' from the app bundle
  // See notes below about preloading sounds within initialization code below.
  var whoosh = new Sound('stairs.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }

    // Play the sound with an onEnd callback
    whoosh.play();
  });
};

const Stack = createStackNavigator();

function ChatStack({
  user,
  friends,
  setFriends,
  messageConfirmation,
  receiveMessage,
  someoneTyping,
}) {
  useEffect(() => {
    socket = io(host);

    // received a message
    console.log('on');
    socket.on(user.username, handleSocketEvent);
    //socket.on('typing', handleTypingEvent);

    return () => {
      console.log('off');
      socket.off(user.username);
    };
  }, [user]);

  const handleSocketEvent = (msg) => {
    // if someone typing
    if (msg.type === 'typing') {
      someoneTyping(msg);
    }
    // if someone add us as a friend
    else if (msg.type === 'addFriend') {
      const temp = [...friends];
      temp.splice(0, 0, msg.friend);
      setFriends(temp);
    }
    // if the message confirmation
    else if (msg.type === 'confirm') {
      messageConfirmation(msg);
    }
    // if we received a message from another user
    else if (msg.type === 'receive') {
      receiveMessage(msg);

      // playing receive message sound
      playSound();
    }
  };

  const handleTypingEvent = (msg) => {
    someoneTyping(msg);
  };

  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Friends" component={FriendsScreen} />
      <Stack.Screen name="Messages">
        {(props) => <MessagesScreen {...props} socket={socket} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    friends: state.chat.friends,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    messageConfirmation: (msg) => {
      dispatch({type: 'MESSAGE_CONFIRMATION', payload: {msg}});
    },
    receiveMessage: (msg) => {
      dispatch({type: 'RECEIVE_MESSAGE', payload: {msg}});
    },
    someoneTyping: (msg) => {
      dispatch({type: 'SOMEONE_TYPING', payload: msg});
    },
    setFriends: (friends) => {
      dispatch({type: 'SET_FRIENDS', payload: {friends}});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatStack);
