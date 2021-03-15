import { SIGNUP_SUCCESS, SIGNUP_FAIL, LOG_OUT } from ".../actions/types";

const initialState = {
  user: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
      return {
        ...state,
      };

    case SIGNUP_FAIL:
      return {
        ...state,
      };

    case LOG_OUT:
      return {
        ...state,
      };

    default:
      return state;
  }
}