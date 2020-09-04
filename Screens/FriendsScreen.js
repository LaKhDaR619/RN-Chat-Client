import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Header from '../Components/Header';
import {List, Avatar, Badge, TextInput, HelperText} from 'react-native-paper';
import {connect} from 'react-redux';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

function FriendsScreen({
  friends,
  friendError,
  setSelectedIndex,
  navigation,
  setRead,
  addFriend,
}) {
  const [friendId, setFriendId] = useState('');

  const handleContactChange = (index) => {
    setSelectedIndex(index);
    if (friends[index].unRead) setRead(friends, index);
    navigation.navigate('Messages');
  };

  const handleAddFriend = () => {
    addFriend(friendId, friends);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => handleContactChange(index)}>
        <List.Item
          key={index}
          title={item.username}
          titleStyle={{color: 'black'}}
          description={
            item.messages.length > 0
              ? item.messages[item.messages.length - 1].message
              : `Say Hi to: ${item.username}`
          }
          descriptionStyle={{color: 'grey'}}
          left={() => (
            <Avatar.Image
              size={30}
              source={require('../assets/avatar.jpg')}
              style={{alignSelf: 'center', marginLeft: 5, marginRight: 10}}
            />
          )}
          right={() => {
            return item.unRead ? (
              <Badge size={15} style={{alignSelf: 'center', marginRight: 10}} />
            ) : null;
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Friends" />
      <FlatList
        data={friends}
        extraData={friends}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginHorizontal: 20,
        }}>
        <TextInput
          mode="outlined"
          label="Add Friend"
          value={friendId}
          onChangeText={(text) => setFriendId(text)}
          onSubmitEditing={handleAddFriend}
        />
        <HelperText type="error" visible={friendError.length}>
          {friendError}
        </HelperText>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    friends: state.chat.friends,
    friendError: state.chat.friendError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedIndex: (selectedIndex) => {
      dispatch({type: 'SET_SELECTED_INDEX', payload: {selectedIndex}});
    },
    setRead: (friends, index) => {
      dispatch({type: 'SET_READ', payload: {friends, index}});
    },
    addFriend: (id, friends) => {
      dispatch({type: 'ADD_FRIEND', payload: {id, friends}});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendsScreen);

const styles = StyleSheet.create({});
