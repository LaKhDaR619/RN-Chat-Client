import React, {useState, useRef, useEffect} from 'react';
import {View, Keyboard} from 'react-native';
import {TypingAnimation} from 'react-native-typing-animation';
import Header from '../Components/Header';

import {
  List,
  ActivityIndicator,
  Title,
  TextInput,
  IconButton,
  Colors,
  Text,
} from 'react-native-paper';

import {connect} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';

function MessagesScreen({
  user,
  friends,
  setFriends,
  selectedIndex,
  setSelectedIndex,
  messages,
  socket,
  setRead,
}) {
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);

    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
    };
  }, []);

  const _keyboardDidShow = () => {
    scrollViewRef.current.scrollToEnd({animated: true});
  };

  useEffect(() => {
    if (friends[selectedIndex].unRead) setRead(friends, selectedIndex);
  }, [friends]);

  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message) return;

    setMessage('');
    setTyping(false);
    socket.emit('typing', {
      friend: friends[selectedIndex].username,
      typing: false,
    });

    const temp = [...friends];

    const receiver = {
      receiver: temp[selectedIndex].username,
      message,
      pending: true,
    };

    temp[selectedIndex].messages.push({
      sender: user.username,
      message,
      pending: true,
    });

    // getting friend from the array
    const friend = temp[selectedIndex];
    //delteting the friend from the array
    temp.splice(selectedIndex, 1);
    // pushing it again at the beggining
    temp.splice(0, 0, friend);

    socket.emit('message', receiver);

    setSelectedIndex(0);
    setFriends(temp);
  };

  const handleTextChange = (text) => {
    setMessage(text);
    if (text === '') {
      setTyping(false);
      socket.emit('typing', {
        friend: friends[selectedIndex].username,
        typing: false,
      });
    } else if (!typing) {
      socket.emit('typing', {
        friend: friends[selectedIndex].username,
        typing: true,
      });
      setTyping(true);
    }
  };

  const [typing, setTyping] = useState(false);
  const ref = useRef();

  const scrollViewRef = useRef();

  return (
    <View style={{flex: 1}}>
      <Header title="Messages" />
      <Title
        style={{
          textAlign: 'center',
          backgroundColor: 'purple',
          color: 'white',
          padding: 15,
        }}>
        {friends[selectedIndex].username}
      </Title>

      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: 15,
          justifyContent: 'flex-end',
        }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {messages.map((item, index) => (
          <List.Item
            key={index.toString()}
            title={item.message}
            style={{padding: 0, margin: 0}}
            titleStyle={{
              backgroundColor:
                item.sender === user.username ? '#0099FF' : '#373737',
              color: 'white',
              fontSize: 16,
              alignSelf:
                item.sender === user.username ? 'flex-end' : 'flex-start',
              padding: 10,
              borderRadius: 50,
            }}
            right={() => {
              return item.pending ? <ActivityIndicator size="small" /> : null;
            }}
          />
        ))}
        {friends[selectedIndex].typing ? (
          <TypingAnimation
            style={{marginBottom: 40, marginLeft: 15}}
            dotRadius={5}
            dotMargin={10}
          />
        ) : null}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TextInput
          mode="outlined"
          style={{width: '80%'}}
          value={message}
          onFocus={() => {
            console.log('here');
            scrollViewRef.current.scrollToEnd({animated: true});
          }}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSendMessage}
        />
        <IconButton
          color={Colors.purple500}
          icon="send"
          size={40}
          onPress={handleSendMessage}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    friends: state.chat.friends,
    selectedIndex: state.chat.selectedIndex,
    messages: state.chat.messages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFriends: (friends) => {
      dispatch({type: 'SET_FRIENDS', payload: {friends}});
    },
    setSelectedIndex: (selectedIndex) => {
      dispatch({type: 'SET_SELECTED_INDEX', payload: {selectedIndex}});
    },
    setRead: (friends, index) => {
      dispatch({type: 'SET_READ', payload: {friends, index}});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
