import { SIGNUP_SUCCESS, SIGNUP_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, AUTH_ERROR_DELETE, LOG_OUT } from "../actions/types";

const initialState = {
  isAuthenticated: false,
};

const auth = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      if(state.signup_error)
        delete state.signup_error;

      if(state.login_error)
      delete state.login_error;

      localStorage.setItem("id", payload._id);
      delete payload._id;
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
      };

    case SIGNUP_FAIL:
      return {
        signup_error: payload,
        isAuthenticated: false
      };

    case LOGIN_FAIL:
      return {
        login_error: payload,
        isAuthenticated: false
      };

    case AUTH_ERROR_DELETE:
      if(state.signup_error)
        delete state.signup_error;

      if(state.login_error)
        delete state.login_error;

      return {
        ...state,
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
