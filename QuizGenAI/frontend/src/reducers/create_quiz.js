import { CREATE_QUIZ_SUCCESS, CREATE_QUIZ_FAIL } from "../actions/types";

const initialState = {
};

const auth = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_QUIZ_SUCCESS:
      return {
        ...state,
        ...payload
      };

    case CREATE_QUIZ_FAIL:
      return {
        message: payload,
      };

    default:
      return state;
  }
}

export default auth;
