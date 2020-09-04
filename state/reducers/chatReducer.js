import {ToastAndroid, Platform, AlertIOS} from 'react-native';

const initialState = {
  friends: [],
  friendError: '',
  selectedIndex: 0,
  // this messages variable only add because the FlatList doesn't update
  messages: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FRIENDS':
      return {
        ...state,
        ...action.payload,
        messages: action.payload.friends[state.selectedIndex].messages,
      };
    case 'SET_SELECTED_INDEX': {
      return {
        ...state,
        ...action.payload,
        // in a wierd way messages became updated with friends updates
        messages: state.friends[action.payload.selectedIndex].messages,
      };
    }
    case 'MESSAGE_CONFIRMATION': {
      const temp = [...state.friends];
      const {msg} = action.payload;

      const friendIndex = temp.findIndex(
        (friend) => friend.username === msg.receiver,
      );

      let messageFound = false;

      for (let i = temp[friendIndex].messages.length - 1; i >= 0; i--) {
        // this condition means that we arrived at the messages  from the server
        if (temp[friendIndex].messages[i]._id !== undefined) break;
        else if (temp[friendIndex].messages[i].message === msg.message) {
          temp[friendIndex].messages[i].pending = false;
          messageFound = true;
          break;
        }
      }

      if (!messageFound) temp[friendIndex].messages.push(msg);

      return {
        ...state,
        friends: temp,
        // add messages here if any problem with confirmation
      };
    }
    case 'RECEIVE_MESSAGE': {
      const temp = [...state.friends];
      let selectedIndex = state.selectedIndex;

      const {msg} = action.payload;

      const friendIndex = temp.findIndex(
        (friend) => friend.username === msg.sender,
      );

      // sender in friends
      if (friendIndex !== -1) {
        temp[friendIndex].messages.push(msg);
        temp[friendIndex].unRead = true;
        // if we are in the senders chat we make him on top
        if (friendIndex === selectedIndex) {
          selectedIndex = 0;
        } else {
          if (friendIndex > selectedIndex) selectedIndex++;
        }

        // getting the sender friend from the array
        const friend = temp[friendIndex];
        //delteting the friend from the array
        temp.splice(friendIndex, 1);
        // pushing it again at the beggining
        temp.splice(0, 0, friend);

        return {
          ...state,
          friends: temp,
          selectedIndex,
        };
      }
      // sender isn't in friends (so we add it)
      /*else {
        temp.splice(0, 0, {
          username: msg.sender,
          messages: [msg],
          unRead: true,
          typing: false,
        });
        selectedIndex++;
      }*/

      return {
        ...state,
        friends: temp,
        selectedIndex,
      };
    }
    case 'SOMEONE_TYPING': {
      const {typing, typer} = action.payload;
      const temp = [...state.friends];

      const friendIndex = temp.findIndex((friend) => friend.username === typer);

      if (friendIndex !== -1) {
        temp[friendIndex].typing = typing;
      }

      return {
        ...state,
        friends: temp,
      };
    }
    case 'ADD_FRIEND_SUCCESS': {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          `${action.payload.friends[0].username} added to friend list`,
          ToastAndroid.SHORT,
        );
      } else {
        AlertIOS.alert(
          `${action.payload.friends[0].username} added to friend list`,
        );
      }
      return {
        ...state,
        ...action.payload,
        friendError: '',
      };
    }
    case 'ADD_FRIEND_FAILED': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default chatReducer;
