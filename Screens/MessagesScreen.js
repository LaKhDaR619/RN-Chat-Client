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
  Paragraph,
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
      <Title
        style={{
          backgroundColor: 'purple',
          textAlign: 'center',
          color: 'white',
          padding: 10,
          marginTop: 0,
        }}>
        {friends[selectedIndex].username}
      </Title>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
          justifyContent: 'flex-end',
        }}
        scrollEnabled={true}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({animated: true})
        }>
        {messages.map((item, index) => (
          <View key={index.toString()} style={{flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent:
                  item.sender === user.username ? 'flex-end' : 'flex-start',
              }}>
              <Paragraph
                style={{
                  backgroundColor:
                    item.sender === user.username ? '#0099FF' : '#373737',
                  color: 'white',
                  fontSize: 16,

                  padding: 10,
                  borderRadius: 50,
                }}>
                {item.message}
              </Paragraph>
              {item.pending ? (
                <ActivityIndicator size="small" style={{paddingLeft: 10}} />
              ) : null}
            </View>
          </View>
        ))}
        {friends[selectedIndex].typing ? (
          <TypingAnimation
            style={{marginTop: 20, marginBottom: 40, marginLeft: 20}}
            dotRadius={5}
            dotMargin={10}
          />
        ) : null}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginHorizontal: 15,
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
