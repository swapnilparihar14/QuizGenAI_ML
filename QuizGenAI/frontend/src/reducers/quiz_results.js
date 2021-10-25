import {
  SUBMIT_QUIZ,
  SUBMIT_QUIZ_FAIL,
  RESET_QUIZ_RESULTS,
  LOG_OUT,
} from "../actions/types";

const initialState = {};

const quiz_results = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SUBMIT_QUIZ:
      console.log("submit quiz");
      if (state.message) delete state.message;
      return {
        ...state,
        ...payload,
      };

    case SUBMIT_QUIZ_FAIL:
      return {
        message: payload,
      };

    case LOG_OUT:
      return {
        ...initialState,
      };

    case RESET_QUIZ_RESULTS:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default quiz_results;
