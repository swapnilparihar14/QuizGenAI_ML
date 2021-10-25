import {
  TAKE_PRACTICE_QUIZ_FAIL,
  TAKE_PRACTICE_QUIZ,
  RESET_PRACTICE_QUIZ,
  LOG_OUT,
} from "../actions/types";

const initialState = {};

const take_practice_quiz = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TAKE_PRACTICE_QUIZ:
      if (state.message) delete state.message;
      return {
        ...state,
        ...payload,
      };

    case RESET_PRACTICE_QUIZ:
      return {};

    case TAKE_PRACTICE_QUIZ_FAIL:
      return {
        message: payload,
      };

    case LOG_OUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default take_practice_quiz;
