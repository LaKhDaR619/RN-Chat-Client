import {put, call} from 'redux-saga/effects';

const host = 'https://chettos.herokuapp.com';
//const host = 'http://192.168.8.101:5000';

export function* setRead({payload}) {
  let {friends, index} = payload;
  const temp = [...friends];

  const newAction = yield call(() => {
    try {
      // trying a methode send and not check if it is success (like facebook)
      fetch(`${host}/chat/messageRead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({friendName: friends[index].username}),
      });
    } catch (error) {
      console.log('error');
      console.log(error);
    }
    // just changing it locally
    temp[index].unRead = false;
    return {type: 'SET_FRIENDS', payload: {friends: temp}};
  });

  yield put(newAction);
}

export function* addFriend({payload}) {
  let {id, friends} = payload;
  const temp = [...friends];

  const newAction = yield call(async () => {
    try {
      // trying a methode send and not check if it is success (like facebook)
      const res = await fetch(`${host}/chat/addFriend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id}),
      });

      if (res.status === 200) {
        const friend = await res.json();
        temp.splice(0, 0, friend);

        return {type: 'ADD_FRIEND_SUCCESS', payload: {friends: temp}};
      } else if (res.status === 400) {
        const {error} = await res.json();
        return {
          type: 'ADD_FRIEND_FAILED',
          payload: {friendError: error},
        };
      } else {
        return {
          type: 'ADD_FRIEND_FAILED',
          payload: {friendError: 'Something went wrong'},
        };
      }
    } catch (error) {
      console.log(error);
      return {
        type: 'ADD_FRIEND_FAILED',
        payload: {friendError: 'Something went wrong'},
      };
    }
  });

  yield put(newAction);
}
