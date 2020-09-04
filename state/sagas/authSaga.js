import {put, call} from 'redux-saga/effects';

//const host = 'https://chettos.herokuapp.com';
const host = 'http://192.168.8.101:5000';

// check if the user is logged in
export function* checkLogin() {
  yield put({type: 'SET_AUTH_LOADING'});

  let friends;

  const newAction = yield call(async () => {
    try {
      const res = await fetch(`${host}/auth/check/loggedin`);

      const data = await res.json();

      const loggedIn = data.loggedIn;
      const user = {username: data.user.username, id: data.user.id};
      friends = data.user.friends;

      return {
        type: 'CHECK_LOGIN_ASYNC',
        payload: {loggedIn, user},
      };
    } catch (error) {
      console.log(error);
    }

    return {type: 'CHECK_LOGIN_ASYNC'};
  });

  if (friends) yield put({type: 'SET_FRIENDS', payload: {friends}});

  yield put(newAction);
}

// login the user
export function* userLogin({payload}) {
  let friends;
  const {username, password} = payload;

  yield put({type: 'SET_AUTH_LOADING'});

  const newAction = yield call(async () => {
    try {
      const res = await fetch(`${host}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      switch (res.status) {
        case 200: {
          let user = await res.json();

          friends = user.friends;
          user = {username: user.username, id: user.id};

          return {type: 'USER_LOGIN_SUCCESS', payload: {user}};
        }
        case 400: {
          const info = await res.json();
          let errorMessages = {};
          if (info.index === 0) errorMessages.username = info.message;
          else errorMessages.password = info.message;

          return {
            type: 'USER_LOGIN_FAILED',
            payload: {errorMessages},
          };
        }
        case 500: {
          return {
            type: 'USER_LOGIN_FAILED',
            payload: {
              errorMessages: {
                other: 'There is a problem with the Server',
              },
            },
          };
        }
        default: {
          return {
            type: 'USER_LOGIN_FAILED',
            payload: {
              errorMessages: {
                other: 'Something went Wrong',
              },
            },
          };
        }
      }
    } catch (err) {
      console.log(err);
    }

    return {
      type: 'USER_LOGIN_FAILED',
      payload: {
        errorMessages: {
          other: 'Something went Wrong',
        },
      },
    };
  });

  if (friends) yield put({type: 'SET_FRIENDS', payload: {friends}});

  yield put(newAction);
}

// register the user
export function* userRegister({payload}) {
  yield put({type: 'SET_AUTH_LOADING'});

  const newAction = yield call(async () => {
    const {username, password} = payload;

    try {
      const res = await fetch(`${host}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });

      switch (res.status) {
        case 200: {
          return {
            type: 'USER_REGISTER_SUCCESS',
          };
        }
        case 400: {
          const data = await res.json();
          let errorMessages = {};
          if (data.index === 0) errorMessages.username = data.message;
          else errorMessages.password = data.message;
          return {
            type: 'USER_REGISTER_FAILED',
            payload: {errorMessages},
          };
        }
        case 409: {
          const errorMessage = await res.json();
          return {
            type: 'USER_REGISTER_FAILED',
            payload: {errorMessages: {username: errorMessage}},
          };
        }
        case 500: {
          return {
            type: 'USER_REGISTER_FAILED',
            payload: {
              errorMessages: {other: 'There is a problem with the Server'},
            },
          };
        }
        default: {
          return {
            type: 'USER_REGISTER_FAILED',
            payload: {
              errorMessages: {other: 'Something went Wrong'},
            },
          };
        }
      }
    } catch (error) {
      console.log(error);
    }

    return {
      type: 'USER_REGISTER_FAILED',
      payload: {
        errorMessages: {other: 'Something went Wrong'},
      },
    };
  });

  yield put(newAction);
}

// logout the user
export function* userLogout() {
  yield put({type: 'USER_LOADING'});
  const result = yield call(async () => {
    const data = {user: {}, errorMessage: ''};
    try {
      const res = await fetch(`${host}/auth/logout`);

      if (res.status === 200) {
        data.loggedIn = false;
      }
    } catch (err) {
      console.log(`Error: ${err}`);
      data.loggedIn = false;
    }
    return data;
  });

  yield put({type: 'USER_LOGOUT_ASYNC', ...result});
}

// check if the username is available
export function* checkUserName({payload}) {
  const newAction = yield call(async () => {
    try {
      const {username} = payload;

      const res = await fetch(`${host}/auth/check/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
      });

      switch (res.status) {
        case 200: {
          const userAvailable = await res.json();
          let errorMessages = {};
          if (!userAvailable)
            errorMessages = {username: `User ${username} Already exists`};
          else errorMessages = {username: '', other: ''};
          return {
            type: 'CHECK_USERNAME_SUCCESS',
            payload: {
              errorMessages,
            },
          };
        }
        case 500: {
          return {
            type: 'CHECK_USERNAME_FAILED',
            payload: {
              errorMessage: {other: 'There is a problem with the Server'},
            },
          };
        }
        default: {
          return {
            type: 'CHECK_USERNAME_FAILED',
            payload: {errorMessages: {other: 'Something went Wrong'}},
          };
        }
      }
    } catch (error) {
      console.log(error);
    }

    return {
      type: 'CHECK_USERNAME_FAILED',
      payload: {errorMessages: {other: 'Something went Wrong'}},
    };
  });

  yield put(newAction);
}
