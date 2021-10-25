import {GET_SPECIFIC_QUIZ, GET_SPECIFIC_QUIZ_FAIL, RESET_SHOW_QUIZ, LOG_OUT} from "../actions/types";

const initialState = {
};

const show_specific_quiz = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_SPECIFIC_QUIZ:
      if(state.message)
        delete state.message;
      return {
        ...state,
        ...payload
      };

    case GET_SPECIFIC_QUIZ_FAIL:
      return {
        message: payload,
      };

    case RESET_SHOW_QUIZ:
      return {
        ...initialState
      };

    case LOG_OUT:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export default show_specific_quiz;