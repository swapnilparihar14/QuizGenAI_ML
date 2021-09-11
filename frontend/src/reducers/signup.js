import { SIGNUP_SUCCESS, SIGNUP_FAIL, LOG_OUT } from "../actions/types";

const initialState = {
  isAuthenticated: null,
};

const signup = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
      localStorage.setItem("id", payload._id);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
      };

    case SIGNUP_FAIL:
    case LOG_OUT:
      localStorage.removeItem("id");
      return {
        isAuthenticated: false,
      };

    default:
      return state;
  }
}

export default signup;
