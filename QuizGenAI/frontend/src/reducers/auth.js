import { SIGNUP_SUCCESS, SIGNUP_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT } from "../actions/types";

const initialState = {
  isAuthenticated: false,
};

const auth = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      if(state.signup_message)
        delete state.signup_message;

      if(state.login_message)
      delete state.login_message;

      localStorage.setItem("id", payload._id);
      delete payload._id;
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
      };

    case SIGNUP_FAIL:
      return {
        signup_message: payload,
        isAuthenticated: false
      };

    case LOGIN_FAIL:
      return {
        login_message: payload,
        isAuthenticated: false
      };

    case LOG_OUT:
      localStorage.removeItem("id");
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export default auth;
