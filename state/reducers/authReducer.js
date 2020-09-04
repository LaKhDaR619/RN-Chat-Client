// to save time
const emptyInputs = {username: '', password: ''};
const emptyError = {username: '', password: '', other: ''};

const initialState = {
  loggedIn: false,
  user: {},
  authLoading: true,
  inputFields: emptyInputs,
  errorMessages: emptyError,
  // extra
  currentRoute: 'Register',
};

const loginReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case 'CHECK_LOGIN_ASYNC':
      return {
        ...state,
        ...action.payload,
        authLoading: false,
      };
    case 'USER_LOGIN_SUCCESS':
      return {
        ...state,
        authLoading: false,
        loggedIn: true,
        errorMessages: emptyError,
        ...action.payload,
      };
    case 'USER_LOGIN_FAILED':
      return {
        ...state,
        authLoading: false,
        loggedIn: false,
        user: {},
        currentRoute: 'Login',
        ...action.payload,
      };
    case 'USER_REGISTER_SUCCESS':
      return {
        ...state,
        errorMessages: emptyError,
        authLoading: false,
        loggedIn: false,
        user: {},
        currentRoute: 'Login',
      };
    case 'USER_REGISTER_FAILED':
      return {
        ...state,
        authLoading: false,
        loggedIn: false,
        user: {},
        currentRoute: 'Register',
        ...action.payload,
      };
    case 'CHECK_USERNAME_SUCCESS':
      return {
        ...state,
        ...action.payload,
      };
    case 'CHECK_USERNAME_FAILED':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_INPUT_FIELDS':
      return {
        ...state,
        inputFields: action.payload,
      };
    // reset inputs and logins
    case 'RESET_IE': {
      return {
        ...state,
        inputFields: emptyInputs,
        errorMessages: emptyError,
      };
    }

    case 'USER_LOGOUT_ASYNC':
      return {
        ...state,
        authLoading: false,
        loggedIn: action.loggedIn,
        user: action.user,
        errorMessages: emptyError,
      };
    case 'SET_AUTH_LOADING':
      return {...state, authLoading: true};
    default:
      return state;
  }
};

export default loginReducer;
