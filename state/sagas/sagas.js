import {takeLatest} from 'redux-saga/effects';
import {
  checkLogin,
  userLogin,
  userLogout,
  userRegister,
  checkUserName,
} from './authSaga';
import {setRead, addFriend} from './chatSaga';

export default function* mySaga() {
  // auth
  yield takeLatest('CHECK_LOGIN', checkLogin);
  yield takeLatest('USER_REGISTER', userRegister);
  yield takeLatest('USER_LOGIN', userLogin);
  yield takeLatest('USER_LOGOUT', userLogout);
  yield takeLatest('CHECK_USERNAME', checkUserName);

  // chat
  yield takeLatest('SET_READ', setRead);
  yield takeLatest('ADD_FRIEND', addFriend);
}
